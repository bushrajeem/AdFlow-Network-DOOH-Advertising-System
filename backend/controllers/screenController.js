/**
 * screenController.js — Handles screen API logic.
 */

import Screen from "../models/Screen.js";
import { getIO } from "../socket.js";

function normalizeScreenCode(rawCode = "") {
  const compact = String(rawCode).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Convert AB1234 -> AB-1234 to match stored format.
  if (/^[A-Z]{2}\d{4}$/.test(compact)) {
    return `${compact.slice(0, 2)}-${compact.slice(2)}`;
  }

  return String(rawCode).trim().toUpperCase();
}

// GET /api/screens — fetch all screens
export async function getScreens(req, res) {
  try {
    const screens = await Screen.find()
      .populate("playlist")
      .populate("location")
      .sort({ createdAt: -1 });
    res.json(screens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function generateScreenCode() {
  const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
}

// POST /api/screens — create a new screen
export async function createScreen(req, res) {
  try {
    const { name, playlistId, locationId } = req.body;

    let screenCode;
    let exists = true;
    while (exists) {
      screenCode = generateScreenCode();
      exists = await Screen.exists({ screenCode });
    }

    if (!name)
      return res.status(400).json({ message: "Screen name is required." });

    const screen = await Screen.create({
      name,
      screenCode,
      playlist: playlistId || null, // optional
      location: locationId || null, // optional
    });

    res.status(201).json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// PATCH /api/screens/:id — update screen (assign playlist or location)
export async function updateScreen(req, res) {
  try {
    const { name, playlistId, locationId, status } = req.body;

    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(playlistId !== undefined && { playlist: playlistId }),
        ...(locationId !== undefined && { location: locationId }),
        ...(status !== undefined && { status }),
      },
      { new: true }, // return updated document
    )
      .populate({ path: "playlist", populate: { path: "ads" } })
      .populate("location");

    if (!screen) return res.status(404).json({ message: "Screen not found." });

    try {
      getIO().to(screen.screenCode || screen._id.toString()).emit("playlist-updated", {
        playlist: screen.playlist,
      });
    } catch (err) {
      console.warn("Error emitting playlist-updated event:", err.message);
    }

    res.json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET /api/screens/code/:code — fetch screen by screenCode
export async function getScreenByCode(req, res) {
  try {
    const normalizedCode = normalizeScreenCode(req.params.code);

    const screen = await Screen.findOne({
      screenCode: { $regex: `^${normalizedCode}$`, $options: "i" },
    })
      .populate({ path: "playlist", populate: { path: "ads" } })
      .populate("location");

    if (!screen) return res.status(404).json({ message: "Screen not found." });

    res.json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/screens/:id — delete a screen
export async function deleteScreen(req, res) {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);

    if (!screen) return res.status(404).json({ message: "Screen not found." });

    res.json({ message: "Screen deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
