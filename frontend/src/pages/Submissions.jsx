import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    API.get("/submissions")
      .then(res => setSubmissions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Submissions
      </h1>

      <div className="space-y-4">
        {submissions.map(sub => (
          <div
            key={sub._id}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow"
          >
            <h2 className="font-semibold dark:text-white">
              Assignment: {sub.assignment?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {sub.content}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Learner: {sub.learner?.name}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
