import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import ProfilePanel from "../components/ProfilePanel";


export default function LearnerDashboard() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "React Mastery Bootcamp",
      category: "Frontend",
      progress: 70,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    },
    {
      id: 2,
      title: "Node.js API Development",
      category: "Backend",
      progress: 45,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    {
      id: 3,
      title: "Full Stack MERN Project",
      category: "Full Stack",
      progress: 20,
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex ">
      

      

      <ProfilePanel />
    </div>
  );
}

