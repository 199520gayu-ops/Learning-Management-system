import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ─── Only coordinators can manage users ───────────────────────────────────────
const requireCoordinator = (req, res, next) => {
  if (req.user?.role !== "coordinator") {
    return res.status(403).json({ message: "Coordinators only." });
  }
  next();
};

// ================= NORMAL AUTH =================

router.post("/register", register);
router.post("/login", login);

// ================= USER MANAGEMENT =================
// GET    /api/auth/users      — fetch all users
// PUT    /api/auth/users/:id  — update a user
// DELETE /api/auth/users/:id  — delete a user

router.get("/users", protect, requireCoordinator, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/users/:id", protect, requireCoordinator, async (req, res) => {
  try {
    const { name, email, role, progress } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, progress },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/users/:id", protect, requireCoordinator, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= GOOGLE LOGIN =================

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const user  = req.user.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/social-success?token=${token}&role=${user.role}`);
  }
);

// ================= FACEBOOK =================

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const user  = req.user.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/social-success?token=${token}&role=${user.role}`);
  }
);

// ================= GITHUB =================

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const user  = req.user.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/social-success?token=${token}&role=${user.role}`);
  }
);

// ================= LINKEDIN =================

router.get("/linkedin", passport.authenticate("linkedin", { scope: ["r_emailaddress", "r_liteprofile"] }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { session: false, failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`http://localhost:5173/social-success?token=${token}&role=${user.role}`);
  }
);

export default router;