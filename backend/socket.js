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
import Screen from "./models/Screen.js";

function normalizeScreenCode(rawCode = "") {
  const compact = String(rawCode).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Convert AB1234 -> AB-1234 to match stored format.
  if (/^[A-Z]{2}\d{4}$/.test(compact)) {
    return `${compact.slice(0, 2)}-${compact.slice(2)}`;
  }

  return String(rawCode).trim().toUpperCase();
}

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all origins for demo
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Screen device connects and identifies itself
    socket.on("join-screen", async (screenCode) => {
      try {
        const normalizedCode = normalizeScreenCode(screenCode);

        let screen = await Screen.findOne({
          screenCode: { $regex: `^${normalizedCode}$`, $options: "i" },
        });
        if (!screen) {
          socket.emit("error", { message: "Screen not found" });
          return;
        }

        // Join canonical room name from DB so updates always match.
        socket.join(screen.screenCode);

        //   store socketId and mark screen as online
        screen = await Screen.findByIdAndUpdate(
          screen._id,
          {
            status: "Online",
            socketId: socket.id,
            lastSeen: new Date(),
          },
          { new: true },
        )
          .populate({ path: "playlist", populate: { path: "ads" } })
          .populate("location");

        console.log(`Screen "${screen.name}" (${screenCode}) is Online`);

        // confirm connection to player
        socket.emit("connected", {
          message: "Connected to AdFlow server",
          screenId: screen._id,
          screenName: screen.name,
          screenCode: screen.screenCode,
          playlist: screen.playlist,
        });

        // notify admin dashboard about screen status change
        io.emit("screen-status", {
          screenId: screen._id,
          status: "Online",
          lastSeen: screen.lastSeen,
        });
      } catch (err) {
        console.error("join-screen error:", err.message);
      }
    });

    // Heartbeat — keeps screen Online while page is open
    socket.on("heartbeat", async (screenCode) => {
      try {
        const normalizedCode = normalizeScreenCode(screenCode);
        await Screen.findOneAndUpdate(
          { screenCode: { $regex: `^${normalizedCode}$`, $options: "i" } },
          { lastSeen: new Date() },
        );
      } catch (err) {
        console.error("heartbeat error:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        // Find screen by socketId and mark Offline
        const screen = await Screen.findOneAndUpdate(
          { socketId: socket.id },
          { status: "Offline", socketId: null },
          { new: true },
        );

        if (screen) {
          console.log(`Screen "${screen.name}" is Offline`);

          // Notify admin dashboard
          io.emit("screen-status", {
            screenId: screen._id,
            status: "Offline",
            lastSeen: screen.lastSeen,
          });
        }
      } catch (err) {
        console.error("disconnect error:", err.message);
      }
    });
  });

  return io;
}

// Export io instance so other files can emit events
export function getIO() {
  if (!io) throw new Error("Socket.io not initialized.");
  return io;
}
