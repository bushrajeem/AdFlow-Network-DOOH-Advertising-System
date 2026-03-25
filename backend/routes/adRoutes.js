import express from "express";
import { getAds, createAd, deleteAd } from "../controllers/adController.js";
import uploadVideo from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAds);
router.post("/", uploadVideo.single("video"), createAd);
router.delete("/:id", deleteAd);

export default router;
