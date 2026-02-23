import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

    // Refs for stable channel references (prevents re-subscribe loops)
    const channelsRef = useRef([]);
    const roomIdRef = useRef(null);

    // Helper to get auth token (bypasses supabase client hang on web)
    const getAuthToken = useCallback(async () => {
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
    }, []);

    // Helper to make authenticated fetch calls to Supabase REST API
    const supabaseFetch = useCallback(async (path, options = {}) => {
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
    }, [getAuthToken]);

    // Fetch players for a room
    const fetchPlayers = useCallback(async (roomId) => {
        try {
            const { data, error: fetchError } = await supabase
                .from('room_players')
                .select(`
                    *,
                    player:profiles(id, username, avatar_url)
                `)
                .eq('room_id', roomId)
                .order('joined_at', { ascending: true });

            if (!fetchError) {
                setPlayers(data || []);
            }
        } catch (e) {
            console.log('fetchPlayers error:', e);
        }
    }, []);

    // Fetch game state for a room
    const fetchGameState = useCallback(async (roomId) => {
        try {
            const { data } = await supabase
                .from('game_states')
                .select('*')
                .eq('room_id', roomId)
                .maybeSingle();
            setGameState(data);
        } catch (e) {
            console.log('fetchGameState error:', e);
        }
    }, []);

    // Cleanup all channels
    const cleanupChannels = useCallback(() => {
        channelsRef.current.forEach(ch => {
            try { ch.unsubscribe(); } catch (e) { /* ignore */ }
        });
        channelsRef.current = [];
    }, []);

    // Subscribe to room changes — only depends on room ID and user ID (stable)
    useEffect(() => {
        const roomId = currentRoom?.id;
        const userId = user?.id;

        // If same room, skip re-subscribing
        if (roomId === roomIdRef.current) return;
        roomIdRef.current = roomId;

        // Cleanup previous subscriptions
        cleanupChannels();

        if (!roomId || !userId) return;

        // 1. Players channel
        const playersChannel = supabase
            .channel(`room_players:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'room_players',
                    filter: `room_id=eq.${roomId}`,
                },
                () => {
                    fetchPlayers(roomId);
                }
            )
            .subscribe();

        // 2. Game state channel
        const gameStateChannel = supabase
            .channel(`game_state:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'game_states',
                    filter: `room_id=eq.${roomId}`,
                },
                (payload) => {
                    setGameState(payload.new);
                }
            )
            .subscribe();

        // 3. Room updates channel (game_type changes, room deletion, etc.)
        const roomChannel = supabase
            .channel(`room_updates:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'game_rooms',
                    filter: `id=eq.${roomId}`,
                },
                (payload) => {
                    setCurrentRoom(prev => ({ ...prev, ...payload.new }));
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'game_rooms',
                    filter: `id=eq.${roomId}`,
                },
                () => {
                    // Room was deleted (host left) — clear local state
                    cleanupChannels();
                    setCurrentRoom(null);
                    setPlayers([]);
                    setGameState(null);
                }
            )
            .subscribe();

        // 4. Presence for online status
        const username = profile?.username || user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'Player');
        const presenceChannel = supabase.channel(`presence:${roomId}`, {
            config: { presence: { key: userId } },
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
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        username,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        // Store all channel refs
        channelsRef.current = [playersChannel, gameStateChannel, roomChannel, presenceChannel];

        // Fetch initial data
        fetchPlayers(roomId);
        fetchGameState(roomId);

        return () => {
            cleanupChannels();
            roomIdRef.current = null;
        };
    }, [currentRoom?.id, user?.id]);
    // Deliberately NOT including profile — it causes subscription churn

    const createRoom = async (gameType, roomName) => {
        const username = profile?.username || user?.user_metadata?.username;

        if (!user) {
            const msg = 'You must be logged in to create a room';
            setError(msg);
            return { success: false, error: msg };
        }

        try {
            setLoading(true);
            setError(null);

            // Cleanup: mark old rooms by this user as inactive (fire-and-forget, won't block)
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
            supabase
                .from('game_rooms')
                .update({ is_active: false })
                .eq('host_id', user.id)
                .lt('created_at', twoHoursAgo)
                .then(() => { })
                .catch(() => { });

            const token = await getAuthToken();
            if (!token) {
                throw new Error('Session expired. Please log in again.');
            }

            const headers = {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Prefer': 'return=representation',
            };

            const roomCode = generateRoomCode();

            // Step 1: Create room
            const roomRes = await fetch(`${supabaseUrl}/rest/v1/game_rooms`, {
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
                throw new Error(`Room creation failed (${roomRes.status})`);
            }

            const rooms = await roomRes.json();
            const room = Array.isArray(rooms) ? rooms[0] : rooms;

            // Step 2: Add host as player
            const playerRes = await fetch(`${supabaseUrl}/rest/v1/room_players`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    room_id: room.id,
                    player_id: user.id,
                    is_ready: true,
                }),
            });

            if (!playerRes.ok) {
                console.log('Player insert failed:', playerRes.status);
            }

            // Step 3: Create game state
            const stateRes = await fetch(`${supabaseUrl}/rest/v1/game_states`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    room_id: room.id,
                    current_player_id: user.id,
                    game_phase: 'lobby',
                }),
            });

            if (!stateRes.ok) {
                console.log('State insert failed:', stateRes.status);
            }

            setCurrentRoom(room);
            return { success: true, data: room };
        } catch (err) {
            setError(err.message || 'Unknown error creating room');
            return { success: false, error: err.message || 'Unknown error' };
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

        const roomId = currentRoom.id;
        const wasHost = currentRoom.host_id === user.id;

        try {
            setLoading(true);

            // Remove player from room
            await supabase
                .from('room_players')
                .delete()
                .eq('room_id', roomId)
                .eq('player_id', user.id);

            // Check remaining players
            const { count } = await supabase
                .from('room_players')
                .select('*', { count: 'exact', head: true })
                .eq('room_id', roomId);

            if (count === 0 || wasHost) {
                // Room is empty or host left — full cleanup
                // Delete game states first (FK dependency)
                await supabase
                    .from('game_states')
                    .delete()
                    .eq('room_id', roomId);

                // Delete remaining players (if host left but others were there)
                await supabase
                    .from('room_players')
                    .delete()
                    .eq('room_id', roomId);

                // Delete the room itself
                await supabase
                    .from('game_rooms')
                    .delete()
                    .eq('id', roomId);
            }

            // Cleanup channels before clearing state
            cleanupChannels();
            setCurrentRoom(null);
            setPlayers([]);
            setGameState(null);
        } catch (err) {
            // Still clear local state even if DB cleanup fails
            cleanupChannels();
            setCurrentRoom(null);
            setPlayers([]);
            setGameState(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // End game and cleanup room
    const endGame = async () => {
        if (!currentRoom) return;

        const roomId = currentRoom.id;

        try {
            setLoading(true);

            // Delete game states
            await supabase
                .from('game_states')
                .delete()
                .eq('room_id', roomId);

            // Delete all players
            await supabase
                .from('room_players')
                .delete()
                .eq('room_id', roomId);

            // Delete the room
            await supabase
                .from('game_rooms')
                .delete()
                .eq('id', roomId);

            // Cleanup
            cleanupChannels();
            setCurrentRoom(null);
            setPlayers([]);
            setGameState(null);

            return { success: true };
        } catch (err) {
            // Still clear local state
            cleanupChannels();
            setCurrentRoom(null);
            setPlayers([]);
            setGameState(null);
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

    const updateGameState = useCallback(async (updates) => {
        if (!currentRoom) return;

        try {
            const { error: updateError } = await supabase
                .from('game_states')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('room_id', currentRoom.id);

            if (updateError) throw updateError;
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [currentRoom?.id]);

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

            // Set up initial game state
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
                throw updateError;
            }

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
            const { data, error: updateError } = await supabase
                .from('game_rooms')
                .update({ game_type: gameType })
                .eq('id', currentRoom.id)
                .select()
                .single();

            if (updateError) throw updateError;

            setCurrentRoom(data);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Send a broadcast message to all players (for lightweight real-time events)
    const broadcast = useCallback(async (event, payload) => {
        if (!currentRoom) return;
        const channel = supabase.channel(`broadcast:${currentRoom.id}`);
        await channel.send({
            type: 'broadcast',
            event,
            payload,
        });
    }, [currentRoom?.id]);

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
        broadcast,
        clearError: () => setError(null),
    };

    return (
        <GameRoomContext.Provider value={value}>
            {children}
        </GameRoomContext.Provider>
    );
};

export default GameRoomContext;
