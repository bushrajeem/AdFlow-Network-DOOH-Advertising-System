/**
 * Location.js — Represents a physical location (supershop, store).
 * Independent model — no references to other models.
 */

import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },

    city: {
      type:     String,
      required: true,
      trim:     true,
    },

    country: {
      type:    String,
      default: "Bangladesh",
      trim:    true,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;