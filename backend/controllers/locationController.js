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
// GET /api/locations/type/:type — filter by type
export async function getLocationsByType(req, res) {
  try {
    const data = await Location.find({ type: req.params.type });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// POST /api/locations — create a new location
export async function createLocation(req, res) {
  try {
    const {
      type: rawType,
      name,
      city,
      country,
      timezone,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    let type = rawType;
    if (!type) {
      if (timezone) type = "country";
      else if (country && !city) type = "city";
      else type = "location";
    }

    if (!["country", "city", "location"].includes(type)) {
      return res.status(400).json({ message: "Invalid location type." });
    }

    if (type === "country" && !timezone?.trim()) {
      return res.status(400).json({ message: "Timezone is required for country." });
    }

    if (type === "city" && !country?.trim()) {
      return res.status(400).json({ message: "Country is required for city." });
    }

    if (type === "location" && (!city?.trim() || !country?.trim())) {
      return res.status(400).json({ message: "City and country are required for location." });
    }

    const location = await Location.create({
      type,
      name: name.trim(),
      timezone: timezone?.trim(),
      city: city?.trim(),
      country: country?.trim(),
    });
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