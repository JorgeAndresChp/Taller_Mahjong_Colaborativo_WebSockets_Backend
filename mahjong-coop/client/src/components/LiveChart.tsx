import React from 'react';
import { type ScoreSnapshot } from '../types';

interface LiveChartProps {
  history: ScoreSnapshot[];
}

export const LiveChart: React.FC<LiveChartProps> = ({ history }) => {
  // Simple bar representation to simulate a chart without external libs
  return (
    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h4>Live Performance (Mock Chart)</h4>
      <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '4px', borderLeft: '2px solid #333', borderBottom: '2px solid #333', padding: '5px' }}>
        {history.map((snapshot, idx) => {
          const totalScore = Object.values(snapshot.scores).reduce((a, b) => a + b, 0);
          const height = Math.min(totalScore / 5, 100);
          return (
            <div 
              key={idx} 
              style={{ width: '15px', height: `${height}%`, backgroundColor: '#007bff' }} 
              title={`Time: ${snapshot.timestamp}`}
            />
          );
        })}
        {history.length === 0 && <span style={{ color: '#999', fontSize: '0.8rem' }}>Waiting for data...</span>}
      </div>
    </div>
  );
};