/**
 * locationController.js — Handles location API logic.
 */

import Location from "../models/Location.js";

// GET /api/locations — fetch all locations
export async function getLocations(req, res) {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// POST /api/locations — create a new location
export async function createLocation(req, res) {
  try {
    const { name, city, country } = req.body;

    if (!name || !city) {
      return res.status(400).json({ message: "Name and city are required." });
    }

    const location = await Location.create({ name, city, country });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/locations/:id — delete a location
export async function deleteLocation(req, res) {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) return res.status(404).json({ message: "Location not found." });

    res.json({ message: "Location deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}