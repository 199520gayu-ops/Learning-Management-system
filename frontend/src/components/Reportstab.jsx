import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, BookOpen,
  GraduationCap, Award, Download, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';
import API from '../api/axios';

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = {
  indigo:  '#6366f1',
  emerald: '#10b981',
  amber:   '#f59e0b',
  rose:    '#f43f5e',
  sky:     '#0ea5e9',
  violet:  '#8b5cf6',
};
const PIE_COLORS = [COLORS.indigo, COLORS.emerald, COLORS.amber];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildMonthlyRegistrations(users) {
  const now   = new Date();
  const slots = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: months[d.getMonth()], year: d.getFullYear(), count: 0 };
  });
  users.forEach(u => {
    const d = new Date(u.createdAt);
    slots.forEach(s => {
      if (d.getMonth() === months.indexOf(s.month) && d.getFullYear() === s.year) s.count++;
    });
  });
  return slots.map(s => ({ name: s.month, Registrations: s.count }));
}

function buildRoleDistribution(users) {
  const map = { learner: 0, educator: 0, coordinator: 0 };
  users.forEach(u => { if (map[u.role] !== undefined) map[u.role]++; });
  return [
    { name: 'Learners',     value: map.learner      },
    { name: 'Educators',    value: map.educator     },
    { name: 'Coordinators', value: map.coordinator  },
  ];
}

