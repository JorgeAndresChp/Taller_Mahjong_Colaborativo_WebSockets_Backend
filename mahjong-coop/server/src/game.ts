import { Tile, Player, GameState, ScoreSnapshot } from './types';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getClassicTurtlePositions(): { x: number; y: number; z: number }[] {
  const pos: { x: number; y: number; z: number }[] = [];


  for (let y = 1; y <= 6; y++) {
    for (let x = 2; x <= 13; x++) {
      pos.push({ x, y, z: 0 });
    }
  }

  for (let x = 4; x <= 9; x++) {
    pos.push({ x, y: 0, z: 0 });
    pos.push({ x, y: 7, z: 0 });
  }


  for (let y = 1; y <= 6; y++) {
    for (let x = 4; x <= 9; x++) {
      pos.push({ x: x + 0.5, y: y + 0.5, z: 1 });
    }
  }


  for (let y = 2; y <= 5; y++) {
    for (let x = 5; x <= 8; x++) {
      pos.push({ x: x + 1, y: y + 1, z: 2 });
    }
  }


  for (let y = 3; y <= 4; y++) {
    for (let x = 6; x <= 7; x++) {
      pos.push({ x: x + 1.5, y: y + 1.5, z: 3 });
    }
  }


  pos.push({ x: 8, y: 4.5, z: 4 });


  pos.push({ x: 1, y: 1, z: 0 });
  pos.push({ x: 14, y: 1, z: 0 });
  pos.push({ x: 1, y: 6, z: 0 });

  console.log(`Total positions created: ${pos.length}`);
  return pos.slice(0, 144);
}

function isSelectable(tile: Tile, tiles: Tile[]): boolean {
  if (tile.isMatched) return false;

  const active = tiles.filter(t => !t.isMatched);


  const hasTop = active.some(t =>
    t.z > tile.z &&
    Math.abs(t.x - tile.x) <= 1 &&
    Math.abs(t.y - tile.y) <= 1
  );

  if (hasTop) return false;


  const hasLeft = active.some(t =>
    t.z === tile.z &&
    Math.abs(t.y - tile.y) <= 1 &&
    t.x <= tile.x - 0.8 &&
    t.x > tile.x - 2
  );

  const hasRight = active.some(t =>
    t.z === tile.z &&
    Math.abs(t.y - tile.y) <= 1 &&
    t.x >= tile.x + 0.8 &&
    t.x < tile.x + 2
  );


  return !(hasLeft && hasRight);
}

export function createGame(): GameState {
  const positions = getClassicTurtlePositions();

  const symbolArray = Array.from({ length: 72 }, (_, i) => i);
  const doubledSymbols = [...symbolArray, ...symbolArray];
  const shuffledSymbols = shuffle(doubledSymbols);

  let tiles: Tile[] = positions.map((pos, i) => ({
    id: `tile-${i}`,
    x: pos.x,
    y: pos.y,
    z: pos.z,
    symbol: shuffledSymbols[i] % 15,
    isMatched: false,
    isFlipped: true,
    lockedBy: null,
  }));

  console.log(`Created ${tiles.length} tiles with symbols 0-71 distributed`);

  return {
    tiles,
    players: [],
    scoreHistory: [],
    isGameOver: false,
    startTime: null,
  };
}

export function addPlayer(state: GameState, id: string, name: string): GameState {
  const newPlayer: Player = { id, name, score: 0, isConnected: true };

  return {
    ...state,
    players: [...state.players, newPlayer],
    startTime: state.startTime ?? Date.now(),
  };
}

export function removePlayer(state: GameState, id: string): GameState {
  return {
    ...state,
    players: state.players.map(p =>
      p.id === id ? { ...p, isConnected: false } : p
    ),
    tiles: state.tiles.map(t =>
      t.lockedBy === id ? { ...t, lockedBy: null } : t
    ),
  };
}

export function selectTile(
  state: GameState,
  tileId: string,
  playerId: string
): { newState: GameState; event: string | null } {

  const tile = state.tiles.find(t => t.id === tileId);
  const selected = state.tiles.filter(t => t.lockedBy === playerId);

  if (
    !tile ||
    tile.isMatched ||
    (tile.lockedBy !== null && tile.lockedBy !== playerId) ||
    (selected.length === 0 && !isSelectable(tile, state.tiles))
  ) {
    return { newState: state, event: null };
  }


  if (selected.length === 0) {
    return {
      newState: {
        ...state,
        tiles: state.tiles.map(t => ({
          ...t,
          lockedBy: t.id === tileId ? playerId : null
        })),
      },
      event: null,
    };
  }


  const first = selected[0];

  if (first.id === tile.id) {
    return {
      newState: {
        ...state,
        tiles: state.tiles.map(t =>
          t.lockedBy === playerId ? { ...t, lockedBy: null } : t
        ),
      },
      event: null,
    };
  }

  const isMatch = first.symbol === tile.symbol;

  let newTiles: Tile[];
  let newPlayers = state.players;
  let newScoreHistory = state.scoreHistory;

  if (isMatch) {
    newTiles = state.tiles.map(t =>
      t.id === first.id || t.id === tile.id
        ? { ...t, isMatched: true, lockedBy: null }
        : t
    );
    
    newPlayers = state.players.map(p =>
      p.id === playerId ? { ...p, score: p.score + 10 } : p
    );
    
    const scores: Record<string, number> = {};
    newPlayers.forEach(p => {
      scores[p.id] = p.score;
    });
    newScoreHistory = [...state.scoreHistory, { timestamp: Date.now(), scores }];
  } else {
    newTiles = state.tiles.map(t =>
      (t.id === first.id || t.id === tile.id)
        ? { ...t, lockedBy: playerId }
        : t
    );
  }

  return {
    newState: {
      ...state,
      tiles: newTiles,
      players: newPlayers,
      scoreHistory: newScoreHistory,
      isGameOver: newTiles.every(t => t.isMatched),
    },
    event: isMatch ? 'match' : 'no-match',
  };
}