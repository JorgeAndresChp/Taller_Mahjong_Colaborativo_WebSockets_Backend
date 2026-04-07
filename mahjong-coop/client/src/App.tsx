import React from 'react';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { Scoreboard } from './components/Scoreboard';
import { LiveChart } from './components/LiveChart';
import { useSocket } from './hooks/useSockets';

const App: React.FC = () => {
  const { gameState, isConnected, currentPlayerId, joinGame, selectTile } = useSocket();

  // Show loading if socket is connecting
  if (!isConnected || !gameState) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'sans-serif',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div style={{ textAlign: 'center', color: '#e2e8f0' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>
            🀄 Connecting to server...
          </h2>
          <p style={{ color: '#94a3b8' }}>
            Make sure the backend at http://localhost:3001 is running
          </p>
        </div>
      </div>
    );
  }

  // Show lobby if not joined yet
  if (!currentPlayerId) {
    return <Lobby joinGame={joinGame} />;
  }

  // Find current player from gameState
  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        padding: '20px',
        color: '#e2e8f0',
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #334155',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#0ea5e9' }}>
          🀄 Mahjong Cooperative
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '10px' }}>
          Collaborative Multiplayer • Real-time WebSocket
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
          <p style={{ marginBottom: 0 }}>
            Welcome, <strong style={{ color: '#10b981' }}>{currentPlayer?.name}</strong>!
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: isConnected ? '#10b981' : '#ef4444',
              border: `1px solid ${isConnected ? '#10b981' : '#ef4444'}`,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#ef4444',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </header>

      {/* Game Over Banner */}
      {gameState.isGameOver && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#10b981',
            border: '2px solid #10b981',
          }}
        >
          <h2>🎉 Game Complete!</h2>
          <p>Final scores have been recorded. All tiles matched!</p>
        </div>
      )}

      {/* Main Game Area */}
      <div
        style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}
      >
        {/* Board */}
        <div style={{ flex: '0 1 900px' }}>
          <Board tiles={gameState.tiles} currentPlayerId={currentPlayerId} onTileClick={selectTile} />
        </div>

        {/* Sidebar - Scoreboard & Chart */}
        <div
          style={{
            flex: '0 1 420px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Scoreboard players={gameState.players} />
          <LiveChart history={gameState.scoreHistory} />
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #334155',
          color: '#64748b',
          fontSize: '0.85rem',
        }}
      >
        <p>
          Playing with {gameState.players.length} player{gameState.players.length !== 1 ? 's' : ''} •
          {' '}
          {gameState.tiles.filter((t) => t.isMatched).length} / {gameState.tiles.length} tiles matched
        </p>
      </footer>
    </div>
  );
};

export default App;