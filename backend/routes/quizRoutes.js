import express from "express";
import { createQuiz, getQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuiz);
router.get("/", protect, getQuiz);

export default router;