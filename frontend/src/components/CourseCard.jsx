import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
                 overflow-hidden group border border-gray-100"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="h-40 w-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* PLAY OVERLAY */}
        <div
          onClick={() => navigate(`/course/${course.id}`)}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100
                     transition flex items-center justify-center cursor-pointer"
        >
          <PlayCircle className="text-white w-12 h-12" />
        </div>

        {/* BADGE */}
        <span
          className="absolute top-3 left-3 text-xs font-semibold
                     bg-purple-600 text-white px-3 py-1 rounded-full"
        >
          {course.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        <h4 className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2">
          {course.title}
        </h4>

        <p className="text-xs text-gray-500">
          👨‍🏫 {course.instructor}
        </p>

        {/* PROGRESS */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/course/${course.id}`)}
          className="w-full mt-2 py-2 rounded-lg text-sm font-semibold
                     bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          Continue Learning →
        </button>
      </div>
    </div>
  );
}

