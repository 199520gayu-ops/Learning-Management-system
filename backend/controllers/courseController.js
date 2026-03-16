import Course from "../models/Course.js";

/* =========================
   CREATE COURSE
========================= */
export const createCourse = async (req, res) => {
  try {
    const {
      title, description, price, oldPrice,
      image, category, level, totalHours, language,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      oldPrice,
      image,
      category,
      level,
      totalHours,
      language,
      educator: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Course creation failed" });
  }
};

/* =========================
   GET COURSES
========================= */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ educator: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/* =========================
   UPDATE COURSE
========================= */
export const updateCourse = async (req, res) => {
  try {
    // Remove fields that should not be overwritten
    const { educator, _id, __v, ...updateFields } = req.body;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, educator: req.user._id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found or not authorized" });
    }

    res.json(course);
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* =========================
   DELETE COURSE
========================= */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found or not authorized" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};