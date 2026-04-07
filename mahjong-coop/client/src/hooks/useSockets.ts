import { useState, useEffect } from 'react';
import { type GameState } from '../types';

// Mock symbols for Mahjong
const SYMBOLS = ['🀄', '🀅', '🀆', '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', '🀐', '🀑', '🀒', '🀓', '🀔', '🀕'];

const generateTiles = () => {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  return pairs.sort(() => Math.random() - 0.5).map((symbol, index) => ({
    id: `tile-${index}`,
    symbol,
    isFlipped: false,
    isMatched: false,
    lockedBy: null,
  }));
};

export const useSocket = () => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: generateTiles(),
    players: [
      { id: 'bot-1', name: 'Player One', score: 120, isConnected: true },
      { id: 'bot-2', name: 'Player Two', score: 80, isConnected: true },
    ],
    scoreHistory: [],
    isGameOver: false,
    startTime: Date.now(),
  });

  const selectTile = (tileId: string, playerId: string) => {
    // Logic handled in App.tsx for this UI demo
    console.log(`Player ${playerId} selected tile ${tileId}`);
  };

  const joinGame = (name: string) => {
    const newPlayer = { id: 'me', name, score: 0, isConnected: true };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  return { gameState, setGameState, selectTile, joinGame };
};