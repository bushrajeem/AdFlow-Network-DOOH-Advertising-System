import express from "express";
import { getAds, createAd, deleteAd, incrementPlayCount } from "../controllers/adController.js";
import uploadVideo from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAds);
router.post("/", uploadVideo.single("video"), createAd);
router.patch("/:id/play", incrementPlayCount);
router.delete("/:id", deleteAd);

export default router;
