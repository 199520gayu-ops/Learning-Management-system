import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, Loader2, AlertCircle, X, RefreshCw, CalendarCheck } from "lucide-react";
import API from "../api/axios";

export default function ReviewAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [score,       setScore]       = useState("");
  const [feedback,    setFeedback]    = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [formError,   setFormError]   = useState(null);
  const [filter,      setFilter]      = useState("all");

  useEffect(() => { fetchAssignments(); }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/assignments");
      setAssignments(Array.isArray(res.data) ? res.data : (res.data?.assignments || []));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch assignments.");
    } finally {
      setLoading(false);
    }
  };

  const openReview = (assignment) => {
    setSelected(assignment);
    setScore(assignment.score ?? "");
    setFeedback(assignment.feedback || "");
    setFormError(null);
  };

  const submitReview = async (id) => {
    if (!score)                                    { setFormError("Score is required."); return; }
    if (Number(score) < 0 || Number(score) > 100) { setFormError("Score must be between 0 and 100."); return; }
    try {
      setSubmitting(true);
      setFormError(null);
      const res = await API.put(`/assignments/review/${id}`, { score: Number(score), feedback });
      setAssignments(prev => prev.map(a =>
        a._id === id
          ? { ...(res.data?.assignment || a), score: Number(score), feedback, status: "reviewed", reviewedAt: res.data?.assignment?.reviewedAt || new Date().toISOString() }
          : a
      ));
      setSelected(null);
      setScore("");
      setFeedback("");
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Review failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const pendingCount  = assignments.filter(a => a.status !== "reviewed").length;
  const reviewedCount = assignments.filter(a => a.status === "reviewed").length;
  const filtered      = assignments.filter(a =>
    filter === "pending"  ? a.status !== "reviewed" :
    filter === "reviewed" ? a.status === "reviewed"  : true
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={36} />
        <p className="text-slate-400 text-sm font-medium">Loading assignments…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5 lg:p-7">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assignment Submissions</h2>
            <p className="text-slate-400 text-xs mt-1">
              {assignments.length} total · {pendingCount} pending · {reviewedCount} reviewed
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter pills */}
            <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-0.5">
              {[
                { key: "all",      label: "All" },
                { key: "pending",  label: pendingCount > 0 ? `Pending (${pendingCount})` : "Pending" },
                { key: "reviewed", label: "Reviewed" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap
                    ${filter === key
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}>
                  {label}
                </button>
              ))}
            </div>

            <button onClick={fetchAssignments} title="Refresh"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2.5 text-xs">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  {[
                    { label: "Student",     align: "" },
                    { label: "File",        align: "" },
                    { label: "Submitted",   align: "" },
                    { label: "Score",       align: "" },
                    { label: "Status",      align: "" },
                    { label: "Reviewed On", align: "" },
                    { label: "Action",      align: "text-right" },
                  ].map(({ label, align }) => (
                    <th key={label}
                      className={`px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap ${align}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center text-slate-300 dark:text-slate-700">
                        <FileText size={40} className="mb-3" />
                        <p className="font-semibold text-sm text-slate-400">
                          {filter === "pending"  ? "No pending submissions."     :
                           filter === "reviewed" ? "No reviewed submissions yet." :
                                                   "No submissions found."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((a, idx) => {
                  const isReviewed = a.status === "reviewed";
                  // read both field names your API might return
                  const submitted  = formatDate(a.createdAt || a.submittedAt);
                  const reviewedOn = formatDate(a.reviewedAt || (isReviewed ? a.updatedAt : null));

                  return (
                    <tr key={a._id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors
                        ${idx < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>

                      {/* Student */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {(a.studentId?.name || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                              {a.studentId?.name || "Unknown"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                              {a.studentId?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* File */}
                      <td className="px-5 py-3.5">
                        <a href={`http://localhost:5000/${a.fileUrl}`} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 font-semibold text-xs hover:underline">
                          <FileText size={13} />
                          <span className="max-w-[110px] truncate">{a.fileName || "View File"}</span>
                        </a>
                      </td>

                      {/* Submitted date */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {submitted ? (
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                              {submitted.date}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                              {submitted.time}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="px-5 py-3.5">
                        {a.score != null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shrink-0">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  a.score >= 75 ? "bg-emerald-500" :
                                  a.score >= 50 ? "bg-amber-500"   : "bg-rose-500"
                                }`}
                                style={{ width: `${a.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap">
                              {a.score}
                              <span className="text-[11px] text-slate-400 font-normal">/100</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {isReviewed ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-bold border border-emerald-100 dark:border-emerald-900/30 whitespace-nowrap">
                            <CheckCircle size={10} /> Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg font-bold border border-amber-100 dark:border-amber-900/30 whitespace-nowrap">
                            <Clock size={10} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Reviewed On */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {isReviewed && reviewedOn ? (
                          <div className="flex items-start gap-1.5">
                            <CalendarCheck size={23} className="text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                                {reviewedOn.date}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                                {reviewedOn.time}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => openReview(a)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap
                            ${isReviewed
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                              : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"}`}>
                          {isReviewed ? "Re-review" : "Review"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              Showing{" "}
              <strong className="text-slate-600 dark:text-slate-300 font-semibold">{filtered.length}</strong>
              {" "}of{" "}
              <strong className="text-slate-600 dark:text-slate-300 font-semibold">{assignments.length}</strong>
              {" "}submissions
            </span>
            <span className="text-[11px] text-slate-400">{pendingCount} awaiting review</span>
          </div>
        </div>
      </div>

      {/* ── Review Modal ─────────────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">

            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <CheckCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Review Assignment</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selected.studentId?.name}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl text-xs flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
                  <AlertCircle size={13} /> {formError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Score (0–100) <span className="text-rose-500">*</span>
                </label>
                <input type="number" min="0" max="100" placeholder="e.g. 85"
                  value={score} onChange={e => setScore(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Feedback
                </label>
                <textarea placeholder="Write constructive feedback…"
                  value={feedback} onChange={e => setFeedback(e.target.value)} rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button onClick={() => submitReview(selected._id)} disabled={submitting}
                  className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  {submitting
                    ? <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                    : <><CheckCircle size={14} /> Submit Review</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}