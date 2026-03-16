import express from "express";
import multer from "multer";
import Assignment from "../models/Assignment.js";

const router = express.Router();

/* ================= MULTER STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage });

/* ================= SUBMIT ASSIGNMENT ================= */
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const assignment = await Assignment.create({
      studentId: req.body.studentId,
      lessonId: req.body.lessonId,
      fileUrl: req.file.path,
      fileName: req.file.originalname
    });
    res.status(201).json({ message: "Assignment submitted successfully", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed" });
  }
});

/* ================= GET ALL FOR EDUCATOR ================= */
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
});

/* ================= REVIEW ASSIGNMENT ================= */
router.put("/review/:id", async (req, res) => {
  try {
    const { score, feedback } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        score: Number(score),
        feedback,
        status: "reviewed",
        reviewedAt: new Date(),
      },
      { new: true, runValidators: false }
    ).populate("studentId", "name email");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Reviewed successfully", assignment });
  } catch (err) {
    console.error("REVIEW ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;