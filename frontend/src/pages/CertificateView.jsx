import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CertificateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certData, setCertData] = useState(null);

  useEffect(() => {
    const mockDb = [
      { id: "DS-9921", course: "Data Science Mastery", issuedBy: "Learnify Academy" },
      { id: "UX-4410", course: "UI/UX Design Essentials", issuedBy: "Learnify Academy" }
    ];
    const found = mockDb.find(c => c.id === id);
    setCertData({
      name: user?.name || "Student Name",
      course: found ? found.course : "Course Not Found",
      issuedBy: found ? found.issuedBy : "Learnify Academy",
      // Set to current date or a fixed date as needed
      issueDate: "2nd March 2026", 
      certificateId: id
    });
  }, [id, user]);

  if (!certData) return <div className="p-10 text-center">Loading certificate...</div>;

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center py-10 px-4 font-serif">
      {/* Navigation - Hidden on Print */}
      <div className="w-full max-w-[900px] mb-6 print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
      </div>

      {/* CERTIFICATE CARD */}
      {/* Parchment background and Double Border */}
      <div id="certificate" className="w-[900px] h-[630px] bg-[#fdfbf7] relative shadow-2xl border-[15px] border-double border-[#2c3e50] p-12 overflow-hidden text-[#1e293b]">
        
        {/* Decorative Gold Seal */}
        <div className="absolute top-10 right-10 w-24 h-24 border-2 border-yellow-700 bg-yellow-100/50 rounded-full flex items-center justify-center rotate-12 shadow-lg">
           <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest text-center">Official Seal</span>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-xl italic text-slate-600 font-serif">Learnify Academy proudly presents this</h2>
          <h1 className="text-6xl font-bold tracking-tighter text-[#2c3e50] mt-4 uppercase underline decoration-yellow-700 decoration-4 underline-offset-8">Certificate</h1>
        </div>

        {/* Name and Course */}
        <div className="text-center mt-12">
          <p className="text-xl mb-4 italic">To certify that</p>
          <h2 className="text-5xl font-bold border-b border-slate-300 inline-block px-10 pb-4">{certData.name}</h2>
          <p className="text-xl mt-6 italic">Has successfully completed the requirements for</p>
          <h3 className="text-4xl font-bold text-[#2c3e50] mt-3 uppercase">{certData.course}</h3>
        </div>

        {/* Signature & Date Block */}
        <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
          
          {/* Signature 1 */}
          <div className="text-center w-64">
            <div className="mb-2 h-16 flex items-end justify-center">
              {/* You can replace this with an image tag for a real signature file */}
              <p className="font-['Dancing_Script',_cursive] text-3xl italic text-slate-800">Sarah Jenkins</p>
            </div>
            <div className="border-t-2 border-[#2c3e50] w-full"></div>
            <p className="text-sm font-bold mt-2">Director of Education</p>
          </div>

          {/* Date */}
          <div className="text-center">
             <p className="text-sm border-b-2 border-slate-300 pb-1">{certData.issueDate}</p>
             <p className="text-xs font-bold mt-2">Issue Date</p>
          </div>

          {/* Signature 2 */}
          <div className="text-center w-64">
            <div className="mb-2 h-16 flex items-end justify-center">
               <p className="font-['Dancing_Script',_cursive] text-3xl italic text-slate-800">Dr. Alan Turing</p>
            </div>
            <div className="border-t-2 border-[#2c3e50] w-full"></div>
            <p className="text-sm font-bold mt-2">Course Instructor</p>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-4 left-6 text-[10px] text-slate-400 font-sans">Verification ID: {certData.certificateId}</p>
      </div>

      {/* Action Area */}
      <div className="mt-8 print:hidden flex gap-4">
        <button onClick={() => window.print()} className="bg-[#2c3e50] text-white px-8 py-3 rounded shadow-lg hover:bg-slate-900 transition">
          Print / Download Certificate
        </button>
      </div>
    </div>
  );
}