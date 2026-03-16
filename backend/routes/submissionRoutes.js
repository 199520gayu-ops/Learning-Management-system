import express from "express";
import Submission from "../models/Submission.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Learner Submit
router.post("/", protect, authorizeRoles("learner"), async (req, res) => {
  const submission = await Submission.create({
    ...req.body,
    learner: req.user.id,
  });

  res.json(submission);
});

// Educator Evaluate
router.put("/:id", protect, authorizeRoles("educator"), async (req, res) => {
  const submission = await Submission.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(submission);
});

router.get("/", protect, async (req, res) => {
  const submissions = await Submission.find().populate("assignment learner");
  res.json(submissions);
});

export default router;
