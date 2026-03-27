import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { initSocket } from "./socket.js";
import connectDB from "./config/db.js";

import adRoutes from "./routes/adRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"; 

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Configure CORS to allow both local and deployed frontends
const allowedOrigins = [
  "http://localhost:3000", // local Vite dev
  "http://localhost:5173", // Vite default
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

// Add production Vercel URL if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

// initilize socket.io with HTTP server
initSocket(server);

app.use(express.json());

// All routes prefixed with /api
app.use("/api/ads", adRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AdFlow backend is running." });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
