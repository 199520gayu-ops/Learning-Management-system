import { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Search,
  SlidersHorizontal,
  Clock,
  Users,
  Zap,
  BadgeCheck,
  BookOpen,
  TrendingUp,
  ArrowRight,
  X,
} from "lucide-react";
import { CartContext } from "../context/CartContext";

const courses = [
  {
    id: 1,
    title: "Complete React Developer Bootcamp",
    instructor: "John Smith",
    rating: 4.7,
    students: "120,543",
    price: 499,
    oldPrice: 3199,
    bestseller: true,
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Full Stack MERN Development",
    instructor: "David Johnson",
    rating: 4.6,
    students: "89,210",
    price: 599,
    oldPrice: 3499,
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Mastering AI & Machine Learning",
    instructor: "Sarah Lee",
    rating: 4.8,
    students: "165,432",
    price: 699,
    oldPrice: 4999,
    bestseller: true,
    category: "AI",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "UI/UX Design Masterclass",
    instructor: "Emma Brown",
    rating: 4.5,
    students: "52,345",
    price: 399,
    oldPrice: 2999,
    category: "Design",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Advanced JavaScript: From Zero to Hero",
    instructor: "Michael Adams",
    rating: 4.9,
    students: "210,000",
    price: 549,
    oldPrice: 3799,
    bestseller: true,
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Python for Data Science & Analytics",
    instructor: "Sophia Wilson",
    rating: 4.8,
    students: "198,765",
    price: 699,
    oldPrice: 4299,
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Next.js 14 – Production Ready Apps",
    instructor: "Daniel Thomas",
    rating: 4.7,
    students: "76,234",
    price: 599,
    oldPrice: 3499,
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    instructor: "Olivia Martinez",
    rating: 4.6,
    students: "54,321",
    price: 449,
    oldPrice: 2999,
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    title: "AWS Cloud Practitioner & Solutions Architect",
    instructor: "Andrew Miller",
    rating: 4.8,
    students: "182,432",
    price: 799,
    oldPrice: 5499,
    bestseller: true,
    category: "Cloud",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    title: "DevOps CI/CD with Docker & Kubernetes",
    instructor: "Robert King",
    rating: 4.7,
    students: "94,210",
    price: 749,
    oldPrice: 4799,
    category: "DevOps",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=800&q=80",
  },
];

