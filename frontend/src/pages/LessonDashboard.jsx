import React, { useState, useRef } from "react";
import {
  CheckCircle,
  ArrowLeft,
  Loader2,
  FileText,
  FileUp,
  Lock,
  Eye,
  Edit,
  Send,
  MessageCircle,
  Award,
  PlayCircle,
  BookOpen,
  ClipboardList,
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LessonDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [assignmentScore, setAssignmentScore] = useState(null);
  const [educatorComment, setEducatorComment] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState("not_submitted");

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // ✅ FIXED: Youtube ID extractor
  const getYoutubeId = (url) => {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : "";
  };

  // ================= CURRICULUM =================
  const curriculum = [
    {
      id: 1,
      title: "JavaScript Variables",
      videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk?rel=0&modestbranding=1",
      pdfUrl: "/notes/js-variables.pdf",
      assignmentTask: "Declare variables using var, let and const. Show the difference."
    },
    {
      id: 2,
      title: "Functions in JavaScript",
      videoUrl: "https://www.youtube.com/embed/8dWL3wF_OMw?rel=0&modestbranding=1",
      pdfUrl: "/notes/js-functions.pdf",
      assignmentTask: "Create a function that calculates the area of a circle."
    }
  ];

  // ================= QUIZ =================
  const quizData = [
    {
      q: "Which keyword is used to declare a constant?",
      options: ["var", "let", "const", "define"],
      a: 2
    },
    {
      q: "What is the result of '2' + 2?",
      options: ["4", "22", "NaN", "Error"],
      a: 1
    }
  ];

  // ================= QUIZ FUNCTIONS =================
  const handleNext = () => {
    if (selectedAnswer === quizData[quizIndex].a) {
      setScore((prev) => prev + 1);
    }
    setSelectedAnswer(null);
    setQuizIndex((prev) => prev + 1);
  };

  const handleFinalSubmit = () => {
    let finalScore = score;
    if (selectedAnswer === quizData[quizIndex].a) {
      finalScore += 1;
    }
    const pass = finalScore >= quizData.length * 0.6;
    setScore(finalScore);
    setQuizPassed(pass);
    setFinished(true);
    if (pass && !completedLessons.includes(activeLessonIdx)) {
      setCompletedLessons((prev) => [...prev, activeLessonIdx]);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setFinished(false);
    setSelectedAnswer(null);
    setQuizPassed(false);
  };

  // ================= ASSIGNMENT =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileURL(URL.createObjectURL(file));
    }
  };

  const handleAssignmentSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setAssignmentStatus("submitted");
    }, 2000);
  };

  const handleEducatorReview = () => {
    setAssignmentScore(90);
    setEducatorComment("Excellent work. Clean structure and comments added.");
    setAssignmentStatus("reviewed");
  };

  const handleEdit = () => {
    setAssignmentStatus("not_submitted");
    setFileName(null);
    setFileURL(null);
  };

  const percentage = Math.round((completedLessons.length / curriculum.length) * 100);

  const tabs = [
    { id: "video",      label: "Video",      icon: <PlayCircle size={15} /> },
    { id: "notes",      label: "Notes",      icon: <BookOpen size={15} /> },
    { id: "quiz",       label: "Quiz",       icon: <HelpCircle size={15} /> },
    { id: "assignment", label: "Assignment", icon: <ClipboardList size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-blue-50/40 font-sans">

      

      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── SIDEBAR ── */}
        <aside className="lg:col-span-3 space-y-4">

          {/* Course info */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <BookOpen size={13} className="text-white" />
              </div>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Course</span>
            </div>
            <h2 className="text-base font-extrabold text-blue-900 mt-1">JavaScript Fundamentals</h2>
            <p className="text-[11px] text-blue-400 mt-0.5">{curriculum.length} lessons · Beginner</p>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">Progress</span>
                <span className="text-xs font-extrabold text-blue-700">{percentage}%</span>
              </div>
              <div className="h-2 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[10px] text-blue-300 mt-1.5">
                {completedLessons.length} of {curriculum.length} lessons completed
              </p>
            </div>
          </div>

          {/* Lessons list */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Lessons</span>
            </div>
            <div className="px-3 pb-3 space-y-1">
              {curriculum.map((item, idx) => {
                const isLocked = idx > 0 && !completedLessons.includes(idx - 1);
                const isActive = idx === activeLessonIdx;
                const isDone = completedLessons.includes(idx);

                return (
                  <button
                    key={item.id}
                    disabled={isLocked}
                    onClick={() => {
                      setActiveLessonIdx(idx);
                      setSubmitted(false);
                      resetQuiz();
                      setShowVideo(false);
                      setAssignmentStatus("not_submitted");
                      setFileName(null);
                      setFileURL(null);
                    }}
                    className={`w-full p-3.5 rounded-xl flex items-center gap-3 text-left transition-all duration-200
                      ${isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : isLocked
                        ? "opacity-40 cursor-not-allowed bg-blue-50/50"
                        : "hover:bg-blue-50 text-blue-800"
                      }`}
                  >
                    {/* Lesson number / status icon */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold
                      ${isActive ? "bg-white/20 text-white"
                        : isDone ? "bg-emerald-50 text-emerald-500"
                        : isLocked ? "bg-blue-100 text-blue-300"
                        : "bg-blue-100 text-blue-600"}`}>
                      {isDone
                        ? <CheckCircle2 size={14} />
                        : isLocked
                        ? <Lock size={12} />
                        : <span>{idx + 1}</span>
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : isDone ? "text-blue-600" : "text-blue-800"}`}>
                        {item.title}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isActive ? "text-blue-200" : "text-blue-300"}`}>
                        {isDone ? "Completed" : isLocked ? "Locked" : "Available"}
                      </p>
                    </div>

                    {isActive && <ChevronRight size={14} className="text-white/70 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats pills */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Star size={13} />, label: "XP Earned", val: `${completedLessons.length * 100}`, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
              { icon: <Clock size={13} />, label: "Est. Time", val: "2h 30m", color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
            ].map(({ icon, label, val, color, bg }) => (
              <div key={label} className={`${bg} border rounded-xl p-3`}>
                <div className={`${color} mb-1`}>{icon}</div>
                <p className="text-sm font-extrabold text-blue-900">{val}</p>
                <p className="text-[10px] text-blue-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="lg:col-span-9 space-y-4">

          {/* Lesson title bar */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-0.5">Now Learning</p>
              <h1 className="text-lg font-extrabold text-blue-900">{curriculum[activeLessonIdx].title}</h1>
            </div>
            {completedLessons.includes(activeLessonIdx) && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={13} /> Completed
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-1.5">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200
                    ${activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-blue-400 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content card */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">

            {/* ══════════ VIDEO ══════════ */}
            {activeTab === "video" && (
              <div>
                <div className="relative bg-blue-950 overflow-hidden" style={{ minHeight: 420 }}>
                  {!showVideo ? (
                    <div className="relative">
                      <img
                        src={`https://img.youtube.com/vi/${getYoutubeId(curriculum[activeLessonIdx].videoUrl)}/maxresdefault.jpg`}
                        alt="Thumbnail"
                        className="w-full object-cover"
                        style={{ height: 460 }}
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-blue-950/40" />
                      {/* Play button */}
                      <button
                        onClick={() => setShowVideo(true)}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/40 group-hover:scale-110 transition-transform duration-200">
                          <PlayCircle size={40} className="text-blue-600 ml-1" />
                        </div>
                        <span className="text-white/90 text-sm font-semibold bg-blue-900/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
                          Click to Play Lesson
                        </span>
                      </button>
                      {/* Lesson label overlay */}
                      <div className="absolute bottom-4 left-4 bg-blue-900/70 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
                        <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest">Lesson {activeLessonIdx + 1}</p>
                        <p className="text-white text-sm font-bold">{curriculum[activeLessonIdx].title}</p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="w-full"
                      style={{ height: 460 }}
                      src={`${curriculum[activeLessonIdx].videoUrl}&autoplay=1`}
                      title="Lesson Video"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  )}
                </div>
                {/* Video footer */}
                <div className="px-6 py-4 border-t border-blue-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <PlayCircle size={15} className="text-blue-500" />
                    <span className="font-medium">Watch the full video before moving to Quiz</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-200"
                  >
                    Take Quiz <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ NOTES ══════════ */}
            {activeTab === "notes" && (
              <div className="p-8">
                <div className="flex flex-col items-center text-center max-w-sm mx-auto py-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 shadow-sm">
                    <FileText size={28} className="text-blue-500" />
                  </div>
                  <h3 className="text-lg font-extrabold text-blue-900 mb-1">
                    {curriculum[activeLessonIdx].title}
                  </h3>
                  <p className="text-sm text-blue-400 mb-6">
                    Download the PDF notes for this lesson to study offline and review key concepts.
                  </p>
                  <a
                    href={curriculum[activeLessonIdx].pdfUrl}
                    download
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-md shadow-blue-200"
                  >
                    <Download size={16} /> Download PDF Notes
                  </a>
                  <p className="text-[10px] text-blue-300 mt-3">PDF · Study material included</p>
                </div>
              </div>
            )}

            {/* ══════════ QUIZ ══════════ */}
            {activeTab === "quiz" && (
              <div className="p-6 md:p-8">
                {!finished ? (
                  <div className="max-w-2xl">
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Quiz</p>
                        <h3 className="text-lg font-extrabold text-blue-900">
                          Question {quizIndex + 1} <span className="text-blue-300 font-medium">/ {quizData.length}</span>
                        </h3>
                      </div>
                      <div className="flex gap-1.5">
                        {quizData.map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              i < quizIndex
                                ? "w-8 bg-emerald-400"
                                : i === quizIndex
                                ? "w-8 bg-blue-500"
                                : "w-8 bg-blue-100"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Question card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                      <p className="text-base font-semibold text-blue-900 leading-relaxed">
                        {quizData[quizIndex].q}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                      {quizData[quizIndex].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedAnswer(i)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150 group
                            ${selectedAnswer === i
                              ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100"
                              : "border-blue-100 bg-white hover:border-blue-300 hover:bg-blue-50/60"
                            }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                            ${selectedAnswer === i
                              ? "border-blue-600 bg-blue-600"
                              : "border-blue-200 group-hover:border-blue-400"
                            }`}>
                            {selectedAnswer === i && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span className={`text-sm font-semibold ${selectedAnswer === i ? "text-blue-800" : "text-blue-600"}`}>
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Action button */}
                    <div className="flex justify-end">
                      {quizIndex < quizData.length - 1 ? (
                        <button
                          onClick={handleNext}
                          disabled={selectedAnswer === null}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 disabled:text-blue-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm shadow-blue-200"
                        >
                          Next Question <ChevronRight size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={handleFinalSubmit}
                          disabled={selectedAnswer === null}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-blue-200 disabled:text-blue-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm shadow-emerald-200"
                        >
                          <CheckCircle2 size={15} /> Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Quiz Result */
                  <div className="max-w-md mx-auto py-6 text-center">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg
                      ${quizPassed
                        ? "bg-emerald-50 border border-emerald-200 shadow-emerald-100"
                        : "bg-red-50 border border-red-200 shadow-red-100"}`}>
                      {quizPassed
                        ? <Trophy size={36} className="text-emerald-500" />
                        : <XCircle size={36} className="text-red-400" />
                      }
                    </div>

                    <h2 className="text-2xl font-extrabold text-blue-900 mb-1">
                      {quizPassed ? "Well Done! 🎉" : "Keep Trying!"}
                    </h2>
                    <p className="text-blue-400 text-sm mb-5">
                      {quizPassed ? "You passed this lesson's quiz." : "You didn't reach the passing score."}
                    </p>

                    {/* Score */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Final Score</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-5xl font-black text-blue-900">{score}</span>
                        <span className="text-2xl text-blue-300 font-bold">/ {quizData.length}</span>
                      </div>
                      <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                        ${quizPassed
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                          : "bg-red-50 border border-red-200 text-red-500"}`}>
                        {quizPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {quizPassed ? "Passed — Lesson Unlocked" : "Failed — Try Again"}
                      </div>
                    </div>

                    <button
                      onClick={resetQuiz}
                      className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm shadow-blue-200"
                    >
                      <RefreshCw size={14} /> Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ══════════ ASSIGNMENT ══════════ */}
            {activeTab === "assignment" && (
              <div className="p-6 md:p-8 space-y-5">

                {/* Task card */}
                <div className="relative bg-blue-600 rounded-2xl p-5 overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-12 w-16 h-16 bg-white/5 rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                        <ClipboardList size={13} className="text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Assignment Task</span>
                    </div>
                    <p className="text-white font-semibold text-sm leading-relaxed">
                      {curriculum[activeLessonIdx].assignmentTask}
                    </p>
                  </div>
                </div>

                {/* ── NOT SUBMITTED ── */}
                {assignmentStatus === "not_submitted" && (
                  <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-blue-900 mb-1">Upload Your Solution</h4>
                    <p className="text-xs text-blue-400 mb-5">Attach your file and submit it to your educator for review.</p>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                    {/* File drop area */}
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className={`w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl py-8 px-4 mb-4 transition-all duration-200
                        ${fileName
                          ? "border-blue-400 bg-blue-50"
                          : "border-blue-100 bg-blue-50/40 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1
                        ${fileName ? "bg-blue-600" : "bg-blue-100"}`}>
                        <FileUp size={20} className={fileName ? "text-white" : "text-blue-400"} />
                      </div>
                      {fileName ? (
                        <>
                          <p className="text-sm font-bold text-blue-800">{fileName}</p>
                          <p className="text-[11px] text-blue-400">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-blue-600">Click to upload file</p>
                          <p className="text-[11px] text-blue-300">PDF, DOC, ZIP supported</p>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleAssignmentSubmit}
                      disabled={!fileName || isUploading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 disabled:text-blue-400 text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-blue-200"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Send size={15} /> Submit to Educator
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* ── SUBMITTED ── */}
                {assignmentStatus === "submitted" && (
                  <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                          <AlertCircle size={18} className="text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm">Awaiting Review</h4>
                          <p className="text-[11px] text-blue-400">Your educator will review soon</p>
                        </div>
                      </div>
                      <span className="bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                        Submitted
                      </span>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 mb-4">
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Your assignment has been submitted successfully. You will be notified once the educator reviews it.
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <a
                        href={fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold transition"
                      >
                        <Eye size={14} /> View Submitted File
                      </a>

                      {/* Demo only */}
                      <button
                        onClick={handleEducatorReview}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-200"
                      >
                        <CheckCircle2 size={13} /> Simulate Educator Review
                      </button>
                    </div>
                  </div>
                )}

                {/* ── REVIEWED ── */}
                {assignmentStatus === "reviewed" && (
                  <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                          <Award size={18} className="text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm">Assignment Reviewed</h4>
                          <p className="text-[11px] text-blue-400">Educator has graded your submission</p>
                        </div>
                      </div>
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                        Reviewed
                      </span>
                    </div>

                    {/* Score display */}
                    <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
                        <span className="text-xl font-black text-white">{assignmentScore}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-0.5">Your Score</p>
                        <p className="text-base font-extrabold text-blue-900">{assignmentScore} / 100</p>
                        <div className="mt-1 h-1.5 w-32 bg-blue-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${assignmentScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                        <MessageCircle size={11} /> Educator Feedback
                      </p>
                      <p className="text-sm text-blue-800 leading-relaxed">{educatorComment}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        <Eye size={13} /> View Submission
                      </a>
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shadow-amber-200"
                      >
                        <Edit size={13} /> Edit & Resubmit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}