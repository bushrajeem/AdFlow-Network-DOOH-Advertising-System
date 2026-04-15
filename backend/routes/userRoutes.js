import express from "express";
import { signup, login, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup); // /api/users/signup
router.post("/login", login);   // /api/users/login
router.get("/", getUsers);

export default router;