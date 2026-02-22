import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { supabase, generateRoomCode, supabaseUrl, supabaseAnonKey } from '../lib/supabase';
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

            // Get auth token - bypass supabase client on web (it hangs)
            let token = null;
            if (Platform.OS === 'web') {
                try {
                    const storageKey = 'sb-babwvpzevcyaltmslqfu-auth-token';
                    const stored = localStorage.getItem(storageKey);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        token = parsed?.access_token;
                    }
                } catch (e) {
                    console.log('Failed to read token from localStorage:', e);
                }
            } else {
                const { data: sessionData } = await supabase.auth.getSession();
                token = sessionData?.session?.access_token;
            }

            if (!token) {
                throw new Error('Session expired. Please log in again.');
            }
            console.log('Got auth token, proceeding...');

            const SUPABASE_URL = supabaseUrl;
            const SUPABASE_KEY = supabaseAnonKey;

            const headers = {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${token}`,
                'Prefer': 'return=representation',
            };

            const roomCode = generateRoomCode();
            console.log('Step 1: Creating room with code:', roomCode);

            // Step 1: Create room via raw fetch
            const roomRes = await fetch(`${SUPABASE_URL}/rest/v1/game_rooms`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    host_id: user.id,
                    room_code: roomCode,
                    game_type: gameType || 'truthordare',
                    room_name: roomName,
                }),
            });

            if (!roomRes.ok) {
                const errBody = await roomRes.text();
                console.log('Room insert failed:', roomRes.status, errBody);
                throw new Error(`Room creation failed (${roomRes.status})`);
            }

            const rooms = await roomRes.json();
            const room = Array.isArray(rooms) ? rooms[0] : rooms;
            console.log('Step 1 complete. Room:', room.id);

            // Step 2: Add host as player
            console.log('Step 2: Adding host as player...');
            const playerRes = await fetch(`${SUPABASE_URL}/rest/v1/room_players`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    room_id: room.id,
                    player_id: user.id,
                    is_ready: true,
                }),
            });

            if (!playerRes.ok) {
                const errBody = await playerRes.text();
                console.log('Player insert failed:', playerRes.status, errBody);
            }
            console.log('Step 2 complete.');

            // Step 3: Create game state
            console.log('Step 3: Creating game state...');
            const stateRes = await fetch(`${SUPABASE_URL}/rest/v1/game_states`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    room_id: room.id,
                    current_player_id: user.id,
                    game_phase: 'lobby',
                }),
            });

            if (!stateRes.ok) {
                const errBody = await stateRes.text();
                console.log('State insert failed:', stateRes.status, errBody);
            }
            console.log('Step 3 complete.');

            setCurrentRoom(room);
            console.log('Room creation complete! Navigating to lobby.');
            return { success: true, data: room };
        } catch (err) {
            console.log('createRoom caught error:', err.message || err);
            setError(err.message || 'Unknown error creating room');
            return { success: false, error: err.message || 'Unknown error' };
        } finally {
            setLoading(false);
        }
    };

    // Helper to get auth token (bypasses supabase client hang on web)
    const getAuthToken = async () => {
        if (Platform.OS === 'web') {
            try {
                const storageKey = 'sb-babwvpzevcyaltmslqfu-auth-token';
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return parsed?.access_token;
                }
            } catch (e) {
                console.log('Failed to read token from localStorage:', e);
            }
            return null;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        return sessionData?.session?.access_token;
    };

    // Helper to make authenticated fetch calls to Supabase REST API
    const supabaseFetch = async (path, options = {}) => {
        const token = await getAuthToken();
        if (!token) throw new Error('Session expired. Please log in again.');
        const headers = {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${token}`,
            'Prefer': options.prefer || 'return=representation',
        };
        const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
            method: options.method || 'GET',
            headers,
            ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        });
        if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Supabase ${path} failed (${res.status}): ${errBody}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
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

            // Find room via raw fetch (avoids supabase client hang on web)
            const rooms = await supabaseFetch(
                `game_rooms?room_code=eq.${roomCode.toUpperCase()}&is_active=eq.true&select=*`
            );
            const room = Array.isArray(rooms) ? rooms[0] : rooms;

            if (!room) {
                throw new Error('Room not found or no longer active');
            }

            // Check if already in room
            const existing = await supabaseFetch(
                `room_players?room_id=eq.${room.id}&player_id=eq.${user.id}&select=id`
            );

            if (!existing || existing.length === 0) {
                // Check player count
                const playerCount = await supabaseFetch(
                    `room_players?room_id=eq.${room.id}&select=id`
                );

                if (playerCount && playerCount.length >= room.max_players) {
                    throw new Error('Room is full');
                }

                // Join room
                await supabaseFetch('room_players', {
                    method: 'POST',
                    body: { room_id: room.id, player_id: user.id },
                });
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
