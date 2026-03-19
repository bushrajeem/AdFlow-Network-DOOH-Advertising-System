import express              from "express";
import { getAds, createAd, deleteAd } from "../controllers/adController.js";

const router = express.Router();

router.get("/",     getAds);
router.post("/",    createAd);
router.delete("/:id", deleteAd);

export default router;