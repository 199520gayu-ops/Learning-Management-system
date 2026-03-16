import React, { useEffect, useState } from "react";
import { Users, Search, Edit3, Trash2, Loader2, AlertCircle, UserX, X } from "lucide-react";
import API from "../api/axios";

const emptyForm = { name: "", email: "", progress: "" };

export default function Students() {
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [formData,   setFormData]   = useState(emptyForm);
  const [formError,  setFormError]  = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting,   setDeleting]   = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/students");
      setStudents(Array.isArray(res.data) ? res.data : (res.data?.students || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (student) => {
    setEditingId(student._id);
    setFormData({ name: student.name || "", email: student.email || "", progress: student.progress ?? "" });
    setFormError(null);
    setShowModal(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (!formData.name.trim())  { setFormError("Name is required.");  return; }
    if (!formData.email.trim()) { setFormError("Email is required."); return; }
    try {
      setSubmitting(true);
      setFormError(null);
      const res = await API.put(`/students/${editingId}`, {
        name:     formData.name,
        email:    formData.email,
        progress: Number(formData.progress) || 0,
      });
      setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update student.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    setDeleting(id);
    try {
      await API.delete(`/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={36} />
        <p className="text-slate-400 text-sm font-medium">Loading students…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5 lg:p-7">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-blue-500" /> Learners
            </h2>
            <p className="text-slate-400 text-xs mt-1">{students.length} students enrolled</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2.5 text-xs">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  {["Student", "Email", "Course", "Progress", "Actions"].map((h, i) => (
                    <th key={h}
                      className={`px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap
                        ${i === 4 ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center text-slate-300 dark:text-slate-700">
                        <UserX size={40} className="mb-3" />
                        <p className="font-semibold text-sm text-slate-400">
                          {search ? "No students match your search." : "No students found."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((student, idx) => {
                  const progress = student.progress || 0;
                  const barColor = progress >= 75 ? "bg-emerald-500" : progress >= 40 ? "bg-blue-500" : "bg-amber-500";

                  return (
                    <tr key={student._id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors
                        ${idx < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>

                      {/* Student */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                            {student.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {student.email}
                        </span>
                      </td>

                      {/* Course */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap
                          ${student.enrolledCourse?.title
                            ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}>
                          {student.enrolledCourse?.title || "Not Enrolled"}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-[120px]">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`${barColor} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 w-8 text-right shrink-0">
                            {progress}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(student)}
                            title="Edit"
                            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => deleteStudent(student._id)}
                            disabled={deleting === student._id}
                            title="Delete"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all disabled:opacity-50">
                            {deleting === student._id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              Showing{" "}
              <strong className="text-slate-600 dark:text-slate-300 font-semibold">{filtered.length}</strong>
              {" "}of{" "}
              <strong className="text-slate-600 dark:text-slate-300 font-semibold">{students.length}</strong>
              {" "}students
            </span>
            <span className="text-[11px] text-slate-400">
              {students.filter(s => s.progress === 100).length} completed
            </span>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ───────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">

            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <Edit3 size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Student</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{formData.name}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
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
                  Name <span className="text-rose-500">*</span>
                </label>
                <input name="name" type="text" value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Progress (0–100)
                </label>
                <div className="space-y-2">
                  <input name="progress" type="range" min="0" max="100"
                    value={formData.progress || 0}
                    onChange={handleChange}
                    className="w-full accent-blue-500" />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>0%</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{formData.progress || 0}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpdate} disabled={submitting}
                  className="flex-[2] py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  {submitting
                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    : <><Edit3 size={14} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}