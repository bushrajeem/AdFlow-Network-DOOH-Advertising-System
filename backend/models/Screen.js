/**
 * Screen.js — Represents a physical digital screen in a store.
 * References Playlist and Location — both are optional.
 * A screen can exist without a playlist or location assigned.
 */

import mongoose from "mongoose";

const screenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // generates short automatic human radable code
    screenCode: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["Online", "Offline"], // only these two values allowed
      default: "Offline",
    },

    socketId: {
      type: String,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    deviceInfo: {
      ip: { type: String, default: null },
      userAgent: { type: String, default: null },
    },

    // Optional reference to a Playlist
    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      default: null,
    },

    // Optional reference to a Location
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },
  },
  { timestamps: true },
);

const Screen = mongoose.model("Screen", screenSchema);

export default Screen;
