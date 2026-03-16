import React, { useState, useEffect } from 'react';
import {
  User, Award, FileText, Settings, BookOpen, Bell,
  Download, Share2, Moon, Sun, LogOut,
  ChevronLeft, ChevronRight, X, Info, AlertCircle, CheckCircle2,
  Eye, Trash2, Save, Lock, Mail, UserCircle, Clock, TrendingUp,
  MessageSquare, Send, Inbox, Search, Phone, MapPin,
  Flame, Trophy, Zap, Star, Target, Calendar, Medal,
  BarChart2, Brain, Code2, Database, Globe, PenTool, GitBranch,
  Users, Timer, Shield, BadgeCheck, Sparkles, Edit3,
  GraduationCap, Activity, Layers, Flag, AlarmClock,
  BookMarked, ThumbsUp, Rocket, LockKeyhole, ChevronRight as ChevRight,
  ClipboardList, MessageCircle, LayoutDashboard, PlayCircle,
  CheckCircle, TrendingDown, ArrowUpRight, MoreHorizontal, Filter,
  Briefcase, Hash, Link2, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import MyCertificates from './../pages/MyCertificates';
import Lessons from '../pages/Lessons';
import ProfessionalInbox from '../pages/Inbox';
import StudyPlanPage from './StudyPlanPage';
import DiscussionForum from '../pages/DiscussionForum';
import LessonDashboard from '../pages/LessonDashboard';

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
let _toastId = 0;
const _toastListeners = [];
export const toast = (message, type = "info", duration = 3500) => {
  const id = ++_toastId;
  _toastListeners.forEach(fn => fn({ id, message, type, duration }));
};
const TOAST_STYLES = {
  success: "border-l-4 border-l-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white",
  error:   "border-l-4 border-l-red-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white",
  info:    "border-l-4 border-l-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white",
};
const TOAST_ICON = {
  success: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
  error:   <AlertCircle  size={16} className="text-red-500 shrink-0" />,
  info:    <Info         size={16} className="text-blue-500 shrink-0" />,
};
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = (t) => {
      setToasts(p => [...p, { ...t, visible: true }]);
      setTimeout(() => {
        setToasts(p => p.map(x => x.id === t.id ? { ...x, visible: false } : x));
        setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 350);
      }, t.duration);
    };
    _toastListeners.push(handler);
    return () => { const i = _toastListeners.indexOf(handler); if (i > -1) _toastListeners.splice(i, 1); };
  }, []);
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none w-72">
      {toasts.map(t => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700
            ${TOAST_STYLES[t.type]}
            ${t.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          style={{ transition: 'all 0.3s ease' }}>
          {TOAST_ICON[t.type]}
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"><X size={13} /></button>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   SIDEBAR NAV ITEM
   ============================================================ */
const NavItem = ({ icon, label, active, onClick, collapsed, badge }) => (
  <button onClick={onClick} title={collapsed ? label : undefined}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left relative group
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
               : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'}
      ${collapsed ? 'justify-center' : ''}`}>
    <span className={`shrink-0 transition-transform duration-200 ${!active ? 'group-hover:scale-110' : ''}`}>{icon}</span>
    {!collapsed && <span className="text-sm font-semibold truncate flex-1">{label}</span>}
    {badge > 0 && !collapsed && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">{badge}</span>}
    {badge > 0 && collapsed && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
  </button>
);

/* ============================================================
   SHARED COMPONENTS
   ============================================================ */
const ProgressBar = ({ value, gradient = "from-blue-500 to-indigo-500", height = "h-2" }) => (
  <div className={`w-full ${height} bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden`}>
    <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

const StatPill = ({ icon, label, value, color, bg }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${bg}`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-white/60 dark:bg-black/20 shrink-0`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      <p className="text-base font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

/* ============================================================
   PANEL: STUDENT PROFILE — REDESIGNED MODERN UI
   ============================================================ */
const ProfilePanel = ({ user }) => {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview",  icon: <LayoutDashboard size={13} /> },
    { id: "activity", label: "Activity",  icon: <Activity        size={13} /> },
    { id: "skills",   label: "Skills",    icon: <Layers          size={13} /> },
    { id: "goals",    label: "Goals",     icon: <Target          size={13} /> },
  ];

  return (
    <div className="max-w-5xl space-y-5">

      {/* ── HERO CARD ── */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
        {/* Mesh background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/8 dark:bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/8 dark:bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative p-7">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-blue-600  flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{user?.name || "Learner"}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-blue-500" />
                    Computer Science · Batch 2023
                  </p>
                </div>
                {/* Status badges */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Active", color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20" },
                    { label: "Dean's List", color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20" },
                    { label: "🔥 7-Day Streak", color: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-500/20" },
                  ].map(({ label, color }) => (
                    <span key={label} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${color}`}>{label}</span>
                  ))}
                </div>
              </div>

              {/* Contact row */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 dark:text-slate-500 mb-5">
                {[
                  { icon: <Mail size={11} />, val: user?.email || "nandhu@gmail.com" },
                  { icon: <Phone size={11} />, val: "+91 98765 43210" },
                  { icon: <MapPin size={11} />, val: "Chennai, Tamil Nadu" },
                ].map(({ icon, val }) => (
                  <span key={val} className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default">
                    {icon}{val}
                  </span>
                ))}
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Enrolled Since", val: "Jan 2023",   icon: <Clock size={14} className="text-blue-500" />,    bg: "bg-slate-50 dark:bg-slate-800/80" },
                  { label: "Student ID",     val: "LRN-00421", icon: <Hash  size={14} className="text-violet-500" />,   bg: "bg-slate-50 dark:bg-slate-800/80" },
                  { label: "Program",        val: "Comp. Sci.", icon: <Briefcase size={14} className="text-indigo-500" />, bg: "bg-slate-50 dark:bg-slate-800/80" },
                  { label: "Credits",        val: "120 / 160", icon: <TrendingUp size={14} className="text-emerald-500" />, bg: "bg-slate-50 dark:bg-slate-800/80" },
                ].map(({ label, val, icon, bg }) => (
                  <div key={label} className={`${bg} border border-slate-100 dark:border-slate-700/60 rounded-xl px-3.5 py-3`}>
                    <div className="flex items-center gap-1.5 mb-1">{icon}<p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{label}</p></div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-0.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl w-fit border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${tab === t.id
                ? 'bg-white dark:bg-slate-700/90 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-600/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Academic Standing */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <BarChart2 size={14} className="text-blue-500" />
                </div>
                Academic Standing
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">Excellent</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Current GPA",    val: "3.85 / 4.0", pct: 96, grad: "from-emerald-500 to-teal-400",  dot: "bg-emerald-500" },
                { label: "Credits Earned", val: "120 / 160",  pct: 75, grad: "from-blue-500 to-cyan-400",     dot: "bg-blue-500" },
                { label: "Courses Done",   val: "24 / 32",    pct: 75, grad: "from-violet-500 to-purple-400", dot: "bg-violet-500" },
                { label: "Assignments",    val: "98 / 102",   pct: 96, grad: "from-amber-500 to-orange-400",  dot: "bg-amber-500" },
              ].map(({ label, val, pct, grad, dot }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{val}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Trophy size={14} className="text-amber-500" />
                </div>
                Achievements
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">4 / 6 earned</span>
            </div>
            <div className="space-y-1">
              {[
                { icon: <Trophy      size={14} className="text-amber-500" />,  title: "Dean's List",     desc: "Top 5% · Spring 2024",          earned: true,  bg: "bg-amber-50 dark:bg-amber-500/10" },
                { icon: <Flame       size={14} className="text-orange-500" />, title: "7-Day Streak",    desc: "7 consecutive login days",      earned: true,  bg: "bg-orange-50 dark:bg-orange-500/10" },
                { icon: <Zap         size={14} className="text-yellow-500" />, title: "Fast Learner",    desc: "3 courses in one month",        earned: true,  bg: "bg-yellow-50 dark:bg-yellow-500/10" },
                { icon: <Star        size={14} className="text-violet-500" />, title: "Perfect Score",   desc: "100% on Algorithms quiz",       earned: true,  bg: "bg-violet-50 dark:bg-violet-500/10" },
                { icon: <Rocket      size={14} className="text-blue-400" />,   title: "Course Champion", desc: "Finish all advanced courses",   earned: false, bg: "bg-slate-100 dark:bg-slate-800" },
                { icon: <LockKeyhole size={14} className="text-slate-400" />,  title: "Night Owl",       desc: "Study after midnight 5 times",  earned: false, bg: "bg-slate-100 dark:bg-slate-800" },
              ].map(({ icon, title, desc, earned, bg }) => (
                <div key={title}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${earned ? 'hover:bg-slate-50 dark:hover:bg-slate-800' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">{title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{desc}</p>
                  </div>
                  {earned
                    ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    : <div className="w-4 h-4 rounded border border-slate-200 dark:border-slate-700 shrink-0" />
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITY ── */}
      {tab === "activity" && (
        <div className="space-y-4">
          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Flame  size={18} />, label: "Day Streak",     val: "7",   bg: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-500" },
              { icon: <Zap    size={18} />, label: "XP This Week",   val: "840", bg: "bg-amber-500",  light: "bg-amber-50 dark:bg-amber-500/10",  text: "text-amber-500" },
              { icon: <Star   size={18} />, label: "Quiz Avg",       val: "91%", bg: "bg-violet-500", light: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-500" },
              { icon: <Trophy size={18} />, label: "Class Rank",     val: "#12", bg: "bg-blue-500",   light: "bg-blue-50 dark:bg-blue-500/10",   text: "text-blue-500" },
            ].map(({ icon, label, val, light, text }) => (
              <div key={label} className={`${light} border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4`}>
                <div className={`${text} mb-2`}>{icon}</div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{val}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Calendar size={13} className="text-blue-500" />
              </div>
              Recent Activity
            </h3>
            <div className="space-y-1">
              {[
                { dot: "bg-emerald-500", icon: <CheckCircle2 size={13} className="text-emerald-600" />, title: "Completed Assignment #5",        sub: "CS301 — Algorithms",           time: "Today, 10:30 AM",   bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                { dot: "bg-blue-500",    icon: <BookOpen     size={13} className="text-blue-600" />,    title: "Watched: Binary Trees Lesson",   sub: "CS301 — 45 min session",       time: "Today, 9:00 AM",    bg: "bg-blue-50 dark:bg-blue-500/10" },
                { dot: "bg-amber-500",   icon: <Medal        size={13} className="text-amber-600" />,   title: "Earned 'Perfect Score' Badge",   sub: "Algorithms Quiz — 100%",       time: "Yesterday, 4:15 PM", bg: "bg-amber-50 dark:bg-amber-500/10" },
                { dot: "bg-violet-500",  icon: <Award        size={13} className="text-violet-600" />,  title: "Certificate Issued",             sub: "Advanced Python Core",         time: "Jan 15, 2024",       bg: "bg-violet-50 dark:bg-violet-500/10" },
                { dot: "bg-indigo-500",  icon: <ClipboardList size={13} className="text-indigo-600" />, title: "Enrolled in New Course",         sub: "System Design Principles",     time: "Jan 10, 2024",       bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                { dot: "bg-pink-500",    icon: <MessageCircle size={13} className="text-pink-600" />,   title: "Joined Study Group",             sub: "Data Structures — 12 members", time: "Jan 8, 2024",        bg: "bg-pink-50 dark:bg-pink-500/10" },
              ].map(({ dot, icon, title, sub, time, bg }) => (
                <div key={title} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{sub}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700/80 px-2 py-1 rounded-lg font-medium whitespace-nowrap shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {tab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Technical Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Code2 size={13} className="text-blue-500" />
              </div>
              Technical Skills
            </h3>
            <div className="space-y-4">
              {[
                { icon: <Brain     size={12} className="text-blue-500" />,   skill: "Data Structures", level: 92, grad: "from-blue-500 to-cyan-400",    tag: "Expert" },
                { icon: <Code2     size={12} className="text-emerald-500" />, skill: "Python",          level: 88, grad: "from-emerald-500 to-teal-400",  tag: "Advanced" },
                { icon: <Globe     size={12} className="text-indigo-500" />,  skill: "React.js",        level: 75, grad: "from-indigo-500 to-violet-400", tag: "Proficient" },
                { icon: <Database  size={12} className="text-orange-500" />,  skill: "SQL / Database",  level: 70, grad: "from-orange-500 to-amber-400",  tag: "Proficient" },
                { icon: <GitBranch size={12} className="text-purple-500" />,  skill: "Node.js",         level: 60, grad: "from-purple-500 to-pink-400",   tag: "Intermediate" },
                { icon: <PenTool   size={12} className="text-pink-500" />,    skill: "UI/UX Design",    level: 65, grad: "from-pink-500 to-rose-400",     tag: "Intermediate" },
              ].map(({ icon, skill, level, grad, tag }) => (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">{icon}{skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">{tag}</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums w-8 text-right">{level}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-700`} style={{ width: `${level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Soft Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                  <Users size={13} className="text-violet-500" />
                </div>
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Brain size={11} />,         label: "Problem Solving" },
                  { icon: <Users size={11} />,         label: "Collaboration" },
                  { icon: <MessageCircle size={11} />, label: "Communication" },
                  { icon: <Timer size={11} />,         label: "Time Management" },
                  { icon: <Shield size={11} />,        label: "Critical Thinking" },
                  { icon: <Star size={11} />,          label: "Leadership" },
                ].map(({ icon, label }) => (
                  <span key={label}
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-medium hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-default">
                    {icon}{label}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Award size={13} className="text-amber-500" />
                </div>
                Certifications
              </h3>
              <div className="space-y-2.5">
                {[
                  { icon: <BarChart2 size={13} />, name: "Data Science Mastery",    date: "Oct 2023", grad: "from-blue-500 to-cyan-500",     bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-500" },
                  { icon: <PenTool   size={13} />, name: "UI/UX Design Essentials", date: "Dec 2023", grad: "from-amber-500 to-orange-500",   bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-500" },
                  { icon: <Code2     size={13} />, name: "Advanced Python Core",    date: "Jan 2024", grad: "from-emerald-500 to-teal-500",   bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-500" },
                ].map(({ icon, name, date, bg, text }) => (
                  <div key={name} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all group">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${text} shrink-0`}>{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{name}</p>
                      <p className="text-[10px] text-slate-400">Learnify · {date}</p>
                    </div>
                    <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GOALS ── */}
      {tab === "goals" && (
        <div className="space-y-4">
          {/* Semester banner */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 text-white overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-12 left-20 w-36 h-36 bg-white/5 rounded-full" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Flag size={12} className="text-blue-200" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Semester Goal</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Maintain GPA above 3.8</h3>
                <p className="text-blue-200 text-xs mb-4 flex items-center gap-1.5">
                  <AlarmClock size={11} />Spring 2024 · Ends May 30
                </p>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-white rounded-full" style={{ width: '96%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-blue-200 font-medium">
                  <span>Current: 3.85</span>
                  <span>96% complete ✓</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                <span className="text-2xl font-black">A</span>
              </div>
            </div>
          </div>

          {/* Goal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <BookMarked size={16} />, bg: "bg-blue-50 dark:bg-blue-500/10",   border: "border-blue-100 dark:border-blue-500/20", text: "text-blue-500",   title: "Complete 4 Courses",       pct: 75,  done: 3, tot: 4,  grad: "from-blue-500 to-cyan-400",    dl: "May 2024",   dlIcon: <AlarmClock size={10} /> },
              { icon: <Award      size={16} />, bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", text: "text-emerald-500", title: "Earn 3 Certificates",      pct: 100, done: 3, tot: 3,  grad: "from-emerald-500 to-teal-400", dl: "Completed",  dlIcon: <BadgeCheck size={10} /> },
              { icon: <Flame      size={16} />, bg: "bg-orange-50 dark:bg-orange-500/10", border: "border-orange-100 dark:border-orange-500/20", text: "text-orange-500", title: "30-Day Learning Streak",   pct: 23,  done: 7, tot: 30, grad: "from-orange-500 to-amber-400",  dl: "Ongoing",    dlIcon: <Timer size={10} /> },
              { icon: <ThumbsUp   size={16} />, bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-100 dark:border-violet-500/20", text: "text-violet-500",  title: "Score 90%+ on Quizzes",    pct: 80,  done: 8, tot: 10, grad: "from-violet-500 to-purple-400", dl: "Jun 2024",   dlIcon: <AlarmClock size={10} /> },
            ].map(({ icon, bg, border, text, title, pct, done, tot, grad, dl, dlIcon }) => (
              <div key={title}
                className={`bg-white dark:bg-slate-900 rounded-2xl border ${border} dark:border-slate-800 p-4 hover:shadow-md transition-all duration-200`}>
                <div className="flex items-start gap-3 mb-3.5">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center ${text} shrink-0`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{title}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">{dlIcon}{dl}</p>
                  </div>
                  <span className={`text-sm font-black ${pct === 100 ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'}`}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{done} of {tot} completed</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   PANEL: MY CERTIFICATES
   ============================================================ */
const CERTS = [
  {title:"Data Science Mastery",    date:"Oct 12, 2023",id:"DS-9921",type:"PROFESSIONAL",grad:"from-blue-600 to-cyan-500"},
  {title:"UI/UX Design Essentials", date:"Dec 04, 2023",id:"UX-4410",type:"FUNDAMENTALS", grad:"from-amber-500 to-orange-500"},
  {title:"Advanced Python Core",    date:"Jan 15, 2024",id:"PY-1102",type:"ADVANCED",     grad:"from-emerald-500 to-green-500"},
];
const CertificatesPanel = ({ onDownload }) => {
  const [preview, setPreview] = useState(null);
  const pc = CERTS.find(c=>c.id===preview);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Award size={22} className="text-blue-500"/>My Certificates</h2>
        <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold px-3 py-1.5 rounded-full">{CERTS.length} Earned</span>
      </div>
      {pc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className={`h-48 bg-gradient-to-br ${pc.grad} flex flex-col items-center justify-center relative`}>
              <Award size={56} className="text-white/80 mb-2"/>
              <span className="text-white/90 text-xs font-bold uppercase tracking-widest">{pc.type}</span>
              <button onClick={()=>setPreview(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition"><X size={15}/></button>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Certificate of Completion</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pc.title}</h3>
              <p className="text-sm text-slate-500 mb-1">Earned on {pc.date}</p>
              <p className="text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 inline-block px-3 py-1 rounded-full mb-5">ID: {pc.id}</p>
              <div className="flex gap-3">
                <button onClick={()=>onDownload(`${pc.id}.pdf`)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-blue-500/20"><Download size={15}/>Download</button>
                <button onClick={()=>setPreview(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {CERTS.map(cert=>(
          <div key={cert.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className={`h-32 bg-gradient-to-br ${cert.grad} flex items-center justify-center relative`}>
              <Award size={44} className="text-white/80 group-hover:scale-110 transition-transform duration-300"/>
              <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">{cert.type}</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate text-base">{cert.title}</h3>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-1"><Calendar size={11}/>Earned {cert.date} · ID: {cert.id}</p>
              <div className="flex gap-2">
                <button onClick={()=>{setPreview(cert.id);toast(`Previewing: ${cert.title}`,"info");}} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  <Eye size={13}/>PREVIEW
                </button>
                <button onClick={()=>onDownload(`${cert.id}.pdf`)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-500/20">
                  <Download size={13}/>DOWNLOAD
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   PANEL: ACADEMIC RECORDS
   ============================================================ */
const COURSES = [
  {name:"CS301: Algorithms & Data Structures",sub:"Computer Science Major",prof:"Dr. Sarah Miller",   date:"Jan 12, 2024",credits:"4.0",grade:"A+",gColor:"text-emerald-600 dark:text-emerald-400",gBg:"bg-emerald-50 dark:bg-emerald-900/20"},
  {name:"MATH202: Discrete Mathematics",      sub:"Core Requirement",      prof:"Prof. James Wilson",date:"Dec 20, 2023",credits:"3.0",grade:"A", gColor:"text-emerald-600 dark:text-emerald-400",gBg:"bg-emerald-50 dark:bg-emerald-900/20"},
  {name:"ENG101: Technical Writing",          sub:"Elective",              prof:"Jane Doe",          date:"Nov 15, 2023",credits:"2.0",grade:"B+",gColor:"text-amber-600 dark:text-amber-400",  gBg:"bg-amber-50 dark:bg-amber-900/20"},
  {name:"CS201: Database Systems",            sub:"Computer Science Major",prof:"Dr. Alan Park",     date:"Oct 10, 2023",credits:"3.0",grade:"A", gColor:"text-emerald-600 dark:text-emerald-400",gBg:"bg-emerald-50 dark:bg-emerald-900/20"},
  {name:"PHYS101: Physics Fundamentals",      sub:"Core Requirement",      prof:"Prof. Lisa Chang",  date:"Sep 05, 2023",credits:"3.0",grade:"B", gColor:"text-amber-600 dark:text-amber-400",  gBg:"bg-amber-50 dark:bg-amber-900/20"},
];
const AcademicRecordsPanel = () => {
  const [search,setSearch] = useState("");
  const filtered = COURSES.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.prof.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><FileText size={22} className="text-blue-500"/>Academic Records</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {label:"Total Credits",val:"15.0",icon:<TrendingUp size={18}/>,grad:"from-blue-500 to-cyan-500",   bg:"bg-blue-50 dark:bg-blue-900/20",  text:"text-blue-600 dark:text-blue-400"},
          {label:"Current GPA",  val:"3.85",icon:<Star       size={18}/>,grad:"from-emerald-500 to-green-500",bg:"bg-emerald-50 dark:bg-emerald-900/20",text:"text-emerald-600 dark:text-emerald-400"},
          {label:"Courses",      val:COURSES.length, icon:<BookOpen size={18}/>,grad:"from-violet-500 to-purple-500",bg:"bg-violet-50 dark:bg-violet-900/20",text:"text-violet-600 dark:text-violet-400"},
        ].map(({label,val,icon,grad,bg,text})=>(
          <div key={label} className={`${bg} rounded-3xl p-5`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center text-white mb-3 shadow-sm`}>{icon}</div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{val}</p>
            <p className={`text-xs font-semibold mt-0.5 ${text}`}>{label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 max-w-sm shadow-sm">
        <Search size={15} className="text-slate-400 shrink-0"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses or instructors..."
          className="bg-transparent text-sm text-slate-700 dark:text-white outline-none flex-1 placeholder:text-slate-400"/>
        {search && <button onClick={()=>setSearch("")} className="text-slate-400 hover:text-slate-600 transition"><X size={13}/></button>}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Instructor</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Credits</th>
                <th className="px-6 py-4 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.length===0
                ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No results found.</td></tr>
                : filtered.map((c,i)=>(
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.prof}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{c.date}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.credits}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-xl ${c.gBg} text-xs font-bold ${c.gColor}`}>{c.grade}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PANEL: ACCOUNT SETTINGS
   ============================================================ */
const AccountSettingsPanel = ({ user }) => {
  const [form,setForm] = useState({name:user?.name||"",email:user?.email||"",currentPassword:"",newPassword:""});
  const handleSave = () => {
    if (!form.name.trim())  {toast("Name cannot be empty.","error");return;}
    if (!form.email.trim()) {toast("Email cannot be empty.","error");return;}
    toast("Settings saved successfully!","success");
  };
  return (
    <div className="max-w-2xl space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Settings size={22} className="text-blue-500"/>Account Settings</h2>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Profile Picture</h3>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
            {form.name ? form.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 mb-2">
              <Edit3 size={13}/>Change Photo
            </button>
            <p className="text-xs text-slate-400">JPG, PNG or GIF · Max 2MB</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Info</h3>
        {[
          {key:"name",  label:"Full Name",     icon:<UserCircle size={15} className="text-blue-500"/>,  type:"text",  placeholder:"Your full name"},
          {key:"email", label:"Email Address", icon:<Mail       size={15} className="text-green-500"/>, type:"email", placeholder:"your@email.com"},
        ].map(({key,label,icon,type,placeholder})=>(
          <div key={key}>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{icon}{label}</label>
            <input type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} placeholder={placeholder}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Lock size={12}/>Security</h3>
        {[
          {key:"currentPassword",label:"Current Password",ph:"Enter current password"},
          {key:"newPassword",    label:"New Password",    ph:"Enter new password"},
        ].map(({key,label,ph})=>(
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
            <input type="password" value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
          </div>
        ))}
      </div>
      <button onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20">
        <Save size={16}/>Save Changes
      </button>
    </div>
  );
};

/* ============================================================
   PANEL: LESSONS
   ============================================================ */
const LESSONS = [
  {title:"Intro to React",           progress:80, grad:"from-blue-500 to-cyan-400",    cat:"Frontend",duration:"4h 30m"},
  {title:"Node.js Fundamentals",     progress:55, grad:"from-indigo-500 to-violet-400",cat:"Backend", duration:"6h 00m"},
  {title:"Database Design",          progress:30, grad:"from-violet-500 to-pink-400",  cat:"Database",duration:"3h 15m"},
  {title:"System Design Principles", progress:10, grad:"from-rose-500 to-orange-400",  cat:"Advanced",duration:"8h 45m"},
  {title:"TypeScript Basics",        progress:65, grad:"from-sky-500 to-blue-400",     cat:"Frontend",duration:"2h 50m"},
  {title:"REST API Design",          progress:45, grad:"from-teal-500 to-emerald-400", cat:"Backend", duration:"3h 30m"},
];
const LessonsPanel = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><BookOpen size={22} className="text-blue-500"/>Lessons</h2>
      <div className="flex gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <Filter size={12}/>Filter
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {LESSONS.map(({title,progress,grad,cat,duration})=>(
        <div key={title} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 p-5 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md`}>
            <BookOpen size={20} className="text-white"/>
          </div>
          <div className="flex justify-between items-start mb-1">
            <p className="font-bold text-slate-800 dark:text-white text-sm leading-snug flex-1 mr-2">{title}</p>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{progress}%</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] bg-gradient-to-r ${grad} text-white px-2 py-0.5 rounded-full font-bold`}>{cat}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock size={10}/>{duration}</span>
          </div>
          <ProgressBar value={progress} gradient={grad} height="h-2"/>
          <button onClick={()=>toast(`Continuing: "${title}"`,"info")}
            className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5
              ${progress===100 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                               : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-sm shadow-blue-500/20'}`}>
            {progress===100 ? <><CheckCircle2 size={13}/>Completed</> : progress===0 ? <><PlayCircle size={13}/>Start Lesson</> : <><PlayCircle size={13}/>Continue</>}
          </button>
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================
   PANEL: INBOX
   ============================================================ */
const MSGS = [
  {id:1,from:"Dr. Sarah Miller",   subject:"Assignment Feedback",   body:"Great work on your latest submission! Your algorithm analysis was spot on.",    time:"2h ago", read:false,avatar:"S",avatarGrad:"from-blue-500 to-indigo-500"},
  {id:2,from:"Platform",           subject:"Certificate Ready",     body:"Your Data Science Mastery certificate is now available for download.",           time:"5h ago", read:false,avatar:"L",avatarGrad:"from-emerald-500 to-teal-500"},
  {id:3,from:"Prof. James Wilson", subject:"Quiz Retake Available", body:"You can now retake the Discrete Math quiz. Window closes in 48 hours.",          time:"1d ago", read:true, avatar:"J",avatarGrad:"from-violet-500 to-purple-500"},
  {id:4,from:"Platform",           subject:"New Course: ML Basics", body:"A new course has been added to your program track. Check it out today!",         time:"3d ago", read:true, avatar:"L",avatarGrad:"from-emerald-500 to-teal-500"},
  {id:5,from:"Alan Park",          subject:"Office Hours Reminder", body:"Don't forget — office hours are this Friday at 3 PM. Come with your questions!",time:"4d ago", read:true, avatar:"A",avatarGrad:"from-amber-500 to-orange-500"},
];
const InboxPanel = () => {
  const [messages,setMessages]=useState(MSGS);
  const [selected,setSelected]=useState(null);
  const [compose,setCompose]=useState(false);
  const [composeTo,setComposeTo]=useState("");
  const [composeMsg,setComposeMsg]=useState("");
  const [reply,setReply]=useState("");
  const [filter,setFilter]=useState("all");
  const unread=messages.filter(m=>!m.read).length;
  const shown=filter==="unread"?messages.filter(m=>!m.read):messages;
  const openMsg=(msg)=>{setSelected(msg);setReply("");setMessages(p=>p.map(m=>m.id===msg.id?{...m,read:true}:m));};
  const deleteMsg=(id)=>{setMessages(p=>p.filter(m=>m.id!==id));if(selected?.id===id)setSelected(null);toast("Message deleted.","info");};
  const sendReply=()=>{if(!reply.trim()){toast("Reply cannot be empty.","error");return;}toast(`Reply sent to ${selected?.from}!`,"success");setReply("");};
  const sendCompose=()=>{
    if(!composeTo.trim()){toast("Please enter a recipient.","error");return;}
    if(!composeMsg.trim()){toast("Message cannot be empty.","error");return;}
    toast("Message sent!","success");setCompose(false);setComposeTo("");setComposeMsg("");
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Inbox size={22} className="text-blue-500"/>Inbox
          {unread>0&&<span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{unread}</span>}
        </h2>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={e=>setFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white outline-none">
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
          </select>
          <button onClick={()=>setCompose(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/20">
            <MessageSquare size={13}/>Compose
          </button>
        </div>
      </div>
      <div className="flex gap-4" style={{height:'520px'}}>
        <div className="w-80 shrink-0 flex flex-col gap-1.5 overflow-y-auto pr-1">
          {shown.length===0&&<div className="text-center text-slate-400 text-sm py-12"><Inbox size={32} className="mx-auto mb-2 opacity-30"/>No messages.</div>}
          {shown.map(msg=>(
            <button key={msg.id} onClick={()=>openMsg(msg)}
              className={`w-full text-left p-4 rounded-2xl border transition-all
                ${selected?.id===msg.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                  : msg.read ? 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                             : 'border-blue-200 dark:border-blue-700/40 bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${msg.avatarGrad} flex items-center justify-center text-white text-sm font-bold shrink-0`}>{msg.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={`text-xs truncate ${msg.read ? 'text-slate-500 dark:text-slate-400' : 'font-bold text-slate-800 dark:text-white'}`}>{msg.from}</p>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">{msg.time}</span>
                  </div>
                  <p className={`text-xs truncate ${msg.read ? 'text-slate-400' : 'font-semibold text-slate-700 dark:text-slate-200'}`}>{msg.subject}</p>
                  {!msg.read&&<span className="inline-block mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full"/>}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 flex flex-col overflow-hidden shadow-sm">
          {selected ? (
            <>
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selected.avatarGrad} flex items-center justify-center text-white font-bold shrink-0`}>{selected.avatar}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{selected.subject}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">From: {selected.from} · {selected.time}</p>
                  </div>
                </div>
                <button onClick={()=>deleteMsg(selected.id)} className="text-slate-400 hover:text-red-500 transition p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={15}/>
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selected.body}</p>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-2xl px-4 py-2.5 border border-slate-200 dark:border-slate-600">
                  <input placeholder={`Reply to ${selected.from}...`} value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()}
                    className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white outline-none placeholder:text-slate-400"/>
                  <button onClick={sendReply} className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white transition shrink-0 shadow-sm">
                    <Send size={14}/>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-3xl flex items-center justify-center mb-2"><Inbox size={28} className="opacity-50"/></div>
              <p className="text-sm font-medium">Select a message to read</p>
              <p className="text-xs text-slate-300 dark:text-slate-600">Your inbox is waiting</p>
            </div>
          )}
        </div>
      </div>
      {compose&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><MessageSquare size={18} className="text-blue-500"/>New Message</h3>
              <button onClick={()=>setCompose(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16}/></button>
            </div>
            <input placeholder="To (instructor / support)" value={composeTo} onChange={e=>setComposeTo(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 mb-3 transition"/>
            <textarea rows={4} placeholder="Write your message..." value={composeMsg} onChange={e=>setComposeMsg(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4 transition"/>
            <button onClick={sendCompose} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-blue-500/20">
              <Send size={15}/>Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   MAIN DASHBOARD
   ============================================================ */
const LearningDashboard = () => {
  const [darkMode,  setDarkMode]  = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Student Profile");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const handleDownload = (docName) => {
    try {
      const blob=new Blob([`Data for ${user?.name||"Learner"} — ${docName}`],{type:'text/plain'});
      const url=URL.createObjectURL(blob);
      const a=Object.assign(document.createElement('a'),{href:url,download:docName});
      document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
      toast(`Downloaded: ${docName}`,"success");
    } catch { toast("Download failed.","error"); }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({title:'Learnify Profile',url:window.location.href});
      else { await navigator.clipboard.writeText(window.location.href); toast("Profile link copied!","success"); }
    } catch { toast("Could not share.","error"); }
  };

  const handleLogout = () => { toast("Logging out...","info"); setTimeout(()=>{logout();navigate("/login");},900); };

  const navItems = [
    {id:"Student Profile",  icon:<User         size={18}/>, badge:0},
    {id:"My Certificates",  icon:<Award        size={18}/>, badge:0},
    {id:"Study Plan",       icon:<FileText     size={18}/>, badge:0},
    {id:"Account Settings", icon:<Settings     size={18}/>, badge:0},
    {id:"Lesson",           icon:<BookOpen     size={18}/>, badge:0},
    {id:"Message-Form",     icon:<MessageCircle size={18}/>, badge:0},
    {id:"Notifications",    icon:<Bell         size={18}/>, badge:2},
  ];

  const renderPanel = () => {
    switch(activeTab) {
      case "Student Profile":  return <ProfilePanel         user={user}/>;
      case "My Certificates":  return <MyCertificates       onDownload={handleDownload}/>;
      case "Study Plan":       return <StudyPlanPage/>;
      case "Account Settings": return <AccountSettingsPanel user={user}/>;
      case "Lesson":           return <LessonDashboard/>;
      case "Message-Form":     return <DiscussionForum/>;
      case "Notifications":    return <ProfessionalInbox/>;
      default:                 return <ProfilePanel user={user}/>;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0a0f1e] transition-colors duration-300 font-sans">
      <ToastContainer/>

      {/* ── SIDEBAR ── */}
      <aside className={`sticky top-0 h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 shrink-0 shadow-sm
        ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
          <button onClick={()=>setCollapsed(c=>!c)}
            className="w-9 h-9 bg-blue-600  hover-blue-700 rounded-xl flex items-center justify-center text-white transition-all shrink-0 "
            title={collapsed?"Expand":"Collapse"}>
            {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
          {!collapsed && <span className="font-extrabold text-xl bg-blue-600  bg-clip-text text-transparent tracking-tight select-none">Learnify</span>}
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {!collapsed && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-2">Menu</p>}
          {navItems.map(({id,icon,badge})=>(
            <NavItem key={id} icon={icon} label={id} active={activeTab===id} collapsed={collapsed} badge={badge} onClick={()=>setActiveTab(id)}/>
          ))}
        </nav>
        <div className="px-3 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button onClick={()=>setDarkMode(d=>!d)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all
              ${collapsed ? 'justify-center' : ''}`}>
            {darkMode ? <Sun size={17}/> : <Moon size={17}/>}
            {!collapsed && <span className="text-xs font-bold uppercase tracking-wide">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-slate-900 dark:text-white text-xs font-bold truncate">{user?.name||"Learner"}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email||"student@learnify.com"}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} title="Logout"
            className={`w-full flex items-center gap-2 text-red-500 hover:text-white text-sm font-bold px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 transition-all
              ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={16}/>
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{activeTab}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Welcome {user?.name||"Learner"}</p>
          </div>
          {activeTab==="Student Profile" && (
            <div className="flex gap-2">
              <button onClick={()=>handleDownload(`Transcript_${user?.name||"User"}.pdf`)}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all">
                <Download size={14}/>Download Transcript
              </button>
              <button onClick={handleShare}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 shadow-sm shadow-blue-500/20 transition-all">
                <Share2 size={14}/>Share Profile
              </button>
            </div>
          )}
        </div>
        <div className="p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default LearningDashboard;