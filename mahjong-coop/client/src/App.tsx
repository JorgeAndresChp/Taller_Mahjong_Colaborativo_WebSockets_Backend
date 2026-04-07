import React, { useState, useMemo } from 'react';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { Scoreboard } from './components/Scoreboard';
import { LiveChart } from './components/LiveChart';
import { useSocket } from './hooks/useSockets';

const App: React.FC = () => {
  const { gameState, setGameState, joinGame } = useSocket();
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  const currentPlayer = useMemo(() => 
    gameState.players.find(p => p.id === currentPlayerId), 
    [gameState.players, currentPlayerId]
  );

  const handleJoin = (name: string) => {
    joinGame(name);
    setCurrentPlayerId('me'); // Mocking our ID as 'me'
  };

  const handleTileClick = (tileId: string) => {
    if (!currentPlayerId) return;

    setGameState(prev => {
      const newTiles = [...prev.tiles];
      const clickedTile = newTiles.find(t => t.id === tileId);
      
      if (!clickedTile || clickedTile.isMatched || clickedTile.lockedBy) return prev;

      // Find if player already has one tile flipped
      const alreadyFlippedIdx = newTiles.findIndex(t => t.lockedBy === currentPlayerId && !t.isMatched);

      if (alreadyFlippedIdx > -1) {
        const firstTile = newTiles[alreadyFlippedIdx];
        
        if (firstTile.id === tileId) return prev; // Clicked same tile

        if (firstTile.symbol === clickedTile.symbol) {
          // MATCH FOUND
          firstTile.isMatched = true;
          firstTile.lockedBy = null;
          clickedTile.isMatched = true;
          clickedTile.isFlipped = true;
          
          const newPlayers = prev.players.map(p => 
            p.id === currentPlayerId ? { ...p, score: p.score + 10 } : p
          );

          return { 
            ...prev, 
            tiles: newTiles, 
            players: newPlayers,
            scoreHistory: [...prev.scoreHistory, {
              timestamp: Date.now(),
              scores: newPlayers.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.id]: p.score }), {})
            }]
          };
        } else {
          // NO MATCH - Flip back after delay (simulated here instantly for UI state)
          clickedTile.isFlipped = true;
          clickedTile.lockedBy = currentPlayerId;
          
          // In a real app, a timer would reset these
          return { ...prev, tiles: newTiles };
        }
      } else {
        // FIRST TILE SELECTION
        clickedTile.isFlipped = true;
        clickedTile.lockedBy = currentPlayerId;
        return { ...prev, tiles: newTiles };
      }
    });

    // Auto-reset logic for non-matches
    setTimeout(() => {
      setGameState(prev => {
        const tiles = prev.tiles.map(t => {
          if (t.lockedBy === currentPlayerId && !t.isMatched) {
            return { ...t, isFlipped: false, lockedBy: null };
          }
          return t;
        });
        return { ...prev, tiles };
      });
    }, 1000);
  };

  if (!currentPlayerId) {
    return <Lobby joinGame={handleJoin} />;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Mahjong Co-op</h1>
        <p>Welcome, <strong>{currentPlayer?.name}</strong>! Find matching pairs with your team.</p>
      </header>

      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Board 
          tiles={gameState.tiles} 
          currentPlayerId={currentPlayerId} 
          onTileClick={handleTileClick} 
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Scoreboard players={gameState.players} />
          <LiveChart history={gameState.scoreHistory} />
        </div>
      </div>
    </div>
  );
};

export default App;