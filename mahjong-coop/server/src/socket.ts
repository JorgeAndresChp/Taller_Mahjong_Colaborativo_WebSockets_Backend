import { Server as SocketIOServer, Socket } from 'socket.io';
import { createGame, addPlayer, removePlayer, selectTile } from './game';
import { GameState } from './types';

let gameState: GameState = createGame();

export function setupSocket(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);
    
    socket.emit('game:state', gameState);

    socket.on('player:join', (data: { name: string }, callback?: (playerId: string) => void) => {
      console.log('Player joined:', data.name);
      gameState = addPlayer(gameState, socket.id, data.name);
      io.emit('game:state', gameState);
      if (callback) callback(socket.id);
    });

    socket.on('tile:select', (data: { tileId: string }) => {
      console.log('Tile selected:', data.tileId, 'by', socket.id);
      const { newState, event } = selectTile(gameState, data.tileId, socket.id);
      gameState = newState;

      io.emit('game:state', gameState);

      if (event === 'no-match') {
        const frozenState = gameState;
        const playerId = socket.id;
        
        setTimeout(() => {
          if (gameState === frozenState) {
            gameState = {
              ...gameState,
              tiles: gameState.tiles.map(t =>
                t.lockedBy === playerId
                  ? { ...t, isFlipped: true, lockedBy: null }
                  : t
              ),
            };
            io.emit('game:state', gameState);
          }
        }, 1000);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      gameState = removePlayer(gameState, socket.id);
      io.emit('game:state', gameState);
    });

  });
}