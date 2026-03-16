// ✅ MUST be first — before any other imports that need env vars
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "./config/db.js";
import passport from "passport";
import "./passport/googleStrategy.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studyPlanRoutes from "./routes/studyPlanRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

connectDB();

/* ================================
   Gemini AI Initialization
================================ */
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env file");
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Gemini AI initialized successfully");
} catch (err) {
  console.error("❌ Gemini Init Error:", err.message);
}

/* ================================
   CORS
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://learning-management-system-one-zeta.vercel.app",
  "https://learning-management-system-ayysxr5as.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle preflight requests
app.options(/(.*)/, cors());

app.use(express.json());
app.use(passport.initialize());

/* ================================
   Health Check Route
================================ */
app.get("/", (req, res) => {
  res.json({
    status: "✅ Learnify Backend is Live",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ================================
   Chatbot API
================================ */
app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;
  if (!genAI) return res.status(500).json({ reply: "AI not initialized." });

  const modelNames = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let reply = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `You are Learnify AI. Short answer: ${message}` }] }],
        generationConfig: { maxOutputTokens: 300 },
      });
      const response = await result.response;
      reply = response.text();
      if (reply) {
        console.log(`✅ Success using ${modelName}`);
        break;
      }
    } catch (err) {
      console.warn(`⚠️ ${modelName} failed, trying next...`);
    }
  }

  if (!reply) return res.status(503).json({ reply: "Service temporarily busy." });
  res.json({ reply });
});

/* ================================
   Routes
================================ */
app.use("/api/auth",        authRoutes);
app.use("/api/courses",     courseRoutes);
app.use("/api/students",    studentRoutes);
app.use("/api/plan",        studyPlanRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/quiz",        quizRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/discussion",  discussionRoutes);
app.use("/api/tasks",       taskRoutes);

/* ================================
   Static Uploads
================================ */
app.use("/uploads", express.static("uploads"));

/* ================================
   Server Start
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Running on port ${PORT}`);
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY ? "✅ Found" : "❌ MISSING"}`);
  console.log(`🌐 CLIENT_URL: ${process.env.CLIENT_URL || "⚠️ Not set"}`);
  console.log(`✅ Allowed Origins: ${allowedOrigins.join(", ")}`);
});