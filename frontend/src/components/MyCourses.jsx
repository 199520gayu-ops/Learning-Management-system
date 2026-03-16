import React, { useState, useEffect } from "react";
import {
  Plus, Edit3, Trash2, Search,
  Loader2, AlertCircle, X, BookOpen
} from "lucide-react";
import API from "../api/axios";

const CATEGORIES = ["Frontend", "Full Stack", "AI", "Design", "Data Science", "Security", "Cloud", "DevOps", "General"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  oldPrice: "",
  image: "",
  category: "General",
  level: "Beginner",
  totalHours: "",
  language: "English",
};

export default function MyCourses() {
  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal,  setShowModal]  = useState(false);
  const [modalMode,  setModalMode]  = useState("create");
  const [editingId,  setEditingId]  = useState(null);
  const [formData,   setFormData]   = useState(emptyForm);
  const [formError,  setFormError]  = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await API.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch courses from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setModalMode("edit");
    setEditingId(course._id);
    setFormData({
      title:       course.title       || "",
      description: course.description || "",
      price:       course.price       ?? "",
      oldPrice:    course.oldPrice    ?? "",
      image:       course.image       || "",
      category:    course.category    || "General",
      level:       course.level       || "Beginner",
      totalHours:  course.totalHours  ?? "",
      language:    course.language    || "English",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleCreateCourse = async () => {
    if (!formData.title.trim()) { setFormError("Course title is required."); return; }
    if (!formData.price)        { setFormError("Price is required.");        return; }
    try {
      setSubmitting(true);
      setFormError(null);
      const payload = {
        ...formData,
        price:      Number(formData.price),
        oldPrice:   Number(formData.oldPrice)   || 0,
        totalHours: Number(formData.totalHours) || 0,
      };
      const response = await API.post("/courses", payload);
      setCourses((prev) => [response.data, ...prev]);
      setShowModal(false);
      setFormData(emptyForm);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async () => {
    if (!formData.title.trim()) { setFormError("Course title is required."); return; }
    if (!formData.price)        { setFormError("Price is required.");        return; }
    try {
      setSubmitting(true);
      setFormError(null);
      const payload = {
        ...formData,
        price:      Number(formData.price),
        oldPrice:   Number(formData.oldPrice)   || 0,
        totalHours: Number(formData.totalHours) || 0,
      };
      const response = await API.put(`/courses/${editingId}`, payload);
      setCourses((prev) => prev.map((c) => (c._id === editingId ? response.data : c)));
      setShowModal(false);
      setFormData(emptyForm);
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  const handleSubmit = () => modalMode === "edit" ? handleUpdateCourse() : handleCreateCourse();

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-blue-500" size={36} />
      <p className="text-slate-400 text-sm font-medium">Syncing with database…</p>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={20} className="text-blue-500" /> Live Curriculum
          </h2>
          <p className="text-slate-400 text-xs mt-1">{courses.length} courses in your collection</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Filter by title…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 w-52 transition-all"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap">
            <Plus size={15} /> New Course
          </button>
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
                {["Course", "Category / Level", "Price", "Actions"].map((h, i) => (
                  <th key={h}
                    className={`px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap
                      ${i === 3 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center text-slate-300 dark:text-slate-700">
                      <BookOpen size={40} className="mb-3" />
                      <p className="font-semibold text-sm text-slate-400">
                        {searchTerm ? "No courses match your search." : "No courses yet. Create your first one!"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.map((course, idx) => (
                <tr key={course._id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors
                    ${idx < filteredCourses.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>

                  {/* Course */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {course.image ? (
                        <img src={course.image} alt={course.title}
                          className="w-12 h-9 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800" />
                      ) : (
                        <div className="w-12 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <BookOpen size={14} className="text-indigo-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                          {course.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight max-w-[220px] truncate">
                          {course.description || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category / Level */}
                  <td className="px-5 py-3.5">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 whitespace-nowrap">
                      {course.category || "General"}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{course.level || "Beginner"}</p>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">₹{course.price || 0}</p>
                    {course.oldPrice > 0 && (
                      <p className="text-[11px] text-slate-400 line-through mt-0.5">₹{course.oldPrice}</p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end items-center gap-1.5">
                      <button onClick={() => openEditModal(course)} title="Edit"
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(course._id)} title="Delete"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Showing{" "}
            <strong className="text-slate-600 dark:text-slate-300 font-semibold">{filteredCourses.length}</strong>
            {" "}of{" "}
            <strong className="text-slate-600 dark:text-slate-300 font-semibold">{courses.length}</strong>
            {" "}courses
          </span>
          <span className="text-[11px] text-slate-400">
            {courses.filter(c => c.price === 0).length} free courses
          </span>
        </div>
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">

            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {modalMode === "edit" ? "Edit Course" : "Create New Course"}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {modalMode === "edit" ? "Update course details below" : "Fill in the details to publish"}
                  </p>
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

              {/* Title */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input name="title" type="text" placeholder="e.g. Complete Java Bootcamp"
                  value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea name="description" placeholder="What will students learn in this course?"
                  value={formData.description} onChange={handleChange} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Discounted Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input name="price" type="number" placeholder="499"
                    value={formData.price} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Original Price (₹)</label>
                  <input name="oldPrice" type="number" placeholder="3999"
                    value={formData.oldPrice} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Level</label>
                  <select name="level" value={formData.level} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Hours & Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Hours</label>
                  <input name="totalHours" type="number" placeholder="28"
                    value={formData.totalHours} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Language</label>
                  <input name="language" type="text" placeholder="English"
                    value={formData.language} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Thumbnail Image URL</label>
                <input name="image" type="text" placeholder="https://images.unsplash.com/…"
                  value={formData.image} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                {formData.image && (
                  <img src={formData.image} alt="preview"
                    className="mt-2 w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-[2] py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95">
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin" /> {modalMode === "edit" ? "Saving…" : "Creating…"}</>
                  ) : modalMode === "edit" ? (
                    <><Edit3 size={14} /> Save Changes</>
                  ) : (
                    <><Plus size={14} /> Create Course</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}