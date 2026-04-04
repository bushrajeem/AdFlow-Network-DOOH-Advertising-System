/**
 * Ad.js — Represents a single advertisement.
 * Independent model — no references to other models.
 * An ad can belong to multiple playlists.
 */

import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      default: "",
    },

    duration: {
      type: Number, // in seconds
      default: 15,
    },
    playCount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  },
);

const Ad = mongoose.model("Ad", adSchema);

export default Ad;
