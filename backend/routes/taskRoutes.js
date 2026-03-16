import express from "express";
import {
  getTasks,
  createTask,
  replyTask,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/create", createTask);
router.post("/reply/:id", replyTask);
router.delete("/:id", deleteTask);

export default router;