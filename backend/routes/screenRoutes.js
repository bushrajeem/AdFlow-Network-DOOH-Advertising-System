import express from "express";
import { getScreens, createScreen, updateScreen, deleteScreen } from "../controllers/screenController.js";

const router = express.Router();

router.get("/",        getScreens);
router.post("/",       createScreen);
router.patch("/:id",   updateScreen);
router.delete("/:id",  deleteScreen);

export default router;