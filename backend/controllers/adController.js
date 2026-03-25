/**
 * adController.js — Handles all ad-related API logic.
 * Each function maps to one API endpoint.
 */

import Ad from "../models/Ad.js";
import Playlist from "../models/Playlist.js";
import cloudinary from "../config/cloudinary.js";

function uploadVideoToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "adflow/ads",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
}

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

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required." });
    }

    const hasCloudinaryConfig =
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL;

    if (!hasCloudinaryConfig) {
      return res.status(500).json({
        message:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env and restart the backend.",
      });
    }

    const uploadResult = await uploadVideoToCloudinary(req.file.buffer);

    const ad = await Ad.create({
      name,
      duration,
      videoUrl: uploadResult.secure_url,
    });
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