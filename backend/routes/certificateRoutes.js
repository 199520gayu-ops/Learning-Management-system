import express from "express";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();

// Generate certificate after course completion
router.post("/generate", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const existing = await Certificate.findOne({ userId, courseId });
    if (existing) {
      return res.json(existing); // return existing (no duplicate)
    }

    const cert = await Certificate.create({
      userId,
      courseId,
      certificateId: `CERT-${Date.now()}`,
    });

    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all certificates for user
router.get("/user/:userId", async (req, res) => {
  const certificates = await Certificate.find({
    userId: req.params.userId,
  }).populate("courseId");

  res.json(certificates);
});

// Get single certificate
router.get("/:certId", async (req, res) => {
  const cert = await Certificate.findOne({
    certificateId: req.params.certId,
  })
    .populate("userId")
    .populate("courseId");

  res.json(cert);
});

export default router;