import express from "express";
import { createQuestion, getQuestions, replyQuestion } from "../controllers/discussionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/", protect, getQuestions);
router.post("/:id/reply", protect, replyQuestion);

export default router;