import User from "../models/User.js";

/* GET ONLY STUDENTS */
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "learner" })
      .populate("enrolledCourse", "title")
      .select("-password");
    res.json(students);
  } catch (err) {
    console.error("Get Students Error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* UPDATE STUDENT */
export const updateStudent = async (req, res) => {
  try {
    const { password, role, ...updateFields } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate("enrolledCourse", "title");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Update Student Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* DELETE STUDENT */
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Delete Student Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};