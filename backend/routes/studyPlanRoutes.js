import express from "express";
import { createPlan, getPlans } from "../controllers/studyPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPlan);
router.get("/", protect, getPlans);

export default router;