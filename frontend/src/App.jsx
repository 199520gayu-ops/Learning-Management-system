import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EducatorDashboard from "./pages/EducatorDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import StudyPlans from "./pages/Lessons";
import Assignments from "./pages/Assignments";
import Submissions from "./pages/Submissions";
import ProtectedRoute, { RoleProtectedRoute } from "./components/ProtectedRoute";
import LearnerDashboard from "./components/LearnerDashboard";
import SocialSuccess from "./components/SocialSuccess";
import AcademicRecords from "./pages/AcademicRecords";


import { AuthProvider } from "./context/AuthContext"; 
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Pay from "./pages/Pay";
import Success from "./pages/Success";
import About from "./pages/About";
import HeroSlider from "./components/HeroSlider";
import CoursesSection from './components/CoursesSection';
import { CartProvider } from "./context/CartContext";
import CertificateView from "./pages/CertificateView";
import Inbox from "./pages/Inbox";
import Lessons from "./pages/Lessons";
import Groups from "./pages/Groups";
import AccountSettings from "./pages/AccountSettings";
import MyCertificates from "./pages/MyCertificates";
import LessonDashboard from "./pages/LessonDashboard";
import MyCourses from "./components/MyCourses";
import Students from "./components/Students";
import ReviewAssignments from "./pages/ReviewAssignments";
import InstructorFullDashboard from "./components/InstructorFullDashboard";
import Chatbot from "./components/Chatbot";
import StudyPlanPage from "./components/StudyPlanPage";
import DiscussionForum from "./pages/DiscussionForum";



export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 🌐 Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔐 Protected - Learner Dashboard */}
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['learner']}>
                  <Dashboard />
                </RoleProtectedRoute>
              }
            />

            {/* 🔐 Protected - Educator Dashboard */}
            <Route
              path="/educator-dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['educator']}>
                  <EducatorDashboard />
                </RoleProtectedRoute>
              }
            />

            {/* 🔐 Protected - Coordinator Dashboard */}
            <Route
              path="/coordinator-dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['coordinator']}>
                  <CoordinatorDashboard />
                </RoleProtectedRoute>
              }
            />
            
            {/* 🔐 Protected - Other Routes */}
            <Route
              path="/assignments"
              element={<ProtectedRoute><Assignments /></ProtectedRoute>}
            />
            <Route
              path="/submissions"
              element={<ProtectedRoute><Submissions /></ProtectedRoute>}
            />
            
            {/* 🌐 Semi-Public */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/success" element={<Success />} />
            <Route path="/about" element={<About />} />
            <Route path="/hero" element={<HeroSlider />} />
            <Route path="/courses" element={<CoursesSection />} />
            <Route path="/learner-dashboard" element={<LearnerDashboard />} />
            <Route path="/certificateView" element={<MyCertificates />} />
            <Route path="/certificateView/:id" element={<CertificateView />} />
            <Route path="/inbox" element={<Inbox/>} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/course/:id" element={<CoursesSection />} />
            <Route path="/social-success" element={<SocialSuccess />} />
            <Route path="/academic-records" element={<AcademicRecords />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/lesson-dashboard" element={<LessonDashboard />} />
            <Route path="/mycourses" element={<MyCourses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/review-assignments" element={<ReviewAssignments />} />
            <Route path="/instructor-dashboard" element={<InstructorFullDashboard />} />
            <Route path="chat" element={<Chatbot />} />
            <Route path="/studyplanpage" element={<StudyPlanPage/>}/>
            <Route path="/discussion" element={<DiscussionForum/>}/>
            
          </Routes>
          
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}

