import { Search, SlidersHorizontal } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      <div className="flex items-center gap-3 flex-1">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Search your course here..."
          className="outline-none w-full text-sm"
        />
      </div>
      <SlidersHorizontal className="text-gray-500" />
    </div>
  );
}
