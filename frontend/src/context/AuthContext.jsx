import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user after refresh
  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);

  }, []);

  // 🔥 LOGIN FUNCTION (IMPORTANT FIX)
  const login = (data) => {

    const cleanRole = data.role?.toLowerCase().trim();

    const newUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: cleanRole,
      token: data.token
    };

    // Save FIRST (sync)
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", data.token);

    // THEN update React state
    setUser(newUser);

    // Return dashboard path safely
    const roleRedirects = {
      learner: "/dashboard",
      educator: "/educator-dashboard",
      coordinator: "/coordinator-dashboard"
    };

    return roleRedirects[cleanRole] || "/dashboard";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);