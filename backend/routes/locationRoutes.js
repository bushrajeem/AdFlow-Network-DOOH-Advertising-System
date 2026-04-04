import express from "express";
import {
  getLocations,
  createLocation,
  deleteLocation,
  getLocationsByType,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getLocations);
router.post("/", createLocation);
router.get("/type/:type", getLocationsByType);
router.delete("/:id", deleteLocation);

export default router;
