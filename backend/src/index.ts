import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Basic state for the room
let players: Record<string, { id: string, safe: boolean }> = {};
let isArrowRainActive = false;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Add player
  players[socket.id] = { id: socket.id, safe: true };
  io.emit('players_update', players);

  socket.on('update_status', (data: { safe: boolean }) => {
    if (players[socket.id]) {
        players[socket.id].safe = data.safe;
        // don't broadcast every small movement for now, 
        // normally we would broadcast so others see
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
    io.emit('players_update', players);
  });
});

app.get('/', (req, res) => {
  res.send('Fire Arrows Server is running!');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
