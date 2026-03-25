/**
 * socket.js — Socket.io setup and event handlers.
 *
 * HOW IT WORKS:
 * 1. Player opens /player/:screenId in browser
 * 2. Player connects to Socket.io backend
 * 3. Player joins a "room" named after its screenId
 * 4. Admin assigns playlist → backend emits to that room
 * 5. Player receives event → fetches and plays new playlist
 */

import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all origins for demo
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Player registers itself using its screenId
    // socket.join() creates a private room for that screen
    // so we can send events to ONE screen specifically
    socket.on("join-screen", (screenId) => {
      socket.join(screenId);
      console.log(`Screen ${screenId} is now online`);

      // Tell the player it connected successfully
      socket.emit("connected", { message: "Connected to AdFlow server" });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Export io instance so other files can emit events
export function getIO() {
  if (!io) throw new Error("Socket.io not initialized.");
  return io;
}
