import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import "../src/config/redis.js";  // ensures Redis connects
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

const userSockets = new Map(); // userId -> Set<socketId>

try {
  await connectDB();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId) => {
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const [userId, sockets] of userSockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  // Make io available in app
  app.set('io', io);
  app.set('userSockets', userSockets);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error("Server startup error:", err);
  process.exit(1);
}
