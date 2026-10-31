import { io } from 'socket.io-client';

/**
 * Single shared Socket.IO client instance.
 * All components import this — one connection per browser tab.
 *
 * VITE_API_URL must be set in .env (e.g. http://localhost:3001)
 */
const socket = io(import.meta.env.VITE_API_URL as string, {
  // Reconnect automatically with exponential back-off
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  // Don't auto-connect until the page is ready — connect() is called lazily
  autoConnect: true,
});

export default socket;