function buildProgressBuckets(users) {
  const buckets = [
    { name: '0–20%',   count: 0 },
    { name: '21–40%',  count: 0 },
    { name: '41–60%',  count: 0 },
    { name: '61–80%',  count: 0 },
    { name: '81–100%', count: 0 },
  ];
  users.forEach(u => {
    const p = u.progress ?? 0;
    if (p <= 20)       buckets[0].count++;
    else if (p <= 40)  buckets[1].count++;
    else if (p <= 60)  buckets[2].count++;
    else if (p <= 80)  buckets[3].count++;
    else               buckets[4].count++;
  });
  return buckets;
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  const colors = {
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-950/40',  icon: 'text-indigo-600',  bar: 'bg-indigo-500'  },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',    icon: 'text-amber-600',   bar: 'bg-amber-500'   },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-950/40',      icon: 'text-rose-600',    bar: 'bg-rose-500'    },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 ${c.bg} rounded-xl`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full
            ${trend >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, sub, children, action }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          {sub && <p className="text-[11px] text-slate-400 font-mono mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main ReportsTab component ────────────────────────────────────────────────
export default function ReportsTab({ showToast }) {
  const [users,      setUsers]      = useState([]);
  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, cRes] = await Promise.allSettled([
        API.get('/auth/users'),
        API.get('/courses'),
      ]);

      if (uRes.status === 'fulfilled') {
        const list = Array.isArray(uRes.value.data)
          ? uRes.value.data
          : (uRes.value.data?.users || uRes.value.data?.data || []);
        setUsers(list);
      } else {
        throw new Error(uRes.reason?.response?.data?.message || uRes.reason?.message);
      }

      if (cRes.status === 'fulfilled') {
        const list = Array.isArray(cRes.value.data)
          ? cRes.value.data
          : (cRes.value.data?.courses || cRes.value.data?.data || []);
        setCourses(list);
      }
      // courses failing is non-fatal
    } catch (err) {
      setError(err.message);
      showToast?.(`Reports: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Derived metrics ──────────────────────────────────────────────────────
  const totalUsers    = users.length;
  const learners      = users.filter(u => u.role === 'learner').length;
  const educators     = users.filter(u => u.role === 'educator').length;
  const avgProgress   = totalUsers
    ? Math.round(users.reduce((a, u) => a + (u.progress || 0), 0) / totalUsers)
    : 0;
  const completed     = users.filter(u => (u.progress || 0) >= 100).length;
  const completionPct = totalUsers ? Math.round((completed / totalUsers) * 100) : 0;
  const enrolled      = users.filter(u => u.enrolledCourse).length;
  const enrollRate    = totalUsers ? Math.round((enrolled / totalUsers) * 100) : 0;

  const monthlyData    = buildMonthlyRegistrations(users);
  const roleData       = buildRoleDistribution(users);
  const progressData   = buildProgressBuckets(users);

  // Top learners by progress
  const topLearners = [...users]
    .filter(u => u.role === 'learner')
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 5);

  // Search + role filtered users (for table only — charts always show full data)
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={44} />
      <p className="text-slate-400 text-sm font-medium">Building your reports…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
      <AlertCircle size={44} className="text-rose-400" />
      <p className="text-rose-500 font-semibold">{error}</p>
      <button onClick={load}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Live analytics
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={() => {
              const csv = [
                ['Name','Email','Role','Progress','Enrolled'],
                ...users.map(u => [u.name, u.email, u.role, u.progress ?? 0, u.enrolledCourse ? 'Yes' : 'No'])
              ].map(r => r.join(',')).join('\n');
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
              a.download = 'user-report.csv';
              a.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users"    value={totalUsers}       icon={Users}          color="indigo"  trend={12}  sub={`${educators} educators`} />
        <StatCard label="Avg Progress"   value={`${avgProgress}%`} icon={TrendingUp}    color="emerald" trend={avgProgress > 50 ? 5 : -3} sub={`${completed} completed`} />
        <StatCard label="Completion Rate" value={`${completionPct}%`} icon={Award}      color="amber"   trend={2}   sub={`${completed} of ${totalUsers}`} />
        <StatCard label="Enrolment Rate" value={`${enrollRate}%`}  icon={GraduationCap} color="rose"    trend={enrollRate > 60 ? 8 : -2} sub={`${enrolled} enrolled`} />
      </div>

      {/* ── Row 1: Monthly registrations + Role distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area chart — monthly registrations */}
        <Section
          title="Monthly Registrations"
          sub="GET /api/auth/users · last 6 months"
          action={
            <span className="text-[10px] font-mono text-slate-400">
              {totalUsers} total
            </span>
          }
          className="lg:col-span-2"
        >
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.indigo} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="Registrations"
                  stroke={COLORS.indigo} strokeWidth={2.5}
                  fill="url(#regGrad)" dot={{ fill: COLORS.indigo, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Pie chart — role distribution */}
        <Section title="Role Distribution" sub="learner · educator · coordinator">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={roleData} cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value"
              >
                {roleData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {roleData.map((r, i) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{r.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-white">{r.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Row 2: Progress distribution + Top learners ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar chart — progress buckets */}
        <Section title="Progress Distribution" sub="% of learners per progress range">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progressData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]}>
                {progressData.map((_, i) => (
                  <Cell key={i} fill={i === 4 ? COLORS.emerald : i === 3 ? COLORS.indigo : i === 2 ? COLORS.sky : i === 1 ? COLORS.amber : COLORS.rose} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* Top learners leaderboard */}
        <Section title="Top Learners" sub="ranked by progress">
          {topLearners.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-12">No learners found.</p>
          ) : (
            <div className="space-y-3">
              {topLearners.map((u, i) => (
                <div key={u._id} className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0
                    ${i === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                    : i === 1 ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    : i === 2 ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30'
                    : 'bg-slate-50 text-slate-400 dark:bg-slate-800/50'}`}>
                    {i + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.name}</p>
                      <span className="text-xs font-mono text-slate-500 ml-2 flex-shrink-0">{u.progress ?? 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700
                          ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-indigo-400'}`}
                        style={{ width: `${u.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* ── Summary table with search + role filter ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

        {/* Table header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Full User Report</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {filteredUsers.length === totalUsers
                  ? `${totalUsers} users`
                  : `${filteredUsers.length} of ${totalUsers} users`}
              </p>
            </div>

            {/* ── Search + filter controls ── */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Search input */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-48 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                />
                {/* Clear button */}
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Role filter pills */}
              <div className="flex gap-1.5">
                {['all', 'learner', 'educator', 'coordinator'].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all capitalize
                      ${roleFilter === r
                        ? r === 'all'         ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                        : r === 'learner'     ? 'bg-sky-500 text-white'
                        : r === 'educator'   ? 'bg-amber-500 text-white'
                        : 'bg-indigo-500 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    {r === 'all' ? 'All' : r}
                  </button>
                ))}
              </div>

              {/* Avg badge */}
              <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg hidden sm:block
                ${avgProgress >= 60 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                Avg {avgProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Progress</th>
                <th className="px-6 py-3 text-left">Enrolled</th>
                <th className="px-6 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 text-sm">
                    {search || roleFilter !== 'all'
                      ? 'No users match your search.'
                      : 'No users found.'}
                  </td>
                </tr>
              ) : filteredUsers.map(u => {
                const roleColors = {
                  learner:     'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
                  educator:    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                  coordinator: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
                };
                const prog      = u.progress ?? 0;
                const progColor = prog >= 80 ? 'bg-emerald-500' : prog >= 50 ? 'bg-indigo-500' : prog >= 30 ? 'bg-amber-500' : 'bg-rose-400';
                const joined    = u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—';

                // Highlight matching search text
                const highlight = (text) => {
                  if (!search) return text;
                  const idx = text.toLowerCase().indexOf(search.toLowerCase());
                  if (idx === -1) return text;
                  return (
                    <>
                      {text.slice(0, idx)}
                      <mark className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded px-0.5">
                        {text.slice(idx, idx + search.length)}
                      </mark>
                      {text.slice(idx + search.length)}
                    </>
                  );
                };

                return (
                  <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">{highlight(u.name)}</p>
                          <p className="text-[10px] text-slate-400">{highlight(u.email)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${roleColors[u.role] || roleColors.learner}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 w-28">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`${progColor} h-full rounded-full`} style={{ width: `${prog}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 w-7">{prog}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md
                        ${u.enrolledCourse
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        {u.enrolledCourse ? 'Enrolled' : 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[11px] text-slate-400">{joined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              {filteredUsers.length === totalUsers
                ? `${totalUsers} total users`
                : `${filteredUsers.length} result${filteredUsers.length !== 1 ? 's' : ''} of ${totalUsers}`}
            </span>
            {(search || roleFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setRoleFilter('all'); }}
                className="text-xs text-indigo-600 hover:underline font-semibold">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}