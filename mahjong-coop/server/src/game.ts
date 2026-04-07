import { Tile, Player, GameState, ScoreSnapshot } from './types';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createGame(pairCount: number): GameState {
  const tiles: Tile[] = shuffle(
    Array.from({ length: pairCount }, (_, i): Tile[] => [
      { id: `tile-${i}-a`, symbol: i, isFlipped: false, isMatched: false, lockedBy: null },
      { id: `tile-${i}-b`, symbol: i, isFlipped: false, isMatched: false, lockedBy: null },
    ]).flat()
  );

  return {
    tiles,
    players: [],
    scoreHistory: [],
    isGameOver: false,
    startTime: null,
  };
}

export function addPlayer(state: GameState, id: string, name: string): GameState {
  const sameId = state.players.find(p => p.id === id);
  if (sameId) {
    return {
      ...state,
      players: state.players.map(p =>
        p.id === id ? { ...p, isConnected: true } : p
      ),
    };
  }

  const sameName = state.players.find(p => p.name === name && !p.isConnected);
  if (sameName) {
    return {
      ...state,
      players: state.players.map(p =>
        p.name === name && !p.isConnected ? { ...p, id, isConnected: true } : p
      ),
      tiles: state.tiles.map(t =>
        t.lockedBy === sameName.id ? { ...t, lockedBy: id } : t
      ),
    };
  }

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
      t.lockedBy === id ? { ...t, lockedBy: null, isFlipped: false } : t
    ),
  };
}

export function selectTile(
  state: GameState,
  tileId: string,
  playerId: string
): { newState: GameState; event: string | null } {
  const tile = state.tiles.find(t => t.id === tileId);

  if (!tile || tile.isMatched || (tile.lockedBy !== null && tile.lockedBy !== playerId)) {
    return { newState: state, event: null };
  }

  const alreadySelected = state.tiles.find(
    t => t.lockedBy === playerId && t.id !== tileId
  );

  const stateWithFlipped: GameState = {
    ...state,
    tiles: state.tiles.map(t =>
      t.id === tileId ? { ...t, isFlipped: true, lockedBy: playerId } : t
    ),
  };

  if (alreadySelected) {
    const { newState, isMatch } = checkMatch(
      stateWithFlipped,
      alreadySelected.id,
      tileId,
      playerId
    );
    return { newState, event: isMatch ? 'match' : 'no-match' };
  }

  return { newState: stateWithFlipped, event: null };
}

export function checkMatch(
  state: GameState,
  t1Id: string,
  t2Id: string,
  playerId: string
): { newState: GameState; isMatch: boolean } {
  const t1 = state.tiles.find(t => t.id === t1Id);
  const t2 = state.tiles.find(t => t.id === t2Id);

  if (!t1 || !t2) return { newState: state, isMatch: false };

  const isMatch = t1.symbol === t2.symbol;

  const updatedTiles = state.tiles.map(t => {
    if (t.id !== t1Id && t.id !== t2Id) return t;
    return isMatch
      ? { ...t, isMatched: true, isFlipped: true, lockedBy: null }
      : { ...t, isFlipped: true, lockedBy: null };
  });

  const updatedPlayers = isMatch
    ? state.players.map(p =>
        p.id === playerId ? { ...p, score: p.score + 1 } : p
      )
    : state.players;

  const scoreHistory = isMatch
    ? [
        ...state.scoreHistory,
        {
          timestamp: Date.now(),
          scores: Object.fromEntries(updatedPlayers.map(p => [p.id, p.score])),
        } satisfies ScoreSnapshot,
      ]
    : state.scoreHistory;

  return {
    newState: {
      ...state,
      tiles: updatedTiles,
      players: updatedPlayers,
      scoreHistory,
      isGameOver: updatedTiles.every(t => t.isMatched),
    },
    isMatch,
  };
}