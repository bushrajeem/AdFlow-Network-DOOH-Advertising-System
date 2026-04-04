/**
 * dashboardController.js — Returns overview counts for the dashboard.
 * Queries all 4 collections and returns totals in one API call.
 */

import Ad from "../models/Ad.js";
import Location from "../models/Location.js";
import Playlist from "../models/Playlist.js";
import Screen from "../models/Screen.js";

export async function getStats(req, res) {
  try {
    // Run all 4 queries at the same time — faster than one by one
    const [ads, playlists, screens, locations] = await Promise.all([
      Ad.countDocuments(),
      Playlist.countDocuments(),
      Screen.countDocuments(),
      Location.countDocuments(),
    ]);

    res.json({ ads, playlists, screens, locations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
