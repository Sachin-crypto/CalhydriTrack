import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  addWater,
  createMeal,
  createEntry,
  getTodayEntry,
  setWater,
} from "../controllers/entry.controller.js";

const router = express.Router();

router.post("/", auth, createEntry);
router.get("/today", auth, getTodayEntry);
router.post("/meals", auth, createMeal);
router.post("/water/add", auth, addWater);
router.put("/water", auth, setWater);

export default router;