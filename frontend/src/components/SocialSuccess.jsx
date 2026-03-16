import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function SocialSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");
      const roleParam = searchParams.get("role");

      console.log("🔐 Social auth callback - token:", !!token, "role:", roleParam);

      if (token && roleParam) {
        const cleanRole = roleParam.toLowerCase().trim();
        
        // Save to context and localStorage
        await login({ 
          token, 
          role: cleanRole,
          // Social auth doesn't return id/name/email in URL, 
          // but we can decode JWT or just work with token + role
        });

        const rolePathMap = {
          educator: "/educator-dashboard",
          coordinator: "/coordinator-dashboard",
          learner: "/dashboard",
        };

        const targetPath = rolePathMap[cleanRole] || "/dashboard";
        
        console.log("✅ Social auth complete. Role:", cleanRole);
        console.log("✅ Redirecting to:", targetPath);
        
        // Redirect after brief delay for UX
        setTimeout(() => navigate(targetPath), 500);
      } else {
        console.warn("❌ Missing token or role in callback");
        navigate("/login");
      }
    };

    handleAuth();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <h2 className="text-2xl font-bold text-slate-800">Authenticating...</h2>
      <p className="text-slate-500">Setting up your secure session.</p>
    </div>
  );
}