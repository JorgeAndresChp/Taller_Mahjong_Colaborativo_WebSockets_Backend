import React from 'react';
import { type Tile as TileType } from '../types';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  onTileClick: (id: string) => void;
}

// 🔥 FUNCIÓN CLAVE: determinar si una ficha está bloqueada
function isSelectable(tile: TileType, tiles: TileType[]): boolean {
  if (tile.isMatched) return false;

  const active = tiles.filter(t => !t.isMatched);

  // 🔴 BLOQUEO ARRIBA (más preciso)
  const hasTop = active.some(t =>
    t.z > tile.z &&
    Math.abs(t.x - tile.x) < 0.6 &&
    Math.abs(t.y - tile.y) < 0.6
  );

  if (hasTop) return false;

  // 🔵 BLOQUEO IZQUIERDA (exacto)
  const hasLeft = active.some(t =>
    t.z === tile.z &&
    Math.abs(t.y - tile.y) < 0.6 &&
    Math.abs(t.x - (tile.x - 1)) < 0.6
  );

  // 🔵 BLOQUEO DERECHA (exacto)
  const hasRight = active.some(t =>
    t.z === tile.z &&
    Math.abs(t.y - tile.y) < 0.6 &&
    Math.abs(t.x - (tile.x + 1)) < 0.6
  );

  // ✔ Mahjong real: libre si tiene un lado libre
  return !hasLeft || !hasRight;
}


export const Board: React.FC<BoardProps> = ({
  tiles,
  currentPlayerId,
  onTileClick
}) => {

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '900px',
    height: '650px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    overflow: 'hidden'
  };

  const matchedCount = tiles.filter(t => t.isMatched).length;
  const totalMatches = tiles.length / 2;

  return (
    <div>
      {/* 🔥 INFO */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#fff',
          fontSize: '0.95rem',
        }}
      >
        <strong>🎯 Tiles Matched:</strong> {matchedCount} / {totalMatches} pairs
      </div>

      {/* 🔥 TABLERO */}
      <div style={containerStyle}>
        {tiles.map((tile) => {
          if (tile.isMatched) return null;

          const selectable = isSelectable(tile, tiles);

          return (
            <div
              key={tile.id}
              style={{
                position: 'absolute',
                left: tile.x * 55,
                top: tile.y * 70 - tile.z * 6,
                zIndex: tile.z * 100,
              }}
            >
              <Tile
                tile={tile}
                isBlocked={!selectable}
                currentPlayerId={currentPlayerId}
                onClick={onTileClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};