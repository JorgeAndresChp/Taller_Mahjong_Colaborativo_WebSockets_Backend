import { useState, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { type GameState } from '../types';

const SOCKET_URL = 'http://localhost:3001';

interface UseSocketReturn {
  gameState: GameState | null;
  isConnected: boolean;
  currentPlayerId: string | null;
  joinGame: (name: string) => void;
  selectTile: (tileId: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setIsConnected(true);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Handle game state updates
    socket.on('game:state', (state: GameState) => {
      console.log('Received game state:', state);
      setGameState(state);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = (name: string) => {
    if (socketRef.current) {
      socketRef.current.emit('player:join', { name }, (playerId: string) => {
        console.log('Joined game with ID:', playerId);
        setCurrentPlayerId(playerId);
      });
    }
  };

  const selectTile = (tileId: string) => {
    if (socketRef.current && currentPlayerId) {
      socketRef.current.emit('tile:select', { tileId });
      console.log('Selected tile:', tileId);
    }
  };

  return {
    gameState,
    isConnected,
    currentPlayerId,
    joinGame,
    selectTile,
  };
};