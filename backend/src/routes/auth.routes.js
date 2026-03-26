import express from "express";
import { signup, login, logout, me } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, me);

export default router;