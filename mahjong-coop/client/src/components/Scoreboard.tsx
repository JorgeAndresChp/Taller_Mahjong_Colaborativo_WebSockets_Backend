import React from 'react';
import { type Player } from '../types';

interface ScoreboardProps {
  players: Player[];
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    minWidth: '320px',
    maxWidth: '400px',
    border: '2px solid #1e293b',
    backdropFilter: 'blur(10px)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginBottom: '18px',
    color: '#0ea5e9',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const itemStyle = (isCurrentPlayer?: boolean): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    backgroundColor: isCurrentPlayer
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(100, 116, 139, 0.1)',
    border: isCurrentPlayer ? '2px solid #3b82f6' : '1px solid #334155',
    transition: 'all 0.3s ease',
    fontWeight: isCurrentPlayer ? '600' : '500',
    color: isCurrentPlayer ? '#e0f2fe' : '#cbd5e1',
  });

  const playerNameStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  };

  const statusIndicatorStyle = (isConnected: boolean): React.CSSProperties => ({
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isConnected ? '#10b981' : '#6b7280',
    animation: isConnected ? 'pulse 2s infinite' : 'none',
    boxShadow: isConnected ? '0 0 8px #10b981' : 'none',
  });

  const scoreStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#fbbf24',
    minWidth: '60px',
    textAlign: 'right',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '30px',
    color: '#64748b',
    fontSize: '0.95rem',
  };

  const statsStyle: React.CSSProperties = {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #334155',
    fontSize: '0.85rem',
    color: '#94a3b8',
    textAlign: 'center',
  };

  const onlinePlayers = sortedPlayers.filter((p) => p.isConnected).length;
  const totalPlayers = sortedPlayers.length;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <div style={containerStyle}>
        <div style={titleStyle}>
          📊 Leaderboard ({onlinePlayers}/{totalPlayers})
        </div>

        {sortedPlayers.length === 0 ? (
          <div style={emptyStateStyle}>Waiting for players...</div>
        ) : (
          <ul style={listStyle}>
            {sortedPlayers.map((player, index) => (
              <li
                key={player.id}
                style={itemStyle(player.id === sortedPlayers[0]?.id)}
              >
                <div style={playerNameStyle}>
                  <span style={statusIndicatorStyle(player.isConnected)} />
                  <span>
                    {index === 0 && '👑 '} {player.name}
                  </span>
                </div>
                <div style={scoreStyle}>{player.score}</div>
              </li>
            ))}
          </ul>
        )}

        <div style={statsStyle}>
          {onlinePlayers > 0 ? (
            <>
              {onlinePlayers} player{onlinePlayers !== 1 ? 's' : ''} online •
              Total score: {sortedPlayers.reduce((sum, p) => sum + p.score, 0)}
            </>
          ) : (
            'No players connected'
          )}
        </div>
      </div>
    </>
  );
};