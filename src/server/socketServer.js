// src/server/socketServer.js
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";

const DEFAULT_PORT = process.env.SOCKET_IO_PORT || 4001;

function startSocketServer(port = DEFAULT_PORT) {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: { origin: "*" }, // dev only — tighten in prod
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", ({ userId }) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
      }
    });

    socket.on("leave", ({ userId }) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.leave(room);
        console.log(`Socket ${socket.id} left room ${room}`);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected", socket.id, "reason:", reason);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Socket server listening on port ${port}`);
  });

  return io;
}

// ESM-compatible "if run directly" check
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When executed directly: node src/server/socketServer.js
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename)
) {
  startSocketServer();
}

export default startSocketServer;
