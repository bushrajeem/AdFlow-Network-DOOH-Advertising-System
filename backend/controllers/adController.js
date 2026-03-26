/**
 * adController.js — Handles all ad-related API logic.
 * Each function maps to one API endpoint.
 */

import cloudinary from "../config/cloudinary.js";
import Ad from "../models/Ad.js";
import Playlist from "../models/Playlist.js";
import { getIO } from "../socket.js";

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

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(videoUrl) {
  if (!videoUrl) return null;

  try {
    const url = new URL(videoUrl);
    const pathname = url.pathname;

    // URL format: /v{cloud_name}/video/upload/v{version}/{folder}/{public_id}.{ext}
    // We need to extract everything after "upload/v{number}/" excluding the extension
    const match = pathname.match(/\/upload\/v\d+\/(.+)\.\w+$/);
    if (match) {
      return match[1]; // Returns "adflow/ads/public_id"
    }
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
  }

  return null;
}

// Helper function to delete video from Cloudinary
function deleteVideoFromCloudinary(videoUrl) {
  return new Promise((resolve, reject) => {
    const publicId = extractPublicIdFromUrl(videoUrl);

    if (!publicId) {
      return resolve(); // If no public_id, just resolve silently
    }

    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "video" },
      (error, result) => {
        if (error) {
          console.error("Error deleting video from Cloudinary:", error);
          return reject(error);
        }
        resolve(result);
      },
    );
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
    const ad = await Ad.findById(req.params.id);

    if (!ad) return res.status(404).json({ message: "Ad not found." });

    // Delete video from Cloudinary if it has a videoUrl
    if (ad.videoUrl) {
      await deleteVideoFromCloudinary(ad.videoUrl);
    }

    // Delete ad from MongoDB
    await Ad.findByIdAndDelete(req.params.id);

    res.json({ message: "Ad and associated video deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// PATCH /api/ads/:id/play — increment play count by 1
export async function incrementPlayCount(req, res) {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } }, // $inc adds 1 without overwriting
      { new: true },
    );

    if (!ad) return res.status(404).json({ message: "Ad not found." });

    try {
      getIO().emit("ad-playcount-updated", {
        adId: String(ad._id),
        playCount: ad.playCount,
      });
    } catch (err) {
      console.warn("Error emitting ad-playcount-updated event:", err.message);
    }

    res.json({ playCount: ad.playCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
