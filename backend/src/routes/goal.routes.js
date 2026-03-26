import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getGoal, setGoal } from "../controllers/goal.controller.js";

const router = express.Router();

router.get("/", auth, getGoal);
router.post("/", auth, setGoal);

export default router;