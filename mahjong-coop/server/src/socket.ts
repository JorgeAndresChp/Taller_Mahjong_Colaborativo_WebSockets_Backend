import { Server as SocketIOServer, Socket } from 'socket.io';
import { createGame, addPlayer, removePlayer, selectTile } from './game';
import { GameState } from './types';

let gameState: GameState = createGame(15);

export function setupSocket(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {

    socket.on('player:join', (name: string) => {
      gameState = addPlayer(gameState, socket.id, name);
      io.emit('game:state', gameState);
    });

    socket.on('tile:select', (tileId: string) => {
      const { newState, event } = selectTile(gameState, tileId, socket.id);
      gameState = newState;

      io.emit('game:state', gameState);

      if (event === 'no-match') {
        const frozenState = gameState;
        setTimeout(() => {
          if (gameState === frozenState) {
            gameState = {
              ...gameState,
              tiles: gameState.tiles.map(t =>
                t.isFlipped && !t.isMatched && t.lockedBy === null
                  ? { ...t, isFlipped: false }
                  : t
              ),
            };
            io.emit('game:state', gameState);
          }
        }, 1000);
      }
    });

    socket.on('disconnect', () => {
      gameState = removePlayer(gameState, socket.id);
      io.emit('game:state', gameState);
    });

  });
}