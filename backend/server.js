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
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/Paymentroutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Configure CORS to allow both local and deployed frontends
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://sandbox.sslcommerz.com",
  "https://securepay.sslcommerz.com",
];

const normalizeOrigin = (value = "") => value.trim().replace(/\/$/, "");

// Add production URL if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(normalizeOrigin(process.env.FRONTEND_URL));
}

// Optional comma-separated allowlist
if (process.env.FRONTEND_URLS) {
  process.env.FRONTEND_URLS.split(",")
    .map(normalizeOrigin)
    .filter(Boolean)
    .forEach((origin) => allowedOrigins.push(origin));
}

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin || "");
      const isVercelDomain =
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin);

      const isNullOrigin = normalizedOrigin === "null";

      if (!origin || isNullOrigin || allowedOrigins.includes(normalizedOrigin) || isVercelDomain) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for this origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Initialize socket.io
initSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for SSLCommerz POST callbacks

// Routes
app.use("/api/ads", adRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// payment routes
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "AdFlow backend is running." });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
