import { useNavigate } from "react-router-dom";
import { icons } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();
  const ArrowLeft = icons["ArrowLeft"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold
                     hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </button>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-600">Your courses are now unlocked.</p>
      </div>
    </div>
  );
}