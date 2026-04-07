import React from 'react';
import { type Tile as TileType } from '../types';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  onTileClick: (id: string) => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, onTileClick }) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#eee',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  return (
    <div style={gridStyle}>
      {tiles.map((tile) => (
        <Tile 
          key={tile.id} 
          tile={tile} 
          currentPlayerId={currentPlayerId} 
          onClick={onTileClick} 
        />
      ))}
    </div>
  );
};