import express from "express";
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

import { protect } from "../middleware/authMiddleware.js";
import { roleCheck } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* CREATE COURSE */
router.post(
  "/",
  protect,
  roleCheck(["coordinator", "educator"]),
  createCourse
);

/* GET COURSES */
router.get("/", protect, getCourses);

/* UPDATE COURSE */
router.put(
  "/:id",
  protect,
  roleCheck(["coordinator", "educator"]),
  updateCourse
);

/* DELETE COURSE */
router.delete(
  "/:id",
  protect,
  roleCheck(["coordinator", "educator"]),
  deleteCourse
);

export default router;
