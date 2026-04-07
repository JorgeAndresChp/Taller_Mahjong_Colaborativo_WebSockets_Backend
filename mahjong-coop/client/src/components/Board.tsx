import React, { useMemo } from 'react';
import { type Tile as TileType } from '../types';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  onTileClick: (id: string) => void;
}

interface PyramidTile extends TileType {
  row: number;
  col: number;
  layer: number;
}

/**
 * Distributes 30 tiles into a pyramid structure for Mahjong
 * Creates a 3D pyramid with multiple layers (depth)
 */
const distributeInPyramid = (tiles: TileType[]): PyramidTile[] => {
  const pyramidTiles: PyramidTile[] = [];
  let tileIndex = 0;

  // Layer 0 (front)
  // Row 0: 7 tiles, Row 1: 6 tiles, Row 2: 5 tiles = 18 tiles
  const layerConfigs = [
    // Layer 0
    [7, 6, 5],
    // Layer 1 (middle)
    [3, 2],
    // Layer 2 (back)
    [2],
  ];

  let layerNum = 0;
  for (const rowConfig of layerConfigs) {
    let rowNum = 0;
    for (const tileCount of rowConfig) {
      for (let col = 0; col < tileCount; col++) {
        if (tileIndex < tiles.length) {
          pyramidTiles.push({
            ...tiles[tileIndex],
            row: rowNum,
            col,
            layer: layerNum,
          });
          tileIndex++;
        }
      }
      rowNum++;
    }
    layerNum++;
  }

  // Fill remaining tiles
  while (tileIndex < tiles.length) {
    const remainingTile = tiles[tileIndex];
    pyramidTiles.push({
      ...remainingTile,
      row: 0,
      col: tileIndex - (pyramidTiles.length - tileIndex),
      layer: 2,
    });
    tileIndex++;
  }

  return pyramidTiles;
};

export const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, onTileClick }) => {
  const pyramidTiles = useMemo(() => distributeInPyramid(tiles), [tiles]);

  // Group tiles by layer for rendering
  const tilesByLayer = useMemo(() => {
    const grouped: { [key: number]: PyramidTile[] } = {};
    pyramidTiles.forEach((tile) => {
      if (!grouped[tile.layer]) {
        grouped[tile.layer] = [];
      }
      grouped[tile.layer].push(tile);
    });
    return grouped;
  }, [pyramidTiles]);

  const layers = Object.keys(tilesByLayer)
    .map(Number)
    .sort((a, b) => a - b);

  const containerStyle: React.CSSProperties = {
    perspective: '1000px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '600px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    position: 'relative',
  };

  const pyramidStyle: React.CSSProperties = {
    position: 'relative',
    width: '800px',
    height: '500px',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(15deg) rotateZ(0deg)',
  };

  const getLayerStyle = (layerNum: number): React.CSSProperties => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transform: `translateZ(${layerNum * 40}px)`,
      top: layerNum * 30,
      left: 0,
    };
  };

  const getTileContainerStyle = (tile: PyramidTile): React.CSSProperties => {
    const tileSize = 70;
    const centerX = 400;
    const centerY = 150;

    // Calculate position within row
    const rowWidth = tile.col * tileSize;
    const offsetFromCenter = (6 - tile.row) / 2 * tileSize;

    return {
      position: 'absolute',
      left: centerX - offsetFromCenter + rowWidth - tileSize / 2,
      top: centerY + tile.row * (tileSize * 0.7),
      transformStyle: 'preserve-3d',
    };
  };

  const matchedCount = tiles.filter((t) => t.isMatched).length;
  const totalMatches = tiles.length / 2;

  return (
    <div>
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

      <div style={containerStyle}>
        <div style={pyramidStyle}>
          {layers.map((layerNum) => (
            <div key={`layer-${layerNum}`} style={getLayerStyle(layerNum)}>
              {tilesByLayer[layerNum].map((tile) => (
                <div key={tile.id} style={getTileContainerStyle(tile)}>
                  <Tile
                    tile={tile}
                    currentPlayerId={currentPlayerId}
                    onClick={onTileClick}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};