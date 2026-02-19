import http from 'http'
import { Server } from 'socket.io'
import express from 'express'

export const app = express()
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET, POST, PATCH, DELETE']
  },
});


export const getReceiverSocketId = (recipientId) => {
  return userSocketMap[recipientId];
}

const userSocketMap = {};


io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  const userId = socket.handshake.query.userId;

  if (userId != 'undefined') userSocketMap[userId] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete userSocketMap(userId);
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  });
});

