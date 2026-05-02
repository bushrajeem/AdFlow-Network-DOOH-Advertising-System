import express from "express";
import {
  signup,
  login,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup); // /api/users/signup
router.post("/login", login); // /api/users/login
router.get("/", getUsers, protect, adminOnly); // /api/users/ (admin only)
router.delete("/:id", deleteUser, protect, adminOnly); // /api/users/:id (admin only)

export default router;
