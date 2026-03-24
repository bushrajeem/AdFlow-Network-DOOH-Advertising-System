import express from "express";
import {
  getLocations,
  createLocation,
  deleteLocation,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getLocations);
router.post("/", createLocation);
router.delete("/:id", deleteLocation);

export default router;
