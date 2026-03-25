/**
 * adController.js — Handles all ad-related API logic.
 * Each function maps to one API endpoint.
 */

import Ad from "../models/Ad.js";
import Playlist from "../models/Playlist.js";

// GET /api/ads — fetch all ads
export async function getAds(req, res) {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });

    const playlistCounts = await Playlist.aggregate([
      { $unwind: "$ads" },
      { $group: { _id: "$ads", count: { $sum: 1 } } },
    ]);

    const countByAdId = new Map(
      playlistCounts.map((item) => [String(item._id), item.count]),
    );

    const adsWithCounts = ads.map((ad) => ({
      ...ad.toObject(),
      playlistCount: countByAdId.get(String(ad._id)) || 0,
    }));

    res.json(adsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// POST /api/ads — create a new ad
export async function createAd(req, res) {
  try {
    const { name, duration } = req.body;

    if (!name) return res.status(400).json({ message: "Ad name is required." });

    const ad = await Ad.create({ name, duration });
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/ads/:id — delete an ad by ID
export async function deleteAd(req, res) {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);

    if (!ad) return res.status(404).json({ message: "Ad not found." });

    res.json({ message: "Ad deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}