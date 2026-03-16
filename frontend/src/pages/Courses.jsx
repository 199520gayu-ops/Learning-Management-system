import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Courses</h1>

        {user.role === "coordinator" && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">
            + Create Course
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course._id}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg dark:text-white">
              {course.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {course.description}
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Coordinator: {course.coordinator?.name}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
