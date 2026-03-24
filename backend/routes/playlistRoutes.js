import express from "express";
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.delete("/:id", deletePlaylist);

export default router;
