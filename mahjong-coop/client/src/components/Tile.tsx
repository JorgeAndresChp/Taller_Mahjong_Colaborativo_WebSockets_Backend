import React from 'react';
import { type Tile as TileType } from '../types';

const SYMBOL_MAP = ['🌸', '🌺', '🌻', '🌷', '🌹', '🏮', '🎋', '🎍', '⛩️', '🎎', '🎏', '🎐', '🎑', '🎀', '🎁'];

const getSymbolEmoji = (symbolNumber: number): string => {
  return SYMBOL_MAP[Math.abs(symbolNumber) % SYMBOL_MAP.length] || '❓';
};

interface TileProps {
  tile: TileType;
  isBlocked?: boolean;
  currentPlayerId: string;
  onClick: (id: string) => void;
}

export const Tile: React.FC<TileProps> = React.memo(({ tile, isBlocked = false, currentPlayerId, onClick }) => {
  const isLockedByMe = tile.lockedBy === currentPlayerId;
  const isLockedByOther = tile.lockedBy !== null && !isLockedByMe;
  const showSymbol = tile.isFlipped || tile.isMatched;
  const isClickable = !tile.isMatched && !isLockedByOther;

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '70px',
      height: '90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      borderRadius: '6px',
      cursor: isClickable ? 'pointer' : 'not-allowed',
      userSelect: 'none',
      transition: 'all 0.3s ease',
      border: '3px solid',
      backgroundColor: '#f9f9f9',
      position: 'relative',
      flexDirection: 'column',
      fontWeight: 'bold',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
      transformStyle: 'preserve-3d',
    };

    if (tile.isMatched) {
      return {
        ...base,
        backgroundColor: '#4ade80',
        borderColor: '#22c55e',
        cursor: 'default',
        boxShadow:
          '0 4px 12px rgba(34, 197, 94, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
        transform: 'scale(0.95)',
      };
    }

    if (isLockedByOther) {
      return {
        ...base,
        backgroundColor: '#93c5fd',
        borderColor: '#3b82f6',
        opacity: 0.9,
        cursor: 'not-allowed',
        boxShadow:
          '0 4px 12px rgba(59, 130, 246, 0.7), inset 0 1px 0 rgba(255,255,255,0.4)',
      };
    }

    if (isLockedByMe) {
      return {
        ...base,
        backgroundColor: '#93c5fd',
        borderColor: '#3b82f6',
        boxShadow:
          '0 4px 12px rgba(59, 130, 246, 0.7), inset 0 1px 0 rgba(255,255,255,0.4)',
        transform: 'translateY(-3px)',
      };
    }

    if (isBlocked) {
      return {
        ...base,
        backgroundColor: '#9ca3af',
        backgroundImage: 'linear-gradient(135deg, #b4b7bb 0%, #9ca3af 50%, #8b92a4 100%)',
        borderColor: '#6b7280',
        opacity: 0.6,
        cursor: 'not-allowed',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      };
    }

    if (!showSymbol) {
      return {
        ...base,
        backgroundColor: '#4b5563',
        backgroundImage:
          'linear-gradient(135deg, #5a6b80 0%, #3d4a5c 50%, #2a3847 100%)',
        borderColor: '#1f2937',
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.1)',
      };
    }

    return {
      ...base,
      backgroundColor: '#ffffff',
      borderColor: '#cbd5e1',
      boxShadow:
        '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
    };
  };

  const handleClick = () => {
    if (isClickable) {
      onClick(tile.id);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6), inset 0 1px 0 rgba(255,255,255,0.3); }
          50% { box-shadow: 0 4px 20px rgba(239, 68, 68, 0.9), inset 0 1px 0 rgba(255,255,255,0.3); }
        }
      `}</style>
      <div
        style={getStyles()}
        onClick={handleClick}
        role="button"
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            handleClick();
          }
        }}
      >
        {showSymbol ? (
          <span style={{ fontSize: '1.8rem' }}>{getSymbolEmoji(tile.symbol)}</span>
        ) : (
          <span style={{ fontSize: '1.5rem', color: '#9ca3af', fontWeight: 'bold' }}>
            麻
          </span>
        )}
        {isBlocked && (
          <span
            style={{
              fontSize: '0.5rem',
              position: 'absolute',
              bottom: '2px',
              color: '#4b5563',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
            }}
          >
            BLK
          </span>
        )}
      </div>
    </>
  );
});