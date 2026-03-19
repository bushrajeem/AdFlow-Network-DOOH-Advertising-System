/**
 * screenController.js — Handles screen API logic.
 */

import Screen from "../models/Screen.js";

// GET /api/screens — fetch all screens
// populate fills in playlist and location details
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

// POST /api/screens — create a new screen
export async function createScreen(req, res) {
  try {
    const { name, playlistId, locationId } = req.body;

    if (!name) return res.status(400).json({ message: "Screen name is required." });

    const screen = await Screen.create({
      name,
      playlist: playlistId || null,  // optional
      location: locationId || null,  // optional
    });

    res.status(201).json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// PATCH /api/screens/:id — update screen (assign playlist or location)
export async function updateScreen(req, res) {
  try {
    const { playlistId, locationId, status } = req.body;

    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      {
        ...(playlistId !== undefined && { playlist: playlistId }),
        ...(locationId !== undefined && { location: locationId }),
        ...(status     !== undefined && { status }),
      },
      { new: true } // return updated document
    ).populate("playlist").populate("location");

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