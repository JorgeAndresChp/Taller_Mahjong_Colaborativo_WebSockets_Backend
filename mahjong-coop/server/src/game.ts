import { Tile, Player, GameState, ScoreSnapshot } from './types';
 
export function createGame(pairCount: number): GameState { /* ... */ }
export function addPlayer(state: GameState, id: string, name: string): GameState { /* ... */ }
export function removePlayer(state: GameState, id: string): GameState { /* ... */ }
export function selectTile(state: GameState, tileId: string, playerId: string):
  { newState: GameState; event: string | null } { /* ... */ }
export function checkMatch(state: GameState, t1: string, t2: string, playerId: string):
  { newState: GameState; isMatch: boolean } { /* ... */ }
