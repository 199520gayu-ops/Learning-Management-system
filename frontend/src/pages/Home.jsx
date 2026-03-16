import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import courses from "../data/coursesdata";
import certifications from "../data/certifications";
import { CartContext } from "../context/CartContext";
import HeroSlider from "../components/HeroSlider";
import CoursesSection from "../components/CoursesSection";
import Chatbot from "../components/Chatbot";
import Checkout from "../pages/Checkout";

import {
  Search,
  ShoppingCart,
  ChevronDown,
  Globe,
  Award,
  BookOpen,
  Users,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  BarChart3,
  Code2,
  Cpu,
  Palette,
  Database,
  BrainCircuit,
  GitMerge,
  BadgeCheck,
  Layers3,
  Sparkles,
  GraduationCap,
  Briefcase,
  Target,
  Zap,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

/* ══════════════════════════════════════════════════
   CATEGORY PILL ROW  (below navbar, not a marquee)
══════════════════════════════════════════════════ */
const categoryPills = [
  { icon: <Code2 size={13} />,        label: "Development" },
  { icon: <BrainCircuit size={13} />, label: "AI & ML" },
  { icon: <BarChart3 size={13} />,    label: "Data Science" },
  { icon: <Palette size={13} />,      label: "Design" },
  { icon: <Database size={13} />,     label: "Databases" },
  { icon: <GitMerge size={13} />,     label: "DevOps" },
  { icon: <Cpu size={13} />,          label: "Cloud" },
  { icon: <Shield size={13} />,       label: "Security" },
  { icon: <Briefcase size={13} />,    label: "Business" },
];

const CategoryPillRow = ({ onCategoryClick }) => (
  <div className="bg-white border-b border-blue-100">
    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {categoryPills.map(({ icon, label }) => (
        <button
          key={label}
          onClick={() => onCategoryClick?.(label)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600
                     bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100
                     hover:border-blue-600 rounded-lg px-3.5 py-2 whitespace-nowrap
                     transition-all duration-200 shrink-0"
        >
          {icon} {label}
        </button>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════
   TRUST / STATS SECTION  (integrated into page, not a bar)
══════════════════════════════════════════════════ */
const trustStats = [
  { icon: <Users size={22} className="text-blue-600" />,        val: "50,000+",  label: "Active Learners",        sub: "Across 30+ countries" },
  { icon: <BookOpen size={22} className="text-blue-600" />,     val: "200+",     label: "Expert-Led Courses",     sub: "Updated every quarter" },
  { icon: <BadgeCheck size={22} className="text-blue-600" />,   val: "15,000+",  label: "Certificates Issued",    sub: "Industry recognised" },
  { icon: <Star size={22} className="text-blue-600" />,         val: "4.9 / 5",  label: "Average Rating",         sub: "From verified learners" },
];

const TrustSection = () => (
  <section className="bg-white border-y border-blue-100 py-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustStats.map(({ icon, val, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
              <span className="group-hover:[&>svg]:text-white transition-colors">{icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-blue-900 leading-tight">{val}</p>
            <div>
              <p className="text-xs font-bold text-blue-700">{label}</p>
              <p className="text-[10px] text-blue-300 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   CERTIFICATION CARD
══════════════════════════════════════════════════ */
const CertCard = ({ cert, t, onBuy }) => (
  <div
    className="bg-white rounded-2xl border border-blue-100 overflow-hidden
               hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1.5
               transition-all duration-300 group flex flex-col"
  >
    <div className="relative overflow-hidden h-44">
      <img
        src={cert.image}
        alt={cert.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-100 shadow-sm">
          <BadgeCheck size={10} /> Certification
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h4 className="font-bold text-blue-900 text-sm mb-1.5 line-clamp-2 leading-snug flex-1">
        {cert.title}
      </h4>
      <p className="text-[11px] text-blue-400 mb-4 flex items-center gap-1.5">
        <GraduationCap size={11} className="text-blue-400" />
        {cert.provider}
      </p>
      <button
        onClick={onBuy}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
                   text-white text-xs font-bold transition-all shadow-sm shadow-blue-200
                   flex items-center justify-center gap-1.5 group/btn"
      >
        {t.getCertified}
        <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════
   PRICING CARD
══════════════════════════════════════════════════ */
const PricingCard = ({ name, subtitle, price, features, cta, highlight, badge, onClick, t }) => (
  <div
    className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300
      ${highlight
        ? "bg-blue-600 shadow-2xl shadow-blue-200 border-2 border-blue-500 scale-[1.03] z-10"
        : "bg-white border border-blue-100 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-1"
      }`}
  >
    {badge && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1 bg-white text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg border border-blue-100 uppercase tracking-widest">
          <Sparkles size={9} /> {badge}
        </span>
      </div>
    )}

    <div className="mb-6">
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${highlight ? "text-blue-200" : "text-blue-400"}`}>
        {name}
      </p>
      <p className={`text-xs mb-5 ${highlight ? "text-blue-100" : "text-blue-400"}`}>{subtitle}</p>
      <div className="flex items-end gap-1">
        <span className={`text-4xl font-black ${highlight ? "text-white" : "text-blue-900"}`}>{price}</span>
        <span className={`text-sm mb-1 font-medium ${highlight ? "text-blue-200" : "text-blue-400"}`}>/mo</span>
      </div>
    </div>

    <ul className="space-y-3 mb-8 flex-1">
      {features.map(({ label, included }) => (
        <li
          key={label}
          className={`flex items-center gap-3 text-sm ${!included ? "opacity-30" : ""}`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
              ${included
                ? highlight ? "bg-white/20" : "bg-blue-50 border border-blue-200"
                : "bg-blue-50/30 border border-blue-100"
              }`}
          >
            <CheckCircle2
              size={11}
              className={included ? (highlight ? "text-white" : "text-blue-500") : "text-blue-200"}
            />
          </div>
          <span className={highlight ? "text-blue-100" : "text-blue-700"}>{label}</span>
        </li>
      ))}
    </ul>

    <button
      onClick={onClick}
      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
        ${highlight
          ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
        }`}
    >
      {cta} <ChevronRight size={14} />
    </button>
  </div>
);

/* ══════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();

  const [openExplore, setOpenExplore] = useState(false);
  const [language, setLanguage] = useState("English");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const wrapperRef = useRef(null);
  const coursesRef = useRef(null);
  const plansRef = useRef(null);
  const certificationsRef = useRef(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setOpenExplore(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  /* ── TRANSLATIONS ── */
  const translations = {
    English: {
      explore: "Explore", plans: "Plans & Pricing", login: "Login", signup: "Sign Up",
      searchPlaceholder: "Search courses, topics, instructors...",
      courses: "Courses", certifications: "Certifications",
      certTitle: "Professional Certifications",
      certSub: "Earn industry-recognised credentials to accelerate your career growth.",
      getCertified: "Get Certified", viewMoreCerts: "View More Certifications",
      plansPricingTitle: "Simple, Transparent Pricing",
      pricingSub: "Choose the plan that fits your learning journey. No hidden fees.",
      basic: "Starter", pro: "Pro", enterprise: "Enterprise",
      basicSub: "Perfect for beginners", teamsSub: "For growing teams", mostPopular: "Most Popular",
      limitedCourses: "Up to 5 courses", communityAccess: "Community access",
      certificates: "Certificates", unlimitedCourses: "Unlimited courses",
      prioritySupport: "Priority support", teamAccess: "Team access (up to 20)",
      adminDashboard: "Admin dashboard", customReports: "Custom analytics",
      getStarted: "Get Started", subscribeNow: "Start Learning", contactSales: "Talk to Sales",
      currency: "₹", perMonth: "/ month",
    },
    Tamil: {
      explore: "ஆராயுங்கள்", plans: "திட்டங்கள் & விலை", login: "உள்நுழைவு", signup: "பதிவு",
      searchPlaceholder: "பாடங்களை தேடுங்கள்...",
      courses: "பாடங்கள்", certifications: "சான்றிதழ்கள்",
      certTitle: "தொழில்முறை சான்றிதழ்கள்",
      certSub: "தொழில் வளர்ச்சிக்கான தொழில்துறை அங்கீகாரம் பெற்ற சான்றிதழ்கள் பெறுங்கள்.",
      getCertified: "சான்றிதழ் பெறுங்கள்", viewMoreCerts: "மேலும் காண்க",
      plansPricingTitle: "எளிய, வெளிப்படையான விலை",
      pricingSub: "உங்கள் கற்றல் பயணத்திற்கு பொருந்தும் திட்டத்தைத் தேர்ந்தெடுக்கவும்.",
      basic: "ஸ்டார்டர்", pro: "புரோ", enterprise: "என்டர்பிரைஸ்",
      basicSub: "ஆரம்பத்திற்கு ஏற்றது", teamsSub: "குழுக்களுக்காக", mostPopular: "மிகவும் பிரபலமானது",
      limitedCourses: "5 பாடங்கள் வரை", communityAccess: "சமூக அணுகல்",
      certificates: "சான்றிதழ்கள்", unlimitedCourses: "வரம்பற்ற பாடங்கள்",
      prioritySupport: "முன்னுரிமை ஆதரவு", teamAccess: "குழு அணுகல்",
      adminDashboard: "நிர்வாக டேஷ்போர்ட்", customReports: "தனிப்பயன் அறிக்கைகள்",
      getStarted: "தொடங்கவும்", subscribeNow: "கற்றல் தொடங்கவும்", contactSales: "விற்பனை தொடர்பு",
      currency: "₹", perMonth: "/ மாதம்",
    },
    Hindi: {
      explore: "खोजें", plans: "योजनाएँ और मूल्य", login: "लॉगिन", signup: "साइन अप",
      searchPlaceholder: "कोर्स, विषय, प्रशिक्षक खोजें...",
      courses: "कोर्स", certifications: "सर्टिफिकेशन",
      certTitle: "व्यावसायिक सर्टिफिकेशन",
      certSub: "अपने करियर को गति देने के लिए उद्योग-मान्यता प्राप्त क्रेडेंशियल अर्जित करें।",
      getCertified: "सर्टिफिकेट लें", viewMoreCerts: "और सर्टिफिकेशन देखें",
      plansPricingTitle: "सरल, पारदर्शी मूल्य निर्धारण",
      pricingSub: "अपनी सीखने की यात्रा के लिए सही योजना चुनें। कोई छिपे शुल्क नहीं।",
      basic: "स्टार्टर", pro: "प्रो", enterprise: "एंटरप्राइज",
      basicSub: "शुरुआत के लिए परफेक्ट", teamsSub: "बढ़ती टीमों के लिए", mostPopular: "सबसे लोकप्रिय",
      limitedCourses: "5 कोर्स तक", communityAccess: "सामुदायिक पहुंच",
      certificates: "सर्टिफिकेट", unlimitedCourses: "असीमित कोर्स",
      prioritySupport: "प्राथमिकता समर्थन", teamAccess: "टीम पहुंच",
      adminDashboard: "व्यवस्थापक डैशबोर्ड", customReports: "कस्टम रिपोर्ट",
      getStarted: "शुरू करें", subscribeNow: "सीखना शुरू करें", contactSales: "बिक्री से संपर्क करें",
      currency: "₹", perMonth: "/ महीना",
    },
  };
  const t = translations[language];

  const visibleCerts = showAll ? certifications : certifications.slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenExplore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const planItems = {
  basic:      { id: "plan-basic",      title: "Starter Plan",     price: 499,  type: "plan" },
  pro:        { id: "plan-pro",        title: "Pro Plan",         price: 999,  type: "plan" },
  enterprise: { id: "plan-enterprise", title: "Enterprise Plan",  price: 1999, type: "plan" },
};

  const { cart, addToCart, buyNow } = useContext(CartContext);

  const pricingPlans = [
  {
    name: t.basic, subtitle: t.basicSub, price: `${t.currency}499`,
    highlight: false, badge: null, cta: t.getStarted,
    onClick: () => { addToCart(planItems.basic); navigate("/checkout?plan=basic"); },
    features: [
      { label: t.limitedCourses,  included: true },
      { label: t.communityAccess, included: true },
      { label: t.certificates,    included: false },
      { label: t.prioritySupport, included: false },
    ],
  },
  {
    name: t.pro, subtitle: t.mostPopular, price: `${t.currency}999`,
    highlight: true, badge: t.mostPopular, cta: t.subscribeNow,
    onClick: () => { addToCart(planItems.pro); navigate("/checkout?plan=pro"); },
    features: [
      { label: t.unlimitedCourses, included: true },
      { label: t.certificates,     included: true },
      { label: t.prioritySupport,  included: true },
      { label: t.communityAccess,  included: true },
    ],
  },
  {
    name: t.enterprise, subtitle: t.teamsSub, price: `${t.currency}1999`,
    highlight: false, badge: null, cta: t.contactSales,
    onClick: () => { addToCart(planItems.enterprise); navigate("/checkout?plan=enterprise"); },
    features: [
      { label: t.teamAccess,       included: true },
      { label: t.adminDashboard,   included: true },
      { label: t.customReports,    included: true },
      { label: t.prioritySupport,  included: true },
    ],
  },
];

  return (
    <div
      className="min-h-screen bg-white font-sans"
      style={{ fontFamily: "'Noto Sans', 'Noto Sans Tamil', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-[0_1px_12px_rgba(0,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <button
            onClick={() => window.location.href = "/"}
            className="shrink-0 flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <GraduationCap size={14} className="text-white" />
            </div>
            <span className="text-lg font-black text-blue-600 tracking-tight select-none group-hover:text-blue-700 transition-colors">
              Learnify
            </span>
          </button>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative" ref={wrapperRef}>
            <div
              className="flex w-full items-center gap-2 bg-slate-50 border border-slate-200
                         rounded-xl px-4 py-2.5 focus-within:bg-white focus-within:border-blue-400
                         focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200"
            >
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {searchTerm && (
              <div className="absolute top-full left-0 w-full bg-white mt-2 shadow-2xl shadow-blue-100/60 rounded-2xl border border-slate-100 overflow-hidden z-50">
                {filteredCourses.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => { navigate(`/course/${course.id}`); setSearchTerm(""); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors group"
                      >
                        <img
                          src={course.image}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                            {course.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{course.instructor}</p>
                        </div>
                        <span className="text-sm font-extrabold text-blue-600 shrink-0 bg-blue-50 px-2 py-0.5 rounded-lg">
                          {t.currency}{course.price}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search size={24} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-sm text-slate-400">
                      No results for "<span className="text-blue-600 font-semibold">{searchTerm}</span>"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Explore dropdown */}
            <div className="hidden lg:block relative" ref={wrapperRef}>
              <button
                onClick={() => setOpenExplore(!openExplore)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600
                           hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all"
              >
                <Layers3 size={15} className="text-slate-400" />
                {t.explore}
                <ChevronDown
                  size={13}
                  className={`text-slate-400 transition-transform duration-200 ${openExplore ? "rotate-180" : ""}`}
                />
              </button>
              {openExplore && (
                <div className="absolute top-full right-0 bg-white shadow-2xl shadow-blue-100/50 rounded-2xl mt-2 w-56 py-2 border border-slate-100 z-50">
                  {[
                    { label: t.courses,        ref: coursesRef,        icon: <BookOpen size={14} className="text-blue-400" /> },
                    { label: t.plans,          ref: plansRef,          icon: <Target size={14} className="text-blue-400" /> },
                    { label: t.certifications, ref: certificationsRef, icon: <Award size={14} className="text-blue-400" /> },
                  ].map(({ label, ref, icon }) => (
                    <button
                      key={label}
                      onClick={() => scrollTo(ref)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                                 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors">
              <Globe size={14} className="text-slate-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>

            {/* Login */}
            <Link
              to="/login"
              className="hidden lg:block text-sm font-semibold text-slate-600 hover:text-blue-600
                         px-3 py-2 rounded-xl hover:bg-blue-50 transition-all"
            >
              {t.login}
            </Link>

            {/* Sign up */}
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl
                         text-sm font-bold transition-all shadow-sm shadow-blue-200 active:scale-95 ml-1"
            >
              {t.signup}
            </Link>

            {/* Cart */}
            <button
              onClick={() => navigate("/checkout", { state: { cart } })}
              className="relative p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200
                         hover:border-blue-200 rounded-xl transition-all ml-1"
              aria-label="Cart"
            >
              <ShoppingCart size={16} className="text-slate-600" />
              {cart.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px]
                             font-black w-4 h-4 flex items-center justify-center rounded-full
                             border-2 border-white shadow-sm"
                >
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-blue-50 transition ml-1"
            >
              {mobileMenuOpen ? <X size={18} className="text-slate-600" /> : <Menu size={18} className="text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-2">
            {[t.courses, t.plans, t.certifications].map((item, i) => (
              <button
                key={item}
                onClick={() => {
                  scrollTo([coursesRef, plansRef, certificationsRef][i]);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm font-semibold text-slate-600 hover:text-blue-600 py-2 transition-colors"
              >
                {item}
              </button>
            ))}
            <Link to="/login" className="block text-sm font-semibold text-slate-600 hover:text-blue-600 py-2 transition-colors">
              {t.login}
            </Link>
          </div>
        )}
      </nav>

      {/* ══════════ CATEGORY PILL ROW ══════════ */}
      

      {/* ══════════ HERO SLIDER ══════════ */}
      <div className="border-b border-slate-100">
        <HeroSlider />
      </div>

      {/* ══════════ COURSES ══════════ */}
      <div ref={coursesRef} className="bg-white border-b border-slate-100 [&>*:first-child]:pt-0">
        <CoursesSection />
      </div>

      {/* ══════════ CERTIFICATIONS ══════════ */}
      <section ref={certificationsRef} className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Award size={14} className="text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Credentials</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.certTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{t.certSub}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 shrink-0">
              <BadgeCheck size={15} className="text-blue-500" />
              <span className="text-sm font-bold text-blue-700">{certifications.length} Certifications</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
            {visibleCerts.map((cert) => (
              <CertCard
                key={cert.id}
                cert={cert}
                t={t}
                onBuy={() => {
                  buyNow(cert);
                  navigate("/checkout", { state: { cart: [cert] } });
                }}
              />
            ))}
          </div>

          {/* Show more */}
          {!showAll && certifications.length > 4 && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700
                           text-white font-bold text-sm transition-all shadow-md shadow-blue-200"
              >
                {t.viewMoreCerts} <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section ref={plansRef} className="bg-slate-50/60 py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
              <Zap size={12} className="text-blue-500" />
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Pricing</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              {t.plansPricingTitle}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">{t.pricingSub}</p>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-6 items-center max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} t={t} />
            ))}
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-slate-100">
            {[
              { icon: <Shield size={15} className="text-blue-400" />,       text: "Secure Payment" },
              { icon: <Clock size={15} className="text-blue-400" />,        text: "Cancel Anytime" },
              { icon: <BadgeCheck size={15} className="text-blue-400" />,   text: "30-day Money Back" },
              { icon: <Users size={15} className="text-blue-400" />,        text: "50,000+ Learners" },
              { icon: <Sparkles size={15} className="text-blue-400" />,     text: "New Courses Monthly" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}