/* ─────────────────────────────────────────────────────
   MARQUEE CSS
───────────────────────────────────────────────────── */
const MarqueeStyles = () => (
  <style>{`
    @keyframes card-marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .card-marquee-track {
      display: flex;
      width: max-content;
      animation: card-marquee 14s linear infinite;
    }
    .group:hover .card-marquee-track {
      animation-play-state: paused;
    }
    .courses-slider::-webkit-scrollbar { display: none; }
    .courses-slider { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

/* ─────────────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────────────── */
const RatingStars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < full ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   IN-CARD MARQUEE  (scrolls course key details)
───────────────────────────────────────────────────── */
const CardMarquee = ({ course, discount }) => {
  const items = [
    { icon: <Star size={10} className="text-amber-400 fill-amber-400" />,   text: `${course.rating} Rating` },
    { icon: <Users size={10} className="text-blue-400" />,                  text: `${course.students} Students` },
    { icon: <Clock size={10} className="text-blue-400" />,                  text: "28h Content" },
    { icon: <BadgeCheck size={10} className="text-emerald-500" />,          text: "Certificate" },
    { icon: <Zap size={10} className="text-amber-400" />,                   text: `${discount}% OFF` },
    { icon: <BookOpen size={10} className="text-blue-400" />,               text: course.category },
  ];

  return (
    <div className="relative overflow-hidden bg-blue-50 border-t border-blue-100 py-2">
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none" />
      <div className="card-marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 mx-3 whitespace-nowrap">
            {item.icon}
            {item.text}
            <span className="text-blue-200 mx-1">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   COURSE CARD  — clean, no shadows, marquee inside
───────────────────────────────────────────────────── */
const CourseCard = ({ course, onAddToCart, onBuyNow, onNavigate }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200
                 hover:border-blue-300 transition-all duration-200
                 flex flex-col min-w-[280px] w-[280px] overflow-hidden"
    >
      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden h-40 shrink-0">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Wishlist btn */}
        <button
          onClick={() => setWishlisted(w => !w)}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center
                      border transition-all duration-200
                      ${wishlisted
                        ? "bg-red-500 border-red-500 text-white"
                        : "bg-white/95 border-white/60 text-slate-400 hover:text-red-400"}`}
        >
          <Heart size={12} className={wishlisted ? "fill-white" : ""} />
        </button>

        {/* Bestseller badge */}
        {course.bestseller && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1
                           bg-amber-400 text-amber-900 text-[9px] font-black
                           px-2 py-0.5 rounded-full">
            <Zap size={8} /> Bestseller
          </span>
        )}

        {/* Discount */}
        <span className="absolute bottom-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      </div>

      {/* ── IN-CARD MARQUEE ── */}
      <CardMarquee course={course} discount={discount} />

      {/* ── CONTENT ── */}
      <div className="px-4 pt-3 pb-4 flex flex-col flex-1">

        {/* Category */}
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600
                         bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full w-fit mb-2">
          <BookOpen size={8} /> {course.category}
        </span>

        {/* Title */}
        <h3
          onClick={() => onNavigate(course.id)}
          className="font-bold text-slate-800 text-sm leading-snug line-clamp-2
                     cursor-pointer hover:text-blue-600 transition-colors mb-2"
        >
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
          <BadgeCheck size={11} className="text-blue-400 shrink-0" />
          {course.instructor}
        </p>

        {/* Rating row */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={course.rating} />
          <span className="text-xs font-bold text-amber-500">{course.rating}</span>
          <span className="text-[10px] text-slate-300">({course.students})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base font-extrabold text-slate-900">₹{course.price}</span>
          <span className="text-xs text-slate-300 line-through">₹{course.oldPrice}</span>
          <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            Save ₹{course.oldPrice - course.price}
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAddToCart(course)}
            className="flex-1 flex items-center justify-center gap-1.5
                       bg-blue-600 hover:bg-blue-700 text-white
                       py-2.5 rounded-xl text-xs font-bold
                       transition-colors active:scale-95"
          >
            <ShoppingCart size={12} /> Add to Cart
          </button>
          <button
            onClick={() => onBuyNow(course)}
            className="flex-1 flex items-center justify-center
                       border border-blue-200 bg-blue-50 hover:bg-blue-100
                       text-blue-700 py-2.5 rounded-xl text-xs font-bold
                       transition-colors active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function CoursesSection() {
  const sliderRef = useRef(null);
  const { addToCart, buyNow } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(courses.map((c) => c.category))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollLeft  = () => sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  const handleBuyNow = (course) => {
    buyNow(course);
    navigate("/checkout", { state: { cart: [course] } });
  };

  const bestsellerCount = courses.filter((c) => c.bestseller).length;

  return (
    <section className="bg-white pt-14 pb-16 font-sans">
      <MarqueeStyles />
      <div className="max-w-7xl mx-auto px-6">

        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <TrendingUp size={14} className="text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Top Rated Courses
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Learn from the <span className="text-blue-600">best instructors</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
              Join 200,000+ students mastering in-demand skills across tech, design, data & more.
            </p>
          </div>

          {/* Slider nav + stats */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
              <Zap size={13} className="text-amber-500" />
              <span className="text-xs font-bold text-slate-700">{bestsellerCount} Bestsellers</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200
                           hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600
                           transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 border border-blue-600
                           hover:bg-blue-700 text-white transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── SEARCH & FILTER BAR ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          {/* Search */}
          <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3
                          focus-within:bg-white focus-within:border-blue-400
                          focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3
                          hover:border-blue-300 transition-all min-w-[180px]">
            <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold text-slate-600 outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Active filter badge */}
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-600
                         text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-100 transition-all shrink-0"
            >
              {selectedCategory} <X size={11} />
            </button>
          )}
        </div>

        {/* ── CATEGORY TABS ── */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
                ${selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── COURSE SLIDER ── */}
        {filteredCourses.length > 0 ? (
          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-4 w-10  z-10 pointer-events-none rounded-l-2xl" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-4 w-10  z-10 pointer-events-none rounded-r-2xl" />

            <div
              ref={sliderRef}
              className="courses-slider flex gap-5 overflow-x-auto scroll-smooth pb-4"
            >
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onAddToCart={addToCart}
                  onBuyNow={handleBuyNow}
                  onNavigate={(id) => navigate(`/course/${id}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Search size={24} className="text-blue-300" />
            </div>
            <p className="text-base font-bold text-slate-600 mb-1">No courses found</p>
            <p className="text-sm text-slate-400 mb-4">
              Try a different keyword or clear the filters.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              Clear Filters <X size={12} />
            </button>
          </div>
        )}

        {/* ── VIEW ALL CTA ── */}
        <div className="flex items-center justify-center mt-8">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 bg-white border border-blue-200 hover:border-blue-400
                       hover:bg-blue-50 text-blue-700 text-sm font-bold px-6 py-3 rounded-xl
                       transition-all group"
          >
            Browse All {courses.length} Courses
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}