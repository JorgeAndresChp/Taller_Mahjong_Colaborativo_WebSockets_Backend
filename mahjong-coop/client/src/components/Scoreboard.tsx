import React from 'react';
import { type Player } from '../types';

interface ScoreboardProps {
  players: Player[];
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', minWidth: '200px' }}>
      <h3>Scoreboard</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sortedPlayers.map((p) => (
          <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>
              <span style={{ color: p.isConnected ? '#28a745' : '#ccc', marginRight: '8px' }}>●</span>
              {p.name}
            </span>
            <strong>{p.score}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};