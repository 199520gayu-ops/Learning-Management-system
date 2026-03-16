import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function Assignments() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "JavaScript Basics",
      description: "Variables, data types, and operators",
      dueDate: "2026-02-25",
      status: "Pending",
      file: null,
    },
    {
      id: 2,
      title: "Functions & Scope",
      description: "Create reusable JS functions",
      dueDate: "2026-03-02",
      status: "Submitted",
      file: "functions.js",
    },
  ]);

  const handleUpload = (id, file) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, file: file.name, status: "Submitted" }
          : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
      Assignments
      </h1>

      <div className="space-y-6">
        {assignments.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow p-5"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {a.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {a.description}
                </p>
              </div>

              <StatusBadge status={a.status} />
            </div>

            {/* Details */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Due: {a.dueDate}
              </div>

              {a.file && (
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  {a.file}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              {a.status === "Pending" && (
                <label className="flex items-center gap-2 cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <Upload size={16} />
                  Upload & Submit
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleUpload(a.id, e.target.files[0])
                    }
                  />
                </label>
              )}

              {a.status === "Submitted" && (
                <button className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg cursor-default">
                  <CheckCircle size={16} />
                  Submitted
                </button>
              )}

              <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STATUS BADGE */
function StatusBadge({ status }) {
  if (status === "Pending") {
    return (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
        Pending
      </span>
    );
  }

  if (status === "Submitted") {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        Submitted
      </span>
    );
  }

  return null;
}
