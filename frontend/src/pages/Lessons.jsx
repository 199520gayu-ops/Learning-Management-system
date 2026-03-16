import { useState } from "react";
import {
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
} from "lucide-react";

export default function Lessons() {
  const [active, setActive] = useState("intro");
  const [progress, setProgress] = useState(25);

  const lessons = {
    intro: {
      title: "JavaScript Introduction",
      type: "video",
      src: "https://www.youtube.com/embed/W6NZfCO5SIk",
    },
    variables: {
      title: "Variables & Data Types",
      type: "video",
      src: "https://www.youtube.com/embed/hdI2bqOjy3c",
    },
    notes: {
      title: "JavaScript Notes",
      type: "pdf",
      src: "https://www.w3schools.com/js/js_intro.asp",
    },
    quiz: {
      title: "JavaScript Basics Quiz",
      type: "quiz",
    },
  };

  const handleClick = (key) => {
    setActive(key);
    setProgress((prev) => Math.min(prev + 15, 100));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">JavaScript Mastery Course</h1>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Course Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            {lessons[active].title}
          </h2>

          {/* VIDEO */}
          {lessons[active].type === "video" && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={lessons[active].src}
                title="JavaScript Tutorial"
                allowFullScreen
              />
            </div>
          )}

          {/* PDF */}
          {lessons[active].type === "pdf" && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Click below to open JavaScript notes:
              </p>
              <a
                href={lessons[active].src}
                target="_blank"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Open Notes
              </a>
            </div>
          )}

          {/* QUIZ */}
          {lessons[active].type === "quiz" && <Quiz />}
        </div>

        {/* RIGHT SIDE MENU */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Course Content</h3>

          <ul className="space-y-3">
            <MenuItem
              icon={<CheckCircle size={18} />}
              label="JavaScript Introduction"
              active={active === "intro"}
              onClick={() => handleClick("intro")}
            />
            <MenuItem
              icon={<PlayCircle size={18} />}
              label="Variables & Data Types"
              active={active === "variables"}
              onClick={() => handleClick("variables")}
            />
            <MenuItem
              icon={<FileText size={18} />}
              label="JavaScript Notes (PDF)"
              active={active === "notes"}
              onClick={() => handleClick("notes")}
            />
            <MenuItem
              icon={<HelpCircle size={18} />}
              label="JavaScript Basics Quiz"
              active={active === "quiz"}
              onClick={() => handleClick("quiz")}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, active, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
      ${active ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"}
      `}
    >
      {icon}
      {label}
    </li>
  );
}

function Quiz() {
  const [score, setScore] = useState(null);

  const handleAnswer = (correct) => {
    setScore(correct ? 1 : 0);
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">
        What is JavaScript?
      </h3>

      <div className="space-y-3">
        <button
          onClick={() => handleAnswer(false)}
          className="block w-full bg-gray-200 p-2 rounded"
        >
          A database
        </button>

        <button
          onClick={() => handleAnswer(true)}
          className="block w-full bg-gray-200 p-2 rounded"
        >
          A programming language
        </button>

        <button
          onClick={() => handleAnswer(false)}
          className="block w-full bg-gray-200 p-2 rounded"
        >
          A browser
        </button>
      </div>

      {score !== null && (
        <p className="mt-4 font-semibold">
          {score === 1 ? "✅ Correct!" : "❌ Wrong Answer"}
        </p>
      )}
    </div>
  );
}
