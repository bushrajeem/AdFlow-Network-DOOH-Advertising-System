/**
 * Ad.js — Represents a single advertisement.
 * Independent model — no references to other models.
 * An ad can belong to multiple playlists.
 */

import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },

    // URL of the uploaded video file (stored in cloud storage later)
    // TODO: integrate with Cloudinary or AWS S3 for actual file storage
    videoUrl: {
      type:    String,
      default: "",
    },

    // URL of the poster/thumbnail image
    posterUrl: {
      type:    String,
      default: "",
    },

    duration: {
      type:    Number, // in seconds
      default: 15,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

const Ad = mongoose.model("Ad", adSchema);

export default Ad;