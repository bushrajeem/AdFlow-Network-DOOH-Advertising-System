/**
 * playlistController.js — Handles playlist API logic.
 */

import Playlist from "../models/Playlist.js";

// GET /api/playlists — fetch all playlists
// populate("ads") replaces ad IDs with full ad objects
export async function getPlaylists(req, res) {
  try {
    const playlists = await Playlist.find()
      .populate("ads")
      .populate("locations")
      .sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// POST /api/playlists — create a new playlist
export async function createPlaylist(req, res) {
  try {
    const { name, adIds, locationIds } = req.body;

    if (!name) return res.status(400).json({ message: "Playlist name is required." });

    // adIds is an array of Ad ObjectIds from the frontend
    const playlist = await Playlist.create({
      name,
      ads: adIds || [],
      locations: locationIds || [],
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/playlists/:id — delete a playlist
export async function deletePlaylist(req, res) {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    res.json({ message: "Playlist deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}