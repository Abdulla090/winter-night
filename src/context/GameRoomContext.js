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
                    setGameState(payload.new);
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
                if (status === 'SUBSCRIBED' && profile) {
                    await presenceChannel.track({
                        username: profile.username,
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
        if (!user || !profile) {
            setError('You must be logged in to create a room');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            // Generate unique room code
            let roomCode = generateRoomCode();
            let attempts = 0;

            // Check if code exists, regenerate if needed
            while (attempts < 5) {
                const { data: existing } = await supabase
                    .from('game_rooms')
                    .select('id')
                    .eq('room_code', roomCode)
                    .maybeSingle();

                if (!existing) break;
                roomCode = generateRoomCode();
                attempts++;
            }

            // Create room
            const { data: room, error: roomError } = await supabase
                .from('game_rooms')
                .insert({
                    host_id: user.id,
                    room_code: roomCode,
                    game_type: gameType || 'quiz', // Default to 'quiz' to prevent null error if DB requires it
                    room_name: roomName,
                })
                .select()
                .single();

            if (roomError) throw roomError;

            // Add host as player
            const { error: playerError } = await supabase
                .from('room_players')
                .insert({
                    room_id: room.id,
                    player_id: user.id,
                    is_ready: true,
                });

            if (playerError) throw playerError;

            // Create initial game state
            const { error: stateError } = await supabase
                .from('game_states')
                .insert({
                    room_id: room.id,
                    current_player_id: user.id,
                    game_phase: 'lobby',
                });

            if (stateError) throw stateError;

            setCurrentRoom(room);
            return { success: true, data: room };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = async (roomCode) => {
        if (!user || !profile) {
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

            // Immediately fetch latest state to ensure UI is ready
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
        } catch (err) {
            setError(err.message);
        }
    };

    const startGame = async () => {
        if (!currentRoom || currentRoom.host_id !== user?.id) return { success: false, error: 'Unauthorized' };

        // Check if all players are ready
        const allReady = players.every(p => p.is_ready);
        if (!allReady) {
            const msg = 'Not all players are ready';
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

            // Set up initial game state
            await updateGameState({
                game_phase: 'playing',
                round_number: 1,
                scores: initialScores,
                current_question: {
                    phase: 'choose',
                    player_index: 0,
                    chosen_type: null,
                    challenge: '',
                },
            });
            return { success: true };
        } catch (err) {
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
        clearError: () => setError(null),
    };

    return (
        <GameRoomContext.Provider value={value}>
            {children}
        </GameRoomContext.Provider>
    );
};

export default GameRoomContext;
