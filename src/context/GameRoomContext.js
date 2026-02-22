import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, generateRoomCode } from '../lib/supabase';
import { useAuth } from './AuthContext';

const GameRoomContext = createContext({});

export const useGameRoom = () => useContext(GameRoomContext);

export const GameRoomProvider = ({ children }) => {
    const { user, profile } = useAuth();
    const [currentRoom, setCurrentRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [onlinePlayers, setOnlinePlayers] = useState({});

    // Subscribe to room changes
    useEffect(() => {
        if (!currentRoom) return;

        // Subscribe to room players
        const playersChannel = supabase
            .channel(`room_players:${currentRoom.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'room_players',
                    filter: `room_id=eq.${currentRoom.id}`,
                },
                () => {
                    fetchPlayers(currentRoom.id);
                }
            )
            .subscribe();

        // Subscribe to game state
        const gameStateChannel = supabase
            .channel(`game_state:${currentRoom.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'game_states',
                    filter: `room_id=eq.${currentRoom.id}`,
                },
                (payload) => {
                    console.log('Game state update:', payload.new);
                    setGameState(payload.new);
                }
            )
            .subscribe();

        // Subscribe to room updates (for game_type changes)
        const roomChannel = supabase
            .channel(`room_updates:${currentRoom.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'game_rooms',
                    filter: `id=eq.${currentRoom.id}`,
                },
                (payload) => {
                    console.log('Room update:', payload.new);
                    setCurrentRoom(prev => ({ ...prev, ...payload.new }));
                }
            )
            .subscribe();

        // Presence for online status
        const presenceChannel = supabase.channel(`presence:${currentRoom.id}`, {
            config: { presence: { key: user?.id } },
        });

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const online = {};
                Object.keys(state).forEach(key => {
                    online[key] = true;
                });
                setOnlinePlayers(online);
            })
            .on('presence', { event: 'join' }, ({ key }) => {
                setOnlinePlayers(prev => ({ ...prev, [key]: true }));
            })
            .on('presence', { event: 'leave' }, ({ key }) => {
                setOnlinePlayers(prev => {
                    const updated = { ...prev };
                    delete updated[key];
                    return updated;
                });
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED' && user) {
                    await presenceChannel.track({
                        username: profile?.username || user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'Player'),
                        online_at: new Date().toISOString(),
                    });
                }
            });

        // Fetch initial data
        fetchPlayers(currentRoom.id);
        fetchGameState(currentRoom.id);

        return () => {
            playersChannel.unsubscribe();
            gameStateChannel.unsubscribe();
            roomChannel.unsubscribe();
            presenceChannel.unsubscribe();
        };
    }, [currentRoom?.id, user?.id, profile]);

    const fetchPlayers = async (roomId) => {
        const { data, error } = await supabase
            .from('room_players')
            .select(`
                *,
                player:profiles(id, username, avatar_url)
            `)
            .eq('room_id', roomId)
            .order('joined_at', { ascending: true });

        if (!error) {
            setPlayers(data || []);
        }
    };

    const fetchGameState = async (roomId) => {
        const { data } = await supabase
            .from('game_states')
            .select('*')
            .eq('room_id', roomId)
            .maybeSingle();

        setGameState(data);
    };

    const createRoom = async (gameType, roomName) => {
        const username = profile?.username || user?.user_metadata?.username;
        console.log('createRoom called with:', { gameType, roomName, user: user?.id, username });

        if (!user) {
            const msg = 'You must be logged in to create a room';
            console.log('createRoom error:', msg);
            setError(msg);
            return { success: false, error: msg };
        }

        try {
            setLoading(true);
            setError(null);

            // Generate unique room code
            let attempts = 0;
            let room = null;
            let roomCode = generateRoomCode();

            while (attempts < 5 && !room) {
                console.log(`Attempt ${attempts + 1}: Generating and inserting room code ${roomCode}...`);

                const { data, error: roomError } = await supabase
                    .from('game_rooms')
                    .insert({
                        host_id: user.id,
                        room_code: roomCode,
                        game_type: gameType || 'truthordare',
                        room_name: roomName,
                    })
                    .select()
                    .single();

                if (roomError) {
                    console.log('Room creation error (possibly duplicate code):', roomError);
                    // generate a new code and retry
                    roomCode = generateRoomCode();
                    attempts++;
                } else {
                    room = data;
                }
            }

            if (!room) {
                throw new Error("Failed to generate a unique room code. Try again.");
            }

            console.log('Room created successfully:', room);

            // Add host as player (already ready)
            console.log('Adding host as player...');
            const { error: playerError } = await supabase
                .from('room_players')
                .insert({
                    room_id: room.id,
                    player_id: user.id,
                    is_ready: true,
                });

            if (playerError) {
                console.log('Player insert error:', playerError);
                throw playerError;
            }
            console.log('Host added as player');

            // Create initial game state
            console.log('Creating game state...');
            const { error: stateError } = await supabase
                .from('game_states')
                .insert({
                    room_id: room.id,
                    current_player_id: user.id,
                    game_phase: 'lobby',
                });

            if (stateError) {
                console.log('Game state error:', stateError);
                throw stateError;
            }
            console.log('Game state created');

            setCurrentRoom(room);
            console.log('Room creation complete! Success.');
            return { success: true, data: room };
        } catch (err) {
            console.log('createRoom caught error:', err.message);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = async (roomCode) => {
        if (!user) {
            const msg = 'You must be logged in to join a room';
            setError(msg);
            return { success: false, error: msg };
        }

        if (!roomCode || typeof roomCode !== 'string' || roomCode.trim().length === 0) {
            const msg = 'Invalid room code';
            setError(msg);
            return { success: false, error: msg };
        }

        try {
            setLoading(true);
            setError(null);

            // Find room
            const { data: room, error: roomError } = await supabase
                .from('game_rooms')
                .select('*')
                .eq('room_code', roomCode.toUpperCase())
                .eq('is_active', true)
                .maybeSingle();

            if (roomError || !room) {
                throw new Error('Room not found or no longer active');
            }

            // Check if already in room
            const { data: existingPlayer } = await supabase
                .from('room_players')
                .select('id')
                .eq('room_id', room.id)
                .eq('player_id', user.id)
                .maybeSingle();

            if (!existingPlayer) {
                // Check player count
                const { count } = await supabase
                    .from('room_players')
                    .select('*', { count: 'exact', head: true })
                    .eq('room_id', room.id);

                if (count >= room.max_players) {
                    throw new Error('Room is full');
                }

                // Join room
                const { error: joinError } = await supabase
                    .from('room_players')
                    .insert({
                        room_id: room.id,
                        player_id: user.id,
                    });

                if (joinError) throw joinError;
            }

            setCurrentRoom(room);

            // Immediately fetch latest state
            await Promise.all([
                fetchPlayers(room.id),
                fetchGameState(room.id)
            ]);

            return { success: true, data: room };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const leaveRoom = async () => {
        if (!currentRoom || !user) return;

        try {
            setLoading(true);

            // Remove player from room
            await supabase
                .from('room_players')
                .delete()
                .eq('room_id', currentRoom.id)
                .eq('player_id', user.id);

            // If host is leaving, deactivate the room
            if (currentRoom.host_id === user.id) {
                await supabase
                    .from('game_rooms')
                    .update({ is_active: false })
                    .eq('id', currentRoom.id);
            } else {
                // Check if room is now empty and clean up
                const { count } = await supabase
                    .from('room_players')
                    .select('*', { count: 'exact', head: true })
                    .eq('room_id', currentRoom.id);

                if (count === 0) {
                    // No players left, mark room as inactive
                    await supabase
                        .from('game_rooms')
                        .update({ is_active: false })
                        .eq('id', currentRoom.id);
                }
            }

            setCurrentRoom(null);
            setPlayers([]);
            setGameState(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // End game and cleanup room
    const endGame = async () => {
        if (!currentRoom) return;

        try {
            setLoading(true);

            // Update game state to finished
            await supabase
                .from('game_states')
                .update({ game_phase: 'finished', updated_at: new Date().toISOString() })
                .eq('room_id', currentRoom.id);

            // Mark room as inactive
            await supabase
                .from('game_rooms')
                .update({ is_active: false })
                .eq('id', currentRoom.id);

            // Clear local state
            setCurrentRoom(null);
            setPlayers([]);
            setGameState(null);

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const toggleReady = async () => {
        if (!currentRoom || !user) return;

        const currentPlayer = players.find(p => p.player_id === user.id);
        if (!currentPlayer) return;

        try {
            await supabase
                .from('room_players')
                .update({ is_ready: !currentPlayer.is_ready })
                .eq('room_id', currentRoom.id)
                .eq('player_id', user.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateGameState = async (updates) => {
        if (!currentRoom) return;

        try {
            const { error } = await supabase
                .from('game_states')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('room_id', currentRoom.id);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const startGame = async () => {
        if (!currentRoom || currentRoom.host_id !== user?.id) {
            return { success: false, error: 'Only host can start the game' };
        }

        // Check if all players are ready
        const allReady = players.every(p => p.is_ready);
        if (!allReady) {
            const msg = 'Not all players are ready';
            setError(msg);
            return { success: false, error: msg };
        }

        if (players.length < 2) {
            const msg = 'Need at least 2 players';
            setError(msg);
            return { success: false, error: msg };
        }

        try {
            setLoading(true);

            // Initialize scores for all players
            const initialScores = {};
            players.forEach(p => {
                const username = p.player?.username || 'Player';
                initialScores[username] = 0;
            });

            console.log('Starting game with:', {
                game_type: currentRoom.game_type,
                players: players.length,
                scores: initialScores
            });

            // Set up initial game state - THIS IS THE KEY UPDATE
            const { error: updateError } = await supabase
                .from('game_states')
                .update({
                    game_phase: 'playing',
                    round_number: 1,
                    scores: initialScores,
                    current_question: {
                        phase: 'choose',
                        player_index: 0,
                        chosen_type: null,
                        challenge: '',
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq('room_id', currentRoom.id);

            if (updateError) {
                console.error('Error starting game:', updateError);
                throw updateError;
            }

            console.log('Game started successfully!');
            return { success: true };
        } catch (err) {
            console.error('Start game error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Host selects game type
    const selectGame = async (gameType) => {
        if (!currentRoom || currentRoom.host_id !== user?.id) {
            const msg = 'Only the host can select the game';
            setError(msg);
            return { success: false, error: msg };
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('game_rooms')
                .update({ game_type: gameType })
                .eq('id', currentRoom.id)
                .select()
                .single();

            if (error) throw error;

            setCurrentRoom(data);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentRoom,
        players,
        gameState,
        loading,
        error,
        onlinePlayers,
        isHost: currentRoom?.host_id === user?.id,
        createRoom,
        joinRoom,
        leaveRoom,
        toggleReady,
        updateGameState,
        startGame,
        selectGame,
        endGame,
        clearError: () => setError(null),
    };

    return (
        <GameRoomContext.Provider value={value}>
            {children}
        </GameRoomContext.Provider>
    );
};

export default GameRoomContext;
