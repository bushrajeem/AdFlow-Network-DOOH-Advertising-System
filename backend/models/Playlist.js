/**
 * Playlist.js — A collection of ads played in sequence.
 * References the Ad model — a playlist contains multiple ads.
 *
 * ads: [ObjectId] means MongoDB stores the IDs of the ads.
 * When you query a playlist, you can "populate" these IDs
 * to get the full ad details instead of just the ID.
 */

import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Array of references to Ad documents
    // Each item is the _id of an Ad
    ads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Ad", // tells Mongoose which model to populate from
      },
    ],
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;