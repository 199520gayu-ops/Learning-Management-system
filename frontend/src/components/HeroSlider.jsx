import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
  BookOpen,
  BadgeCheck,
  Star,
  Play,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Confidently Build",
    titleBlue: "Your Career",
    desc: "Take the next step with in-demand skills in tech, design, data, and business — taught by real industry experts.",
    btn: "Explore Courses",
    link: "/courses",
    tag: "Career Growth",
    badge: "🔥 10,000+ enrolled this week",
    stats: [
      { icon: <BookOpen size={14} />,  val: "200+",  label: "Courses" },
      { icon: <Users size={14} />,     val: "50K+",  label: "Learners" },
      { icon: <Star size={14} className="fill-amber-400 text-amber-400" />, val: "4.9", label: "Rating" },
    ],
    bullets: ["Job-ready curriculum", "Learn at your pace", "Lifetime access"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    id: 2,
    title: "Learn From",
    titleBlue: "Industry Experts",
    desc: "Real-world courses taught by professionals actively working in the field — not just academics.",
    btn: "Start Learning",
    link: "/login",
    tag: "Expert-Led",
    badge: "✨ New courses added weekly",
    stats: [
      { icon: <BadgeCheck size={14} />, val: "15K+",   label: "Certificates" },
      { icon: <Zap size={14} />,        val: "98%",    label: "Completion" },
      { icon: <Award size={14} />,      val: "Top 1%", label: "Instructors" },
    ],
    bullets: ["Verified instructors", "Real-world projects", "Industry certificates"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-500 to-blue-700",
  },
  {
    id: 3,
    title: "Upgrade Your",
    titleBlue: "Skills Today",
    desc: "AI, Web Development, Cloud, Data Science & more — all in one platform. Learn at your own pace, anytime.",
    btn: "View Programs",
    link: "/courses",
    tag: "Skill Building",
    badge: "🎓 Certificate on completion",
    stats: [
      { icon: <TrendingUp size={14} />, val: "3×",    label: "Faster Learning" },
      { icon: <Play size={14} />,       val: "500h+", label: "Video Content" },
      { icon: <Users size={14} />,      val: "30+",   label: "Countries" },
    ],
    bullets: ["Self-paced learning", "500+ hours of video", "Global community"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    accent: "from-indigo-600 to-blue-600",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex(index === 0 ? slides.length - 1 : index - 1);
  const slide = slides[index];

  return (
    <section className="relative w-full bg-white overflow-hidden">

      {/* ── DECORATIVE RIGHT BG ── */}
      <div className="absolute top-0 right-0 w-[100%] h-full bg-gradient-to-bl from-blue-50 to-white hidden lg:block pointer-events-none" />

      {/* ── SLIDE ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16
                     grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center
                     py-14 lg:py-5"
        >

          {/* ══════════════════════════════════
              LEFT  — all content
          ══════════════════════════════════ */}
          <div className="flex flex-col gap-6">

            {/* ① Tag + badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white
                               text-[10px] font-black tracking-widest uppercase
                               px-3.5 py-1.5 rounded-full">
                <Zap size={9} /> {slide.tag}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{slide.badge}</span>
            </div>

            {/* ② Title — two-line split for clean break */}
            <div className="space-y-1">
              <h1 className="text-[2.6rem] md:text-5xl font-black text-slate-900
                             leading-[1.1] tracking-tight">
                {slide.title}
              </h1>
              <h1 className="text-[2.6rem] md:text-5xl font-black text-blue-600
                             leading-[1.1] tracking-tight">
                {slide.titleBlue}
              </h1>
            </div>

            {/* ③ Description */}
            <p className="text-[15px] text-slate-500 leading-[1.75] max-w-[440px]">
              {slide.desc}
            </p>

            {/* ④ Bullet points */}
            <ul className="space-y-2">
              {slide.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <CheckCircle2 size={15} className="text-blue-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            {/* ⑤ Stats — clean card grid */}
            <div className="grid grid-cols-3 gap-3">
              {slide.stats.map(({ icon, val, label }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 bg-blue-50 border border-blue-100
                             rounded-2xl px-4 py-3.5"
                >
                  <span className="text-blue-500">{icon}</span>
                  <p className="text-lg font-extrabold text-slate-900 leading-none">{val}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none">{label}</p>
                </div>
              ))}
            </div>

            {/* ⑥ CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                           text-white px-7 py-3.5 rounded-xl font-bold text-sm
                           transition-all active:scale-95"
              >
                {slide.btn} <ArrowRight size={15} />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 border border-slate-200
                           hover:border-blue-300 hover:bg-blue-50 bg-white
                           text-slate-600 hover:text-blue-700
                           px-6 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                <Play size={13} className="text-blue-500" /> Watch Demo
              </Link>
            </div>

            {/* ⑦ Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-blue-500",   letter: "A" },
                  { bg: "bg-indigo-400", letter: "B" },
                  { bg: "bg-blue-400",   letter: "C" },
                  { bg: "bg-blue-600",   letter: "D" },
                ].map(({ bg, letter }, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white
                                           flex items-center justify-center shrink-0`}>
                    <span className="text-white text-[9px] font-bold">{letter}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-bold text-slate-800">50,000+</span> learners already enrolled
              </p>
            </div>

          </div>

          {/* ══════════════════════════════════
              RIGHT  — image
          ══════════════════════════════════ */}
          <div className="relative hidden lg:flex items-center justify-center">

            {/* Blur blob */}
            <div className={`absolute -inset-6 bg-gradient-to-br ${slide.accent}
                             opacity-20 blur-3xl rounded-3xl pointer-events-none`} />

            {/* Image container */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[380px] object-cover"
              />

              {/* Bottom scrim */}
              <div className="absolute bottom-0 left-0 right-0 h-28
                              bg-gradient-to-t from-black/35 to-transparent" />

              {/* Float card — bottom left: Certificate */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md
                              border border-white/80 rounded-2xl px-4 py-3
                              flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 leading-none">
                    Certificate Included
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-none">
                    Industry recognised
                  </p>
                </div>
              </div>

              {/* Float card — top right: Learners */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md
                              border border-white/80 rounded-2xl px-3.5 py-1
                              flex items-center gap-2.5">
                <div className="flex -space-x-1.5">
                  {["bg-blue-400", "bg-indigo-400", "bg-blue-600"].map((c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 leading-none">50,000+</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Active learners</p>
                </div>
              </div>

              {/* Float badge — top left: Rating */}
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md
                              border border-white/80 rounded-2xl px-3 py-2
                              flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100
                                flex items-center justify-center shrink-0">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 leading-none">4.9 / 5</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-none">12K+ reviews</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── PROGRESS BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-100">
        <motion.div
          key={index}
          className="h-full bg-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>

      {/* ── PREV ── */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                   bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50
                   flex items-center justify-center text-slate-500 hover:text-blue-600
                   transition-all z-20"
      >
        <ChevronLeft size={18} />
      </button>

      {/* ── NEXT ── */}
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                   bg-blue-50 hover:bg-blue-700
                   flex items-center justify-center text-black
                   transition-all z-20"
      >
        <ChevronRight size={18} />
      </button>

      {/* ── DOTS ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300
              ${index === i
                ? "w-6 h-2 bg-blue-600"
                : "w-2 h-2 bg-slate-300 hover:bg-blue-300"
              }`}
          />
        ))}
      </div>

      {/* ── COUNTER ── */}
      <div className="absolute bottom-3 right-6 text-[10px] font-bold text-slate-400 tabular-nums z-20">
        {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

    </section>
  );
}