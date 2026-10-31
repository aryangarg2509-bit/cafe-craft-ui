require('dotenv').config();

const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const mongoose   = require('mongoose');
const { Server } = require('socket.io');

const ordersRouter = require('./routes/orders');

// ─── App & HTTP Server ─────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ─── Socket.IO ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin:  process.env.CLIENT_URL || 'http://localhost:8080',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

// Make io accessible in route handlers via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:8080' }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/orders', ordersRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── MongoDB → Start server ────────────────────────────────────────────────────
const PORT        = process.env.PORT        || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cafecraft';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`[MongoDB] Connected: ${MONGODB_URI}`);
    server.listen(PORT, () => {
      console.log(`[Server]  Listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  });
