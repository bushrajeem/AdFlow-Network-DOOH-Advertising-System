import express from "express";
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.patch("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

export default router;
