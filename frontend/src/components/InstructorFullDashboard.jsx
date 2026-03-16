import React, { useState, useEffect } from "react";
import {
  Trash2, Edit, X, Save, Loader2, Search,
  AlertCircle, CheckCircle, Plus, Shield, GraduationCap, UserCog
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_USERS = [
  { _id: "64a1f2b3c4d5e6f7a8b9c0d1", name: "Aisha Patel",     email: "aisha.patel@edu.com",   role: "Instructor", status: "Active"   },
  { _id: "64a1f2b3c4d5e6f7a8b9c0d2", name: "Marcus Okonkwo", email: "m.okonkwo@edu.com",     role: "Student",    status: "Active"   },
  { _id: "64a1f2b3c4d5e6f7a8b9c0d3", name: "Sofia Reyes",    email: "sofia.r@edu.com",       role: "Student",    status: "Inactive" },
  { _id: "64a1f2b3c4d5e6f7a8b9c0d4", name: "James Liu",      email: "james.liu@edu.com",     role: "Admin",      status: "Active"   },
  { _id: "64a1f2b3c4d5e6f7a8b9c0d5", name: "Priya Nair",     email: "priya.n@edu.com",       role: "Student",    status: "Active"   },
];

const API_URL = "http://localhost:5000/api/users";
const ROLES    = ["Student", "Instructor", "Admin"];
const STATUSES = ["Active", "Inactive"];

const roleStyles = {
  Admin:      { bg: "bg-violet-100",  text: "text-violet-700",  icon: <Shield size={11} /> },
  Instructor: { bg: "bg-amber-100",   text: "text-amber-700",   icon: <UserCog size={11} /> },
  Student:    { bg: "bg-blue-100",    text: "text-blue-700",    icon: <GraduationCap size={11} /> },
};

const avatarColors = ["bg-rose-500","bg-orange-500","bg-amber-500","bg-emerald-500","bg-blue-500","bg-indigo-500","bg-purple-500"];
function getColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
}

export default function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // Simulate delay
        setUsers(MOCK_USERS.map(u => ({ id: u._id, ...u })));
      } catch (e) { setError(e.message); } finally { setLoading(false); }
    };
    load();
  }, []);

  const deleteUser = async () => {
    const user = confirmDel;
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setConfirmDel(null);
    showToast(`${user.name} removed successfully.`);
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    setSaving(false);
    showToast("User updated successfully.");
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && (roleFilter === "All" || u.role === roleFilter);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 lg:p-10 font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* --- Toast --- */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-in slide-in-from-right
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}>
          {toast.type === "error" ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <p className="text-[10px] font-bold text-blue-600 mb-1 tracking-widest uppercase">System Administrator</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">User Management</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            Live Connection
          </div>
        </div>

        {/* --- Filters --- */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {["All", ...ROLES].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all
                  ${roleFilter === r ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* --- Table --- */}
        
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={32}/>
              <p className="text-slate-400 text-sm font-medium">Fetching database records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-8 py-5">Profile</th>
                    <th className="px-8 py-5">Access Level</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u) => {
                    const role = roleStyles[u.role] || roleStyles.Student;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl ${getColor(u.name)} flex items-center justify-center font-bold text-white shadow-sm`}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${role.bg} ${role.text}`}>
                            {role.icon} {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl
                            ${u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}/>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingUser({...u})} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all">
                              <Edit size={16}/>
                            </button>
                            <button onClick={() => setConfirmDel(u)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 shadow-sm transition-all">
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Edit Modal --- */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-white animate-in zoom-in-95">
            <div className="flex justify-between items-center p-8 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Update Profile</h2>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={saveChanges} className="p-8 pt-0 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input type="text" value={editingUser.name} required onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                <input type="email" value={editingUser.email} required onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Role</label>
                  <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Status</label>
                  <select value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all">
                  {saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation --- */}
      {confirmDel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6 text-red-600 border border-red-100">
              <Trash2 size={28}/>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Remove User?</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">{confirmDel.name}</span>? This process cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)} className="flex-1 py-3.5 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">Abort</button>
              <button onClick={deleteUser} className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-100 transition-all">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}