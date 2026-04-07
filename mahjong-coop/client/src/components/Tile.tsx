import React from 'react';
import { type Tile as TileType } from '../types';

interface TileProps {
  tile: TileType;
  currentPlayerId: string;
  onClick: (id: string) => void;
}

export const Tile: React.FC<TileProps> = ({ tile, currentPlayerId, onClick }) => {
  const isLockedByMe = tile.lockedBy === currentPlayerId;
  const isLockedByOther = tile.lockedBy !== null && !isLockedByMe;
  const showSymbol = tile.isFlipped || tile.isMatched;

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '80px',
      height: '110px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
      border: '2px solid #ccc',
      backgroundColor: '#f9f9f9',
      position: 'relative',
    };

    if (tile.isMatched) {
      return { ...base, backgroundColor: '#d4edda', borderColor: '#28a745', cursor: 'default' };
    }
    if (isLockedByOther) {
      return { ...base, backgroundColor: '#e9ecef', borderColor: '#dc3545', opacity: 0.7, cursor: 'not-allowed' };
    }
    if (isLockedByMe) {
      return { ...base, borderColor: '#007bff', boxShadow: '0 0 10px rgba(0,123,255,0.5)' };
    }
    if (!showSymbol) {
      return { ...base, backgroundColor: '#343a40', borderColor: '#212529' };
    }
    return base;
  };

  return (
    <div 
      style={getStyles()} 
      onClick={() => !tile.isMatched && !isLockedByOther && onClick(tile.id)}
    >
      {showSymbol ? tile.symbol : ''}
      {isLockedByOther && (
        <span style={{ fontSize: '10px', position: 'absolute', bottom: '5px', color: '#dc3545' }}>
          Locked
        </span>
      )}
    </div>
  );
};