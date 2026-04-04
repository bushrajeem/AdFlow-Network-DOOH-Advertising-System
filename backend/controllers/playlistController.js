/**
 * playlistController.js — Handles playlist API logic.
 */

import Playlist from "../models/Playlist.js";
import Screen from "../models/Screen.js";
import { getIO } from "../socket.js";

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

// Add updatePlaylist function
export async function updatePlaylist(req, res) {
  try {
    const { name, adIds, locationIds } = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(adIds !== undefined && { ads: adIds }),
        ...(locationIds !== undefined && { locations: locationIds }),
      },
      { new: true }
    ).populate("ads").populate("locations");

    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    // Push updated playlist to every online/offline screen assigned to this playlist.
    try {
      const screens = await Screen.find({ playlist: playlist._id }).select("screenCode _id");
      const io = getIO();

      for (const screen of screens) {
        io.to(screen.screenCode || screen._id.toString()).emit("playlist-updated", {
          playlist,
        });
      }
    } catch (err) {
      console.warn("Error emitting playlist-updated after playlist edit:", err.message);
    }

    res.json(playlist);
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