import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { setupSocket } from './socket';

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: 'http://localhost:5173' }));

setupSocket(io);

httpServer.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
