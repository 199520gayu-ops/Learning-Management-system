import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, FileText, Award, BarChart } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

export default function AcademicRecords() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - In production, this would come from your database
  const transcriptData = {
    gpa: "3.85",
    totalCredits: 124,
    major: "Computer Science",
    records: [
      { id: "CS101", name: "Intro to Programming", grade: "A", credits: 4, sem: "Fall 2025" },
      { id: "DS202", name: "Data Structures", grade: "A-", credits: 4, sem: "Fall 2025" },
      { id: "UX105", name: "Human-Computer Interaction", grade: "B+", credits: 3, sem: "Spring 2026" },
      { id: "MA301", name: "Linear Algebra", grade: "A", credits: 4, sem: "Spring 2026" },
    ]
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 print:hidden">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="flex justify-between items-end mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Academic Transcript</h1>
            <p className="text-slate-500 mt-1">Official record of academic achievement for {user?.name || "Student"}</p>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition">
            <Printer size={18} /> Print Official Copy
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">Cumulative GPA</p>
            <p className="text-3xl font-bold text-indigo-600">{transcriptData.gpa}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">Total Credits</p>
            <p className="text-3xl font-bold text-slate-900">{transcriptData.totalCredits}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">Program Status</p>
            <p className="text-xl font-bold text-emerald-600">Active / Good Standing</p>
          </div>
        </div>

        {/* Transcript Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <FileText className="text-slate-400" />
            <h2 className="font-bold text-lg">Course History</h2>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Course Code</th>
                <th className="px-6 py-4 font-semibold">Course Name</th>
                <th className="px-6 py-4 font-semibold text-center">Credits</th>
                <th className="px-6 py-4 font-semibold text-center">Grade</th>
                <th className="px-6 py-4 font-semibold">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transcriptData.records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{record.id}</td>
                  <td className="px-6 py-4 text-slate-700">{record.name}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{record.credits}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-900">{record.grade}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{record.sem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}