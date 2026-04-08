import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type ScoreSnapshot } from '../types';

interface LiveChartProps {
  history: ScoreSnapshot[];
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const LiveChart: React.FC<LiveChartProps> = ({ history }) => {
  const chartData = history.map((snapshot, idx) => ({
    time: idx + 1,
    timestamp: snapshot.timestamp,
    ...snapshot.scores,
  }));

  const playerIds = Array.from(
    new Set(history.flatMap(snap => Object.keys(snap.scores)))
  );

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    border: '2px solid #1e293b',
    backdropFilter: 'blur(10px)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>📊 Live Score Performance</h3>
      
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
          <p>Waiting for matches... Start playing to see the chart! 🎮</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              label={{ value: 'Match #', fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              label={{ value: 'Points', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              formatter={(value) => value}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            
            {playerIds.map((playerId, idx) => (
              <Line
                key={playerId}
                type="monotone"
                dataKey={playerId}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={`Player ${idx + 1}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};