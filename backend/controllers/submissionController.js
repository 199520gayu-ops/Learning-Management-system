import Submission from "../models/Submission.js";

/* =====================
   SUBMIT ASSIGNMENT
===================== */
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, answer } = req.body;

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      answer,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================
   EVALUATE SUBMISSION
===================== */
export const evaluateSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback, evaluated: true },
      { new: true }
    );

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
