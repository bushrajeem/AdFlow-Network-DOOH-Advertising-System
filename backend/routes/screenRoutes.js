import express from "express";
import {
  getScreens,
  getScreenByCode,
  createScreen,
  updateScreen,
  deleteScreen,
} from "../controllers/screenController.js";

const router = express.Router();

router.get("/", getScreens);
router.get("/code/:code", getScreenByCode);
router.post("/", createScreen);
router.patch("/:id", updateScreen);
router.delete("/:id", deleteScreen);

export default router;
