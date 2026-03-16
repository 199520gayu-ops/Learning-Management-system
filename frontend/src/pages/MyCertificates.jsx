import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  Download,
  ShieldCheck,
  Search,
  Calendar,
  BookOpen,
} from "lucide-react";

export default function MyCertificates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated data (since backend is not working)
  const dummyCertificates = [
    {
      id: "DS-9921",
      title: "Data Science Mastery",
      date: "Oct 12, 2023",
      issuer: "Learnify Academy",
      status: "Verified",
      type: "Certification",
    },
    {
      id: "UX-4410",
      title: "UI/UX Design Essentials",
      date: "Dec 04, 2023",
      issuer: "Learnify Academy",
      status: "Verified",
      type: "Certification",
    },
    {
      id: "PY-1102",
      title: "Advanced Python Core",
      date: "Jan 15, 2024",
      issuer: "Learnify Academy",
      status: "Pending",
      type: "Course",
    },
  ];

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setCertificates(dummyCertificates);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter logic
  const filtered = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || c.status === filter)
  );

 ;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Your Certificates & Achievements
          </h1>
          <p className="text-slate-500 mt-2">
            Manage, verify, and share your professional accomplishments.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Earned",
              value: certificates.length,
              icon: Award,
              color: "text-indigo-600",
            },
            {
              label: "Verified",
              value: certificates.filter((c) => c.status === "Verified").length,
              icon: ShieldCheck,
              color: "text-emerald-600",
            },
            {
              label: "Active Learning",
              value: "2",
              icon: BookOpen,
              color: "text-amber-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4"
            >
              <div
                className={`p-3 rounded-xl bg-slate-100 ${stat.color}`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {["All", "Verified", "Pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white border text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white"
              placeholder="Search by title..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Certificate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded">
                    {cert.type}
                  </span>

                  {cert.status === "Verified" && (
                    <ShieldCheck className="text-emerald-500" size={20} />
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2">{cert.title}</h3>

                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Calendar size={14} />
                  <span>Issued {cert.date}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 flex gap-2">
                <button
                  onClick={() => navigate(`/certificateView/${cert.id}`)}
                  className="flex-1 py-2 text-sm font-semibold bg-white border rounded-lg hover:border-indigo-600 hover:text-indigo-600"
                >
                  View Certificate
                </button>

                <button className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-100">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}