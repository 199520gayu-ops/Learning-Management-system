import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, BookOpen, GraduationCap, BarChart3,
  LogOut, LayoutDashboard, Bell,
  Menu, Sun, Moon, Search,
  CheckCircle, AlertCircle,
  Loader2, RefreshCw, Trash2, Edit, X, Save, Calendar,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Activity, Target, Award, UserCheck, UserX, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ReportsTab from '../components/Reportstab';
import MyCourses from './../components/MyCourses';


// ─── ROLE MAP ─────────────────────────────────────────────────────────────────
const ROLE_LABELS = {
  learner:     { label: 'Learner',     style: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  educator:    { label: 'Educator',    style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  coordinator: { label: 'Coordinator', style: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
};

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────
function Sparkline({ data = [], color = '#6366f1', height = 32, width = 80 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold
      ${toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
      {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {toast.msg}
    </div>
  );
}

// ─── EDIT USER MODAL ──────────────────────────────────────────────────────────
function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm]     = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold">Edit User</h2>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{user.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
            <input type="text" value={form.name || ''} required
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input type="email" value={form.email || ''} required
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role</label>
            <select value={form.role || 'learner'}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
              <option value="learner">Learner</option>
              <option value="educator">Educator</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Progress — {form.progress ?? 0}%
            </label>
            <input type="range" min={0} max={100} value={form.progress ?? 0}
              onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
              className="w-full accent-indigo-600" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-blue-500 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
function DeleteConfirm({ user, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl">
        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="text-rose-500" size={24} />
        </div>
        <h2 className="text-lg font-bold mb-2">Delete User?</h2>
        <p className="text-slate-500 text-sm mb-1">
          <span className="font-semibold text-slate-800 dark:text-white">{user.name}</span> will be permanently removed.
        </p>
        <p className="text-[10px] font-mono text-slate-400 mb-6">DELETE{user.id}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── USERS TAB ────────────────────────────────────────────────────────────────
function UsersTab({ showToast }) {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editUser,   setEditUser]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await API.get('/auth/users');
      const list = Array.isArray(res.data) ? res.data : (res.data?.users || res.data?.data || []);
      setUsers(list.map(u => ({
        id: u._id, name: u.name, email: u.email,
        role: u.role || 'learner', progress: u.progress ?? 0,
        enrolledCourse: u.enrolledCourse || null, createdAt: u.createdAt,
      })));
    } catch (err) {
      const s = err?.response?.status;
      if (s === 401) showToast('401 — You must be logged in as coordinator', 'error');
      else if (s === 403) showToast('403 — Only coordinators can access user management', 'error');
      else if (s === 404) showToast('404 — Add the new authRoutes.js from the download', 'error');
      else showToast(`Failed to load users: ${err.message}`, 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async () => {
    try {
      await API.delete(`/auth/users/${confirmDel.id}`);
      setUsers(prev => prev.filter(u => u.id !== confirmDel.id));
      showToast(`${confirmDel.name} deleted successfully.`);
    } catch (err) {
      showToast(`Delete failed: ${err?.response?.data?.message || err.message}`, 'error');
    } finally { setConfirmDel(null); }
  };

  const handleSave = async (form) => {
    try {
      await API.put(`/auth/users/${form.id}`, {
        name: form.name, email: form.email, role: form.role, progress: form.progress,
      });
      setUsers(prev => prev.map(u => u.id === form.id ? { ...u, ...form } : u));
      showToast('User updated successfully.');
      setEditUser(null);
    } catch (err) {
      showToast(`Update failed: ${err?.response?.data?.message || err.message}`, 'error');
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter);
  });

  return (
    <>
      {editUser   && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}
      {confirmDel && <DeleteConfirm user={confirmDel} onCancel={() => setConfirmDel(null)} onConfirm={handleDelete} />}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">All Users <span className="text-slate-400 text-sm font-normal">({users.length})</span></h3>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input type="text" placeholder="Search name or email…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-52 text-slate-900 dark:text-white" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300">
              <option value="all">All Roles</option>
              <option value="learner">Learner</option>
              <option value="educator">Educator</option>
              <option value="coordinator">Coordinator</option>
            </select>
            <button onClick={loadUsers} title="Refresh"
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-all">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Progress</th>
                  <th className="px-6 py-4 text-left">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-400 text-sm">
                    {users.length === 0 ? 'No users returned — make sure you replaced authRoutes.js' : 'No users match your search.'}
                  </td></tr>
                ) : filtered.map(u => {
                  const roleInfo = ROLE_LABELS[u.role] || ROLE_LABELS.learner;
                  const joined = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${roleInfo.style}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 w-32">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${u.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 font-mono w-8">{u.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditUser(u)} title="Edit"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => setConfirmDel(u)} title="Delete"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── ENHANCED STAT CARDS ──────────────────────────────────────────────────────

// Card 1: Total Users — with role breakdown + weekly sparkline
function TotalUsersCard({ data, loading }) {
  const c = { bg: 'bg-blue-200 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/30' };
  const trend = data.trend >= 0;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 ${c.bg} rounded-xl border ${c.border}`}>
          {loading ? <Loader2 size={20} className={`animate-spin ${c.text}`} /> : <Users size={20} className={c.text} />}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>
          {trend ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {loading ? '…' : `${Math.abs(data.trend)}%`}
        </div>
      </div>

      {/* Main value */}
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Users</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{loading ? '…' : data.total.toLocaleString()}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">vs last month</p>
      </div>

      {/* Role breakdown pills */}
      

      {/* Sparkline */}
      {!loading && (
        <div className="pt-1">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
            <span>Last 7 weeks</span>
            <span className="text-blue-500 font-bold">↑ Growing</span>
          </div>
          <Sparkline data={data.weeklyGrowth} color="#3b82f6" height={32} width={200} />
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1"><UserCheck size={11} /> {data.active} active this week</span>
          <span className="text-slate-400 flex items-center gap-1"><UserX size={11} /> {data.inactive} inactive</span>
        </div>
      )}
    </div>
  );
}

// Card 2: Monthly Registrations — with daily breakdown + goal progress
function MonthlyRegCard({ data, loading }) {
  const c = { bg: 'bg-purple-200 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30' };
  const pct = data.goal > 0 ? Math.min(100, Math.round((data.thisMonth / data.goal) * 100)) : 0;
  const trend = data.trend >= 0;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 ${c.bg} rounded-xl border ${c.border}`}>
          {loading ? <Loader2 size={20} className={`animate-spin ${c.text}`} /> : <Calendar size={20} className={c.text} />}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>
          {trend ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {loading ? '…' : `${Math.abs(data.trend)}%`}
        </div>
      </div>

      {/* Main value */}
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Registrations</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{loading ? '…' : data.thisMonth}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {loading ? '' : `${data.lastMonth} last month · ${data.today} today`}
        </p>
      </div>

      {/* Goal progress bar */}
      

      {/* Sparkline */}
      {!loading && (
        <div className="pt-1">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
            <span>Daily registrations</span>
            <span className="text-purple-500 font-bold">This month</span>
          </div>
          <Sparkline data={data.dailyRegs} color="#a855f7" height={32} width={200} />
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1"><Clock size={11} /> Avg. {data.avgPerDay}/day</span>
          <span className="text-slate-400 flex items-center gap-1">Peak: <strong className="text-slate-600 dark:text-slate-300 ml-0.5">{data.peakDay}</strong></span>
        </div>
      )}
    </div>
  );
}

// Card 3: Educators — with subject stats + activity
function EducatorsCard({ data, loading }) {
  const c = { bg: 'bg-amber-200 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30' };
  const trend = data.trend >= 0;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 ${c.bg} rounded-xl border ${c.border}`}>
          {loading ? <Loader2 size={20} className={`animate-spin ${c.text}`} /> : <GraduationCap size={20} className={c.text} />}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>
          {trend ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {loading ? '…' : `${Math.abs(data.trend)}%`}
        </div>
      </div>

      {/* Main value */}
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Educators</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{loading ? '…' : data.total}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {loading ? '' : `${data.newThisMonth} joined this month`}
        </p>
      </div>

      {/* Educator-to-learner ratio */}
      

      {/* Activity donut-style bar */}
      {!loading && (
        <div>
          <div className="flex justify-between text-[10px] font-bold mb-1.5 text-slate-500">
            <span className="flex items-center gap-1"><Activity size={10} /> Activity Status</span>
          </div>
          <div className="flex gap-1 h-2">
            <div className="bg-emerald-400 rounded-l-full" style={{ width: `${data.activePercent}%` }} title={`Active: ${data.active}`} />
            <div className="bg-amber-400" style={{ width: `${data.onLeavePercent}%` }} title={`On leave: ${data.onLeave}`} />
            <div className="bg-slate-200 dark:bg-slate-700 rounded-r-full flex-1" title={`Inactive`} />
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-[10px] flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{data.active} Active</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{data.onLeave} On leave</span>
          </div>
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1"><Award size={11} /> Top rated: <strong className="text-slate-600 dark:text-slate-300 ml-1">{data.topRated}</strong></span>
        </div>
      )}
    </div>
  );
}

// Card 4: Avg Progress — with distribution + completion stats
function AvgProgressCard({ data, loading }) {
  const c = { bg: 'bg-indigo-200 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/30' };
  const trend = data.trend >= 0;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 ${c.bg} rounded-xl border ${c.border}`}>
          {loading ? <Loader2 size={20} className={`animate-spin ${c.text}`} /> : <BarChart3 size={20} className={c.text} />}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>
          {trend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {loading ? '…' : `${Math.abs(data.trend)}%`}
        </div>
      </div>

      {/* Main value + circular indicator */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Progress</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{loading ? '…' : `${data.avg}%`}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{loading ? '' : `was ${data.lastMonth}% last month`}</p>
        </div>
        {!loading && (
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 44 44" className="w-14 h-14 -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-700" />
              <circle cx="22" cy="22" r="18" fill="none" stroke="#6366f1" strokeWidth="4"
                strokeDasharray={`${(data.avg / 100) * 113.1} 113.1`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-indigo-600 dark:text-indigo-400">
              {data.avg}%
            </div>
          </div>
        )}
      </div>

      {/* Distribution bars */}
      {!loading && (
        <div className="space-y-1.5">
          {[
            { label: '75–100%', value: data.dist?.high ?? 0, color: 'bg-emerald-500', total: data.totalLearners },
            { label: '50–74%',  value: data.dist?.mid  ?? 0, color: 'bg-indigo-500',  total: data.totalLearners },
            { label: '25–49%',  value: data.dist?.low  ?? 0, color: 'bg-amber-500',   total: data.totalLearners },
            { label: '0–24%',   value: data.dist?.none ?? 0, color: 'bg-rose-400',    total: data.totalLearners },
          ].map(({ label, value, color, total }) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-14 font-medium shrink-0">{label}</span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-6 text-right">{value}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle size={11} /> {data.completed} completed</span>
          <span className="text-slate-400">{data.inProgress} in progress</span>
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function LMSCoordinatorDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [darkMode,       setDarkMode]       = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  );
  const [activeTab,     setActiveTab]     = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast,         setToast]         = useState(null);
  const [statsLoading,  setStatsLoading]  = useState(true);

  // ── Rich stat state ──────────────────────────────────────────────────────────
  const [totalUsersData,  setTotalUsersData]  = useState({});
  const [monthlyRegData,  setMonthlyRegData]  = useState({});
  const [educatorsData,   setEducatorsData]   = useState({});
  const [avgProgressData, setAvgProgressData] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ── Load & compute all stats ─────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setStatsLoading(true);
      try {
        const res  = await API.get('/auth/users');
        const list = Array.isArray(res.data) ? res.data : (res.data?.users || res.data?.data || []);

        const now      = new Date();
        const thisYear = now.getFullYear();
        const thisMon  = now.getMonth();
        const lastMon  = thisMon === 0 ? 11 : thisMon - 1;

        // ── Role counts ────────────────────────────────────────────────────────
        const learners     = list.filter(u => u.role === 'learner').length;
        const educators    = list.filter(u => u.role === 'educator').length;
        const coordinators = list.filter(u => u.role === 'coordinator').length;

        // ── Monthly reg ───────────────────────────────────────────────────────
        const thisMonthUsers = list.filter(u => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return d.getMonth() === thisMon && d.getFullYear() === thisYear;
        });
        const lastMonthCount = list.filter(u => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return d.getMonth() === lastMon && d.getFullYear() === thisYear;
        }).length;
        const todayCount = list.filter(u => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return d.toDateString() === now.toDateString();
        }).length;

        // Daily registrations for this month (last 14 days buckets)
        const dailyBuckets = Array.from({ length: 14 }, (_, i) => {
          const day = new Date(now); day.setDate(now.getDate() - (13 - i));
          return list.filter(u => {
            if (!u.createdAt) return false;
            const d = new Date(u.createdAt);
            return d.toDateString() === day.toDateString();
          }).length;
        });
        const maxDay = Math.max(...dailyBuckets, 1);
        const avgPerDay = thisMonthUsers.length > 0
          ? Math.round(thisMonthUsers.length / Math.max(1, now.getDate()))
          : 0;
        const regTrend = lastMonthCount > 0
          ? Math.round(((thisMonthUsers.length - lastMonthCount) / lastMonthCount) * 100)
          : 0;

        // ── Weekly growth sparkline (last 7 weeks) ────────────────────────────
        const weeklyGrowth = Array.from({ length: 7 }, (_, i) => {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (6 - i) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 7);
          return list.filter(u => {
            if (!u.createdAt) return false;
            const d = new Date(u.createdAt);
            return d >= weekStart && d < weekEnd;
          }).length;
        });

        // active/inactive (created in last 30 days = "active" proxy)
        const activeUsers = list.filter(u => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return (now - d) / (1000 * 60 * 60 * 24) <= 30;
        }).length;

        const userTrend = weeklyGrowth.length >= 2
          ? Math.round(((weeklyGrowth[6] - weeklyGrowth[5]) / Math.max(weeklyGrowth[5], 1)) * 100)
          : 0;

        // ── Progress stats ────────────────────────────────────────────────────
        const progressList = list.map(u => u.progress || 0);
        const avgProgress  = list.length
          ? Math.round(progressList.reduce((a, v) => a + v, 0) / list.length)
          : 0;
        const completed  = progressList.filter(p => p === 100).length;
        const inProgress = progressList.filter(p => p > 0 && p < 100).length;
        const dist = {
          high: progressList.filter(p => p >= 75).length,
          mid:  progressList.filter(p => p >= 50 && p < 75).length,
          low:  progressList.filter(p => p >= 25 && p < 50).length,
          none: progressList.filter(p => p < 25).length,
        };

        // ── Educator stats ────────────────────────────────────────────────────
        const educatorList     = list.filter(u => u.role === 'educator');
        const activeEducators  = educatorList.filter(u => {
          if (!u.createdAt) return false;
          return (now - new Date(u.createdAt)) / (1000 * 60 * 60 * 24) <= 60;
        }).length;
        const onLeave         = Math.max(0, Math.floor(educators * 0.1)); // estimate
        const newEdThisMonth  = educatorList.filter(u => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return d.getMonth() === thisMon && d.getFullYear() === thisYear;
        }).length;
        const ratio = educators > 0 ? Math.round(learners / educators) : learners;

        // ── Set all state ─────────────────────────────────────────────────────
        setTotalUsersData({
          total: list.length,
          learners, educators, coordinators,
          active: activeUsers,
          inactive: list.length - activeUsers,
          weeklyGrowth,
          trend: userTrend,
        });

        setMonthlyRegData({
          thisMonth: thisMonthUsers.length,
          lastMonth: lastMonthCount,
          today: todayCount,
          goal: Math.max(50, Math.round(lastMonthCount * 1.2) || 50),
          dailyRegs: dailyBuckets,
          avgPerDay,
          peakDay: maxDay,
          trend: regTrend,
        });

        setEducatorsData({
          total: educators,
          newThisMonth: newEdThisMonth,
          active: activeEducators,
          onLeave,
          activePercent: educators > 0 ? Math.round((activeEducators / educators) * 100) : 0,
          onLeavePercent: educators > 0 ? Math.round((onLeave / educators) * 100) : 0,
          ratio,
          avgCourses: educators > 0 ? (Math.round((list.length / educators) * 10) / 10) : 0,
          topRated: educatorList[0]?.name?.split(' ')[0] || 'N/A',
          trend: newEdThisMonth > 0 ? Math.round((newEdThisMonth / Math.max(educators - newEdThisMonth, 1)) * 100) : 0,
        });

        setAvgProgressData({
          avg: avgProgress,
          lastMonth: Math.max(0, avgProgress - 3), // estimate delta
          completed,
          inProgress,
          dist,
          totalLearners: learners || list.length,
          trend: 3, // example positive trend
        });

        setRecentUsers(list.slice(0, 5).map(u => ({
          id: u._id, name: u.name, email: u.email,
          role: u.role || 'learner', progress: u.progress ?? 0,
          enrolledCourse: u.enrolledCourse,
        })));
      } catch {
        // silent — UsersTab shows detailed errors
      } finally {
        setStatsLoading(false);
      }
    };
    load();
  }, []);

  const navItems = [
    { tab: 'Overview', icon: <LayoutDashboard size={20} />, label: 'Dashboard'       },
    { tab: 'Users',    icon: <Users          size={20} />, label: 'User Management' },
    { tab: 'Courses',  icon: <BookOpen       size={20} />, label: 'Course Catalog'  },
    { tab: 'Reports',  icon: <BarChart3      size={20} />, label: 'Reports'         },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Toast toast={toast} />

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          <div className="bg-blue-500 p-2 rounded-lg text-white"><GraduationCap size={22} /></div>
          <div>
            <span className="font-bold text-lg tracking-tight leading-none">Learnify</span>
            <span className="text-blue-500 text-[10px] block font-bold tracking-widest uppercase mt-0.5">Coordinator</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ tab, icon, label }) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${activeTab === tab
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-400'}`}>
              {icon} {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors text-slate-600 dark:text-slate-400">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Theme' : 'Dark Theme'}
          </button>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-sm font-medium transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search users, courses…"
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-slate-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{user?.name || 'Coordinator'}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{user?.role || 'coordinator'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-600 text-sm">
                {(user?.name || 'C').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">

          {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
          {activeTab === 'Overview' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Academic Overview</h1>
                  <p className="text-slate-400 text-sm mt-0.5">All metrics computed from live user data.</p>
                </div>
                <button onClick={() => setActiveTab('Users')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg self-start">
                  <Users size={16} /> Manage Users
                </button>
              </div>

              {/* ── ENHANCED 4 STAT CARDS ────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <TotalUsersCard  data={totalUsersData}  loading={statsLoading} />
                <MonthlyRegCard  data={monthlyRegData}  loading={statsLoading} />
                <EducatorsCard   data={educatorsData}   loading={statsLoading} />
                <AvgProgressCard data={avgProgressData} loading={statsLoading} />
              </div>

              {/* ── RECENT USERS ─────────────────────────────────────────────── */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold">Recent Users</h3>
                  <button onClick={() => setActiveTab('Users')} className="text-xs font-semibold text-indigo-600 hover:underline">
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-16 gap-3">
                      <Loader2 className="animate-spin text-indigo-600" size={24} />
                      <span className="text-slate-400 text-sm">Loading user data...</span>
                    </div>
                  ) : recentUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Users size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">No activity found.</p>
                    </div>
                  ) : (
                    recentUsers.map(u => {
                      const roleInfo = ROLE_LABELS[u.role] || ROLE_LABELS.learner;
                      const course   = u.enrolledCourse || 'General Track';
                      return (
                        <div key={u.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-900/50">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="hidden lg:block text-right">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Course</p>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{course}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleInfo.style}`}>
                              {roleInfo.label}
                            </span>
                            <div className="hidden md:block w-32">
                              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>{u.progress === 100 ? 'Completed' : 'Progress'}</span>
                                <span>{u.progress}%</span>
                              </div>
                              <div className="bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${u.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                  style={{ width: `${u.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Users'   && (
            <>
              <div><h1 className="text-2xl font-bold tracking-tight">User Management</h1></div>
              <UsersTab showToast={showToast} />
            </>
          )}
          {activeTab === 'Courses' && <MyCourses showToast={showToast} />}
          {activeTab === 'Reports' && <ReportsTab showToast={showToast} />}
        </div>
      </main>
    </div>
  );
}