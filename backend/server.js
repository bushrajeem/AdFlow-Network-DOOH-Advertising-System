import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import adRoutes from "./routes/adRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"; 

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
