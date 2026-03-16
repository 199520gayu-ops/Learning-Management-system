import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Mail, Lock, User, Github, Linkedin, Facebook, AlertCircle, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Login() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [showForgot, setShowForgot] = useState(false); // New state for forgot password
  const [role, setRole] = useState("learner");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset messages when switching views
  useEffect(() => { 
    setError(""); 
    setSuccess("");
    if (isLoginActive) setShowForgot(false);
  }, [isLoginActive]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (showForgot) {
        // --- FORGOT PASSWORD LOGIC ---
        await API.post("/auth/forgot-password", { email: formData.email });
        setSuccess("Password reset link sent to your email.");
      } else {
        // --- LOGIN / REGISTER LOGIC ---
        const endpoint = isLoginActive ? "/auth/login" : "/auth/register";
        const payload = isLoginActive 
          ? { email: formData.email, password: formData.password }
          : { ...formData, role };

        console.log("📤 Sending to", endpoint, ":", payload);
        const res = await API.post(endpoint, payload);
        console.log("📥 Response:", res.data);
        
        // Backend returns flat user data plus token
        const { _id, name, email, role: respRole, token } = res.data;

        if (!token || !_id) {
          setError("Invalid response from server. Please contact support.");
          setLoading(false);
          return;
        }

        if (isLoginActive) {
  // ✅ Get role from response, fallback to selected role
  const backendRole = respRole || role;
  const cleanRole = backendRole?.toLowerCase().trim();

  console.log("📝 Login response role:", respRole);
  console.log("📝 Selected role fallback:", role);
  console.log("📝 Cleaned role:", cleanRole);

  // ✅ Save to context and localStorage
  await login({
    _id,
    name,
    email,
    role: cleanRole,
    token
  });

  // ✅ Determine dashboard path based on role
  const rolePathMap = {
    educator: "/educator-dashboard",
    coordinator: "/coordinator-dashboard",
    learner: "/dashboard",
  };

  const dashboardPath = rolePathMap[cleanRole] || "/dashboard";

  console.log("✅ Login successful. Role:", cleanRole);
  console.log("✅ Navigating to:", dashboardPath);

  // Navigate immediately (login promise ensures localStorage is set)
  navigate(dashboardPath);

        } else {
          // Registration success
          setIsLoginActive(true);
          setSuccess("Account created! You can now log in.");
          setFormData({ name: "", email: "", password: "" });
        }
      }
    } catch (err) {
      console.error("❌ Error:", err);
      
      let errorMsg = "Action failed. Please try again.";
      
      // Handle different error types
      if (err.code === "ERR_NETWORK") {
        errorMsg = "❌ Network Error: Cannot connect to backend server. Make sure it's running on http://localhost:5001";
      } else if (err.code === "ECONNABORTED") {
        errorMsg = "❌ Request Timeout: Backend server is not responding. Please check if it's running.";
      } else if (err.response?.status === 404) {
        errorMsg = "❌ Server Error: API endpoint not found. Please ensure backend is properly configured.";
      } else if (err.response?.status === 500) {
        errorMsg = "❌ Server Error: " + (err.response?.data?.message || "Internal server error");
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.message || "❌ Invalid input. Please check your details.";
      } else if (err.response?.status === 401) {
        errorMsg = err.response?.data?.message || "❌ Invalid email or password";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F7] p-4 font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow overflow-hidden min-h-[650px] flex">
        
        {/* --- OVERLAY PANEL (The Sliding Part) --- */}
        <div 
          className={`absolute top-0 left-0 h-full w-1/2 bg-[#1E293B] text-white z-40 transition-transform duration-700 ease-in-out flex flex-col justify-center items-center text-center p-12
          ${isLoginActive ? 'translate-x-full rounded-l-[100px]' : 'translate-x-0 rounded-r-[100px]'}`}
        >
          <h2 className="text-4xl font-bold mb-4">{isLoginActive ? "Hello, Friend!" : "Welcome Back!"}</h2>
          <p className="text-slate-300 mb-8 max-w-xs leading-relaxed">
            {isLoginActive 
              ? "Enter your details and start your professional learning journey with us." 
              : "To keep connected with your progress, please login with your personal info."}
          </p>
          <button 
            onClick={() => setIsLoginActive(!isLoginActive)}
            className="border-2 border-white px-10 py-2.5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-[#083D41] transition-all active:scale-95"
          >
            {isLoginActive ? "Sign Up" : "Sign In"}
          </button>
        </div>

        {/* --- LEFT SIDE: SIGN IN / FORGOT PASSWORD --- */}
        <div className={`w-1/2 p-12 flex flex-col justify-center items-center transition-all duration-700 ${isLoginActive ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
          <h2 className="text-3xl font-black text-slate-800 mb-4">
            {showForgot ? "Reset Password" : "Login With"}
          </h2>
          
          {!showForgot && <SocialLinks />}
          <p className="text-slate-400 text-xs mb-6 uppercase font-bold tracking-tighter">
            {showForgot ? "Enter your email to receive a reset link" : "OR USE YOUR EMAIL & PASSWORD"}
          </p>
          
          <form onSubmit={handleSubmit} className="w-full space-y-4">
             {!showForgot && <RoleSelector activeRole={role} setRole={setRole} />}
             
             <Input icon={<Mail size={18}/>} type="email" name="email" placeholder="Email Address" onChange={handleChange} />
             
             {!showForgot && (
               <>
                 <Input icon={<Lock size={18}/>} type="password" name="password" placeholder="Password" onChange={handleChange} />
                 <div className="text-right">
                    <button 
                      type="button" 
                      onClick={() => setShowForgot(true)}
                      className="text-[11px] font-bold text-[#083D41] hover:underline"
                    >
                      Forgot your password?
                    </button>
                 </div>
               </>
             )}

             {error && <ErrorMessage message={error} />}
             {success && <SuccessMessage message={success} />}

             <button className="w-full bg-[#2563EB] text-white py-3.5 rounded-lg font-bold uppercase hover:bg-[#1D4ED8] shadow-lg transition-all flex justify-center">
                {loading ? <Loader2 className="animate-spin" /> : (showForgot ? "Send Reset Link" : "Login")}
             </button>

             {showForgot && (
               <button 
                 type="button" 
                 onClick={() => setShowForgot(false)}
                 className="flex items-center gap-2 text-slate-500 text-xs font-bold mx-auto mt-4 hover:text-[#2563EB]"
               >
                 <ArrowLeft size={14} /> Back to Login
               </button>
             )}
          </form>
        </div>

        {/* --- RIGHT SIDE: SIGN UP --- */}
        <div className={`w-1/2 ml-auto p-12 flex flex-col justify-center items-center transition-opacity duration-700 ${!isLoginActive ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Register With</h2>
          <SocialLinks />
          <p className="text-slate-400 text-xs mb-6 uppercase font-bold tracking-tighter">FILL OUT THE FOLLOWING INFO</p>
          
          <form onSubmit={handleSubmit} className="w-full space-y-3">
             <RoleSelector activeRole={role} setRole={setRole} />
             <Input icon={<User size={18}/>} type="text" name="name" placeholder="Full Name" onChange={handleChange} />
             <Input icon={<Mail size={18}/>} type="email" name="email" placeholder="Email Address" onChange={handleChange} />
             <Input icon={<Lock size={18}/>} type="password" name="password" placeholder="Create Password" onChange={handleChange} />
             
             {error && <ErrorMessage message={error} />}
             <button className="w-full bg-[#2563EB] text-white py-3.5 rounded-lg font-bold uppercase hover:bg-[#1D4ED8] shadow-lg transition-all flex justify-center mt-4">
                {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- UPDATED ROLE SELECTOR WITH COORDINATOR ---
function RoleSelector({ activeRole, setRole }) {
  const roles = [
    { id: 'learner', label: 'Learner' },
    { id: 'educator', label: 'Educator' },
    { id: 'coordinator', label: 'Coordinator' }
  ];

  return (
    <div className="flex gap-1.5 mb-2 bg-slate-100 p-1 rounded-lg">
      {roles.map((r) => (
        <button 
          key={r.id} 
          type="button" 
          onClick={() => setRole(r.id)}
          className={`flex-1 py-2 text-[9px] uppercase font-black rounded transition-all ${activeRole === r.id ? 'bg-[#1E293B] text-white shadow-sm' : 'text-slate-400'}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

// Helper components
function SocialLinks() {
  const handleSocialLogin = (provider) => {
    // Redirect directly to your backend's auth endpoint
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="flex gap-3 mb-6">
      <SocialButton Icon={Facebook} onClick={() => handleSocialLogin('facebook')} />
      <SocialButton Icon={Github} onClick={() => handleSocialLogin('github')} />
      <SocialButton Icon={Linkedin} onClick={() => handleSocialLogin('linkedin')} />
      
      {/* Google Button */}
      <div 
        onClick={() => handleSocialLogin('google')}
        className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 cursor-pointer text-sm transition-all active:scale-95"
      >
        G+
      </div>
    </div>
  );
}

// Sub-component for cleaner code
function SocialButton({ Icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
    >
      <Icon size={18} />
    </div>
  );
}

function Input({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB]">{icon}</div>
      <input 
        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-md outline-none focus:ring-2 focus:ring-[#A4B602] focus:bg-white transition-all text-sm" 
        {...props} 
        required 
      />
    </div>
  );
}

function ErrorMessage({ message }) {
  return <div className="flex items-center gap-2 text-red-600 text-[11px] font-bold py-1 bg-red-50 px-3 rounded"><AlertCircle size={14}/> {message}</div>;
}

function SuccessMessage({ message }) {
  return <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold py-1 bg-emerald-50 px-3 rounded"><CheckCircle2 size={14}/> {message}</div>;
}