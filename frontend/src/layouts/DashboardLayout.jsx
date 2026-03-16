import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* Sidebar */}
      {/* <Sidebar role={user?.role} /> */}

      {/* Page Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        {children}
      </div>
      
    </div>
  );
}