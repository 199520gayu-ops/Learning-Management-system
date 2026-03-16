import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" />;
}

export function RoleProtectedRoute({ children, allowedRoles = [] }) {

  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  const userRole = user.role?.toLowerCase().trim();

  const isAllowed = allowedRoles.includes(userRole);

  if (!isAllowed) {

    const roleRedirects = {
      learner: "/dashboard",
      educator: "/educator-dashboard",
      coordinator: "/coordinator-dashboard"
    };

    return <Navigate to={roleRedirects[userRole] || "/dashboard"} />;
  }

  return children;
}