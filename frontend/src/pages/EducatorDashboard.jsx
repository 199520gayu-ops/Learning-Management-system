import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, BookOpen, FileText, Plus,
  Moon, Sun, LayoutDashboard, LogOut, ChevronRight,
  PlusCircle, X, Trash2, CheckCircle, AlertCircle,
  Bell, BarChart3, GraduationCap,
  Loader2, Save, TrendingUp, TrendingDown, Clock,
  Award, Target, UserCheck, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import MyCourses from './../components/MyCourses';
import ReviewAssignments from './ReviewAssignments';
import Students from '../components/Students';

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all
      ${toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
      {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {toast.msg}
    </div>
  );
}

// ─── NAV ITEM ─────────────────────────────────────────────────────────────────
function NavItem({ icon, label, active, onClick, badge, collapsed }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
        ${active
          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50 shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}
        ${collapsed ? 'justify-center' : ''}`}>
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="text-sm flex-1 text-left">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">{badge}</span>
      )}
      {!collapsed && !badge && active && <ChevronRight size={14} className="ml-auto" />}
      {collapsed && badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold">{badge}</span>
      )}
    </button>
  );
}

// ─── RICH STAT CARD ───────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, trend, trendLabel, icon, iconBg, details, loading }) {
  const isPositive = trend === 'up';
  const isNeutral  = trend === 'neutral';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
        {trendLabel && (
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg
            ${isPositive  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' :
              isNeutral   ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                            'bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400'}`}>
            {isPositive ? <TrendingUp size={10} /> : isNeutral ? null : <TrendingDown size={10} />}
            {trendLabel}
          </span>
        )}
      </div>

      {/* Main value */}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse mt-1" />
        ) : (
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 leading-none">{value}</h4>
        )}
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>

      {/* Detail rows */}
      {details && details.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
          {details.map(({ label, val, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400">{label}</span>
              {loading ? (
                <div className="h-4 w-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                <span className={`text-[11px] font-bold ${color || 'text-slate-700 dark:text-slate-300'}`}>{val}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TABLE ROW ────────────────────────────────────────────────────────────────
function TableRow({ name, course, status, color }) {
  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            {name.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{name}</span>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-sm text-slate-500">{course}</td>
      <td className={`py-3.5 text-xs font-bold ${color}`}>{status}</td>
    </tr>
  );
}

// ─── CREATE COURSE MODAL ──────────────────────────────────────────────────────
function CreateCourseModal({ onClose, showToast }) {
  const [courseForm, setCourseForm] = useState({ title: '', description: '', sessions: [{ title: '' }] });
  const [saving, setSaving] = useState(false);

  const addSession    = () => setCourseForm(f => ({ ...f, sessions: [...f.sessions, { title: '' }] }));
  const updateSession = (i, val) => { const s = [...courseForm.sessions]; s[i].title = val; setCourseForm(f => ({ ...f, sessions: s })); };
  const removeSession = (i) => setCourseForm(f => ({ ...f, sessions: f.sessions.filter((_, idx) => idx !== i) }));

  const handlePublish = async () => {
    if (!courseForm.title.trim()) { showToast('Course title is required.', 'error'); return; }
    setSaving(true);
    try {
      await API.post('/courses', courseForm);
      showToast('Course published successfully!');
      onClose();
    } catch (err) {
      showToast(`Failed to publish: ${err?.response?.data?.message || err.message}`, 'error');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Course</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Course Title</label>
            <input placeholder="e.g. React Fundamentals"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea placeholder="Describe what students will learn…"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-slate-900 dark:text-white"
              value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Course Modules</label>
            {courseForm.sessions.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder={`Module ${i + 1} Title`}
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  value={s.title} onChange={e => updateSession(i, e.target.value)} />
                <button onClick={() => removeSession(i)} className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button onClick={addSession}
              className="w-full py-2.5 mt-1 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-bold hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
              <PlusCircle size={15} /> Add Module
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Discard</button>
          <button onClick={handlePublish} disabled={saving}
            className="flex-[2] py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Publishing…' : 'Publish Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ stats, statsLoading, setActiveTab }) {
  const {
    totalStudents, activeStudents, newThisMonth,
    totalCourses,  publishedCourses, avgCourseHours,
    totalAssignments, pendingAssignments, reviewedAssignments, urgentCount,
    avgProgress, completedStudents, inProgressStudents,
  } = stats;

  const cards = [
    {
      title:     'Total Students',
      value:     totalStudents ?? '—',
      subtitle:  'Across all courses',
      trend:     'up',
      trendLabel: newThisMonth != null ? `+${newThisMonth} this month` : null,
      icon:      <Users size={18} className="text-blue-500" />,
      iconBg:    'bg-blue-50 dark:bg-blue-950/30',
      details: [
        { label: 'Active (last 30d)',  val: activeStudents ?? '—',   color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'New this month',     val: newThisMonth   ?? '—',   color: 'text-blue-600 dark:text-blue-400' },
        { label: 'Inactive',           val: totalStudents != null && activeStudents != null ? totalStudents - activeStudents : '—', color: 'text-slate-500' },
      ],
    },
    {
      title:     'Active Courses',
      value:     totalCourses ?? '—',
      subtitle:  'In your curriculum',
      trend:     'neutral',
      trendLabel: 'Live',
      icon:      <BookOpen size={18} className="text-indigo-500" />,
      iconBg:    'bg-indigo-50 dark:bg-indigo-950/30',
      details: [
        { label: 'Published',      val: publishedCourses ?? totalCourses ?? '—', color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Avg hours/course', val: avgCourseHours != null ? `${avgCourseHours}h` : '—', color: 'text-indigo-600 dark:text-indigo-400' },
        { label: 'Students / course', val: totalStudents != null && totalCourses ? Math.round(totalStudents / totalCourses) : '—', color: 'text-slate-500' },
      ],
    },
    {
      title:     'Pending Tasks',
      value:     pendingAssignments ?? '—',
      subtitle:  'Submissions awaiting review',
      trend:     pendingAssignments > 5 ? 'down' : 'up',
      trendLabel: urgentCount != null ? `${urgentCount} urgent` : null,
      icon:      <Clock size={18} className="text-amber-500" />,
      iconBg:    'bg-amber-50 dark:bg-amber-950/30',
      details: [
        { label: 'Total submissions', val: totalAssignments  ?? '—', color: 'text-slate-600 dark:text-slate-300' },
        { label: 'Reviewed',          val: reviewedAssignments ?? '—', color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Pending',           val: pendingAssignments  ?? '—', color: 'text-amber-600 dark:text-amber-400' },
      ],
    },
    {
      title:     'Avg Completion',
      value:     avgProgress != null ? `${avgProgress}%` : '—',
      subtitle:  'Average student progress',
      trend:     avgProgress >= 70 ? 'up' : avgProgress >= 40 ? 'neutral' : 'down',
      trendLabel: avgProgress >= 70 ? 'On track' : avgProgress >= 40 ? 'Moderate' : 'Needs attention',
      icon:      <Target size={18} className="text-emerald-500" />,
      iconBg:    'bg-emerald-50 dark:bg-emerald-950/30',
      details: [
        { label: 'Completed (100%)', val: completedStudents  ?? '—', color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'In progress',      val: inProgressStudents ?? '—', color: 'text-blue-600 dark:text-blue-400' },
        { label: 'Not started (0%)', val: totalStudents != null && completedStudents != null && inProgressStudents != null
            ? totalStudents - completedStudents - inProgressStudents : '—', color: 'text-slate-400' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Rich stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <StatCard key={card.title} {...card} loading={statsLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Submissions */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Submissions</h3>
            <button onClick={() => setActiveTab('Assignments')} className="text-blue-600 text-xs font-bold hover:underline">View All →</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 font-bold">Student</th>
                <th className="pb-3 font-bold">Course</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <TableRow name="Alex Rivera" course="React Fundamentals" status="Pending Review" color="text-amber-500" />
              <TableRow name="Sarah Chen"  course="Node.js Advanced"   status="Graded"         color="text-emerald-500" />
              <TableRow name="James Park"  course="UI/UX Foundations"  status="Pending Review" color="text-amber-500" />
              <TableRow name="Maria Lopez" course="Python Basics"       status="Graded"         color="text-emerald-500" />
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-blue-500 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-base mb-2">💡 Educator Pro Tip</h3>
            <p className="text-blue-100 text-xs leading-relaxed mb-4">
              Students who receive feedback within 24 hours are 40% more likely to complete the course.
            </p>
            <button onClick={() => setActiveTab('Assignments')}
              className="w-full bg-white text-blue-600 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors">
              Review Submissions →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Progress Breakdown</h4>
            <div className="space-y-3">
              {[
                { label: 'Completed',   value: statsLoading ? 0 : Math.round(((stats.completedStudents  || 0) / (stats.totalStudents || 1)) * 100), color: 'bg-emerald-500' },
                { label: 'In Progress', value: statsLoading ? 0 : Math.round(((stats.inProgressStudents || 0) / (stats.totalStudents || 1)) * 100), color: 'bg-blue-500' },
                { label: 'Avg Score',   value: statsLoading ? 0 : (stats.avgScore || 0), color: 'bg-indigo-500' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-[11px] font-semibold mb-1.5">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-700 dark:text-slate-300">{statsLoading ? '—' : `${value}%`}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function EducatorDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [darkMode,           setDarkMode]           = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  );
  const [activeTab,          setActiveTab]          = useState('Overview');
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(true);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [assignments,        setAssignments]        = useState([]);
  const [assignLoading,      setAssignLoading]      = useState(false);
  const [toast,              setToast]              = useState(null);

  // ── Live stats from backend ────────────────────────────────────────────────
  const [stats,        setStats]        = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ── Fetch all dashboard data ───────────────────────────────────────────────
  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [studentsRes, usersRes, coursesRes, assignRes] = await Promise.allSettled([
        API.get('/students'),       // same endpoint the Students tab uses
        API.get('/auth/users'),     // fallback for progress/date fields
        API.get('/courses'),
        API.get('/assignments'),
      ]);

      // ── Students ──
      // Primary: /students (same data source as the Students tab)
      const rawStudents = studentsRes.status === 'fulfilled'
        ? (Array.isArray(studentsRes.value.data)
            ? studentsRes.value.data
            : (studentsRes.value.data?.students || studentsRes.value.data?.data || []))
        : [];

      // Fallback: /auth/users filtered to non-staff
      const rawUsers = usersRes.status === 'fulfilled'
        ? (Array.isArray(usersRes.value.data)
            ? usersRes.value.data
            : (usersRes.value.data?.users || usersRes.value.data?.data || []))
        : [];
      const STAFF_ROLES = ['educator', 'coordinator', 'admin', 'instructor', 'teacher'];
      const usersFiltered = rawUsers.filter(u =>
        !STAFF_ROLES.includes((u.role || '').toLowerCase())
      );

      // Use whichever gave more records
      const students      = rawStudents.length >= usersFiltered.length ? rawStudents : usersFiltered;
      const totalStudents = students.length;

      const now = new Date();
      const thirtyDaysAgo  = new Date(now - 30 * 24 * 60 * 60 * 1000);
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const activeStudents = students.filter(s => {
        const d = new Date(s.updatedAt || s.createdAt);
        return !isNaN(d) && d >= thirtyDaysAgo;
      }).length;

      const newThisMonth = students.filter(s => {
        const d = new Date(s.createdAt);
        return !isNaN(d) && d >= thisMonthStart;
      }).length;

      const progressList   = students.map(s => Number(s.progress ?? 0));
      const avgProgress    = progressList.length
        ? Math.round(progressList.reduce((a, b) => a + b, 0) / progressList.length)
        : 0;
      const completedStudents  = progressList.filter(p => p === 100).length;
      const inProgressStudents = progressList.filter(p => p > 0 && p < 100).length;

      // ── Courses ──
      const courses = coursesRes.status === 'fulfilled'
        ? (Array.isArray(coursesRes.value.data)
            ? coursesRes.value.data
            : (coursesRes.value.data?.courses || coursesRes.value.data?.data || []))
        : [];
      const publishedCourses = courses.filter(c => !c.draft).length;
      const avgCourseHours   = courses.length
        ? Math.round(courses.reduce((a, c) => a + (Number(c.totalHours) || 0), 0) / courses.length)
        : 0;

      // ── Assignments ──
      const allAssign = assignRes.status === 'fulfilled'
        ? (Array.isArray(assignRes.value.data)
            ? assignRes.value.data
            : (assignRes.value.data?.assignments || assignRes.value.data?.data || []))
        : [];
      const pendingAssignments  = allAssign.filter(a => a.status !== 'reviewed').length;
      const reviewedAssignments = allAssign.filter(a => a.status === 'reviewed').length;
      const scores   = allAssign.filter(a => a.score != null).map(a => Number(a.score));
      const avgScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      // "Urgent" = pending submissions older than 48 h
      const twoDaysAgo  = new Date(now - 48 * 60 * 60 * 1000);
      const urgentCount = allAssign.filter(a =>
        a.status !== 'reviewed' && new Date(a.createdAt || a.submittedAt) < twoDaysAgo
      ).length;

      setAssignments(allAssign);
      setStats({
        totalStudents, activeStudents, newThisMonth,
        totalCourses: courses.length, publishedCourses, avgCourseHours,
        totalAssignments: allAssign.length, pendingAssignments, reviewedAssignments, urgentCount,
        avgProgress, completedStudents, inProgressStudents, avgScore,
      });
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
    } finally {
      setStatsLoading(false);
      setAssignLoading(false);
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    setAssignLoading(true);
    try {
      const { data } = await API.get('/assignments');
      setAssignments(Array.isArray(data) ? data : (data?.assignments || []));
    } catch (err) {
      console.error('Assignment fetch error:', err);
    } finally {
      setAssignLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchDashboardStats();
  }, [user, fetchDashboardStats]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p className="text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const pendingCount = stats.pendingAssignments ?? assignments.filter(a => a.status !== 'reviewed').length;

  const navItems = [
    { tab: 'Overview',    icon: <LayoutDashboard size={20} />, label: 'Dashboard', badge: null },
    { tab: 'Courses',     icon: <BookOpen        size={20} />, label: 'Courses',   badge: null },
    { tab: 'Students',    icon: <Users           size={20} />, label: 'Students',  badge: null },
    { tab: 'Assignments', icon: <FileText        size={20} />, label: 'Grading',   badge: pendingCount > 0 ? pendingCount : null },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Toast toast={toast} />

      {isCreateCourseOpen && (
        <CreateCourseModal onClose={() => setIsCreateCourseOpen(false)} showToast={showToast} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-[72px]'}`}>

        {/* Logo / Toggle */}
        <div className={`p-4 flex items-center border-b border-slate-100 dark:border-slate-800 ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 p-2 rounded-xl text-white shrink-0 transition-all duration-200 cursor-pointer">
            <GraduationCap size={22} />
          </button>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <span className="font-bold text-lg tracking-tight leading-none block text-slate-900 dark:text-white">Learnify</span>
              <span className="text-blue-500 text-[10px] font-bold tracking-widest uppercase mt-0.5 block">Educator</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ tab, icon, label, badge }) => (
            <NavItem key={tab} active={activeTab === tab} icon={icon} label={label} badge={badge}
              collapsed={!isSidebarOpen} onClick={() => setActiveTab(tab)} />
          ))}
        </nav>

        {/* User + controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button onClick={() => setDarkMode(!darkMode)}
            title={!isSidebarOpen ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors text-slate-500 dark:text-slate-400
              ${!isSidebarOpen ? 'justify-center' : ''}`}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isSidebarOpen && (darkMode ? 'Light Theme' : 'Dark Theme')}
          </button>

          {isSidebarOpen ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'Educator'}</p>
              </div>
              <button onClick={logout} title="Logout" className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button onClick={logout} title="Logout"
              className="flex justify-center w-full px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'}`}>

        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
              {activeTab === 'Overview'    && `Welcome ${user?.name?.split(' ')[0]}`}
              {activeTab === 'Courses'     && 'Course Catalog'}
              {activeTab === 'Students'    && 'Student Management'}
              {activeTab === 'Assignments' && 'Grading & Evaluations'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'Overview'    && 'Here is the latest activity across your courses.'}
              {activeTab === 'Courses'     && 'Manage and publish your learning content.'}
              {activeTab === 'Students'    && 'View enrolment and student progress.'}
              {activeTab === 'Assignments' && `${pendingCount} submission${pendingCount !== 1 ? 's' : ''} waiting for review.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer" onClick={() => setActiveTab('Assignments')}>
              <Bell size={20} className="text-slate-400" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-bold text-indigo-600 text-sm">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'Overview' && (
            <OverviewTab stats={stats} statsLoading={statsLoading} setActiveTab={setActiveTab} />
          )}
          {activeTab === 'Courses' && <MyCourses showToast={showToast} />}
          {activeTab === 'Students' && <Students showToast={showToast} />}
          {activeTab === 'Assignments' && (
            assignLoading ? (
              <div className="flex items-center justify-center py-24 gap-3">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <span className="text-slate-400">Loading assignments…</span>
              </div>
            ) : (
              <ReviewAssignments assignments={assignments} showToast={showToast} onRefresh={fetchAssignments} />
            )
          )}
          {activeTab === 'Reports' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center py-24">
              <BarChart3 className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 font-semibold">Reports coming soon.</p>
              <p className="text-slate-400 text-sm mt-1">Connect your analytics endpoint to populate this view.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}