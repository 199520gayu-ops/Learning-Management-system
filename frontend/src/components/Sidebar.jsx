import {
  LayoutDashboard,
  Mail,
  Book,
  CheckSquare,
  Users,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const navigate = useNavigate();
  const { dark, setDark } = ThemeToggle();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Inbox", icon: Mail, path: "/inbox" },
    { name: "Lessons", icon: Book, path: "/lessons" },
    { name: "Assignments", icon: CheckSquare, path: "/assignments" },
    { name: "Groups", icon: Users, path: "/groups" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 p-6 border-r dark:border-gray-800 hidden md:flex flex-col">
      
      {/* LOGO */}
      <h1 className="text-2xl font-bold text-purple-600 mb-10">
        COURSUE
      </h1>

      {/* MENU */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition
              ${
                isActive
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* DARK MODE */}
      <button
        onClick={() => setDark(!dark)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl
                   text-gray-600 dark:text-gray-300
                   hover:bg-gray-100 dark:hover:bg-gray-800 mb-4"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
        <span className="text-sm">
          {dark ? "Light Mode" : "Dark Mode"}
        </span>
      </button>

      {/* LOGOUT */}
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-3 px-4 py-2 rounded-xl
                   text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  );
}
