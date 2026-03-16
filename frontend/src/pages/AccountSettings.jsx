import React, { useState } from 'react';
import { User, Shield, Save, ArrowLeft, Loader2, Eye, EyeOff, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; // Ensure path is correct

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, updateUserPhoto, updateProfile } = useAuth(); // Hypothesized auth context methods

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  // Initialize photo state from context, or a placeholder
  const [photo, setPhoto] = useState(user?.photoURL || "https://via.placeholder.com/150");

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Profile Picture Upload Handler
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        // Integrate with your backend here: 
        // updateUserPhoto(file); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call structure
    console.log("Submitting:", formData);
    // await updateProfile({ name: formData.name, ... });

    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    alert("Profile changes saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 light:bg-slate-900 transition-colors duration-300 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
      

        <h1 className="text-4xl font-extrabold text-slate-900 light:text-black mb-10">Account Settings</h1>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Picture Card */}
          <div className="lg:col-span-1 bg-blue dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 w-full text-left">Your Profile Picture</h2>
            
            <div className="relative group mb-6">
              <img 
                src={photo} 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-xl group-hover:opacity-80 transition-opacity" 
              />
              <label htmlFor="photoUpload" className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition">
                <Camera size={20} />
                <input id="photoUpload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              JPG or PNG. Max size 5MB. Your photo will be visible across the platform.
            </p>
          </div>

          {/* RIGHT COLUMN: Form Information (Personal + Security) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                <User size={20} className="text-indigo-600" /> Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 opacity-60">Email Address (Read Only)</label>
                  <input type="email" value={formData.email} readOnly className="w-full px-4 py-2.5 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Section 2: Security */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                <Shield size={20} className="text-indigo-600" /> Security & Password
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                  <input name="currentPassword" type="password" onChange={handleInputChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                    <div className="relative">
                      <input name="newPassword" type={showPass ? "text" : "password"} onChange={handleInputChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                    <input name="confirmPassword" type="password" onChange={handleInputChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-3.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/10"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                {loading ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}