import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import {
  ShoppingCart,
  GraduationCap,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
  Star,
  Users,
  LayoutDashboard,
  BarChart3,
  Headphones,
  BookOpen,
  Infinity,
  ArrowRight,
  Receipt,
  Lock,
  PartyPopper,
  ChevronRight,
} from "lucide-react";

/* ── Plan feature icon map ── */
const featureIconMap = {
  "Up to 5 courses":        <BookOpen size={13} />,
  "Community access":       <Users size={13} />,
  "Unlimited courses":      <Infinity size={13} />,
  "Certificates":           <BadgeCheck size={13} />,
  "Priority support":       <Headphones size={13} />,
  "Team access (up to 20)": <Users size={13} />,
  "Admin dashboard":        <LayoutDashboard size={13} />,
  "Custom analytics":       <BarChart3 size={13} />,
};

/* ── Plan definitions ── */
const PLAN_DETAILS = {
  basic: {
    id: "plan-basic",
    title: "Starter Plan",
    subtitle: "Perfect for beginners",
    price: 499,
    type: "plan",
    image: null,
    features: ["Up to 5 courses", "Community access"],
  },
  pro: {
    id: "plan-pro",
    title: "Pro Plan",
    subtitle: "Most Popular",
    price: 999,
    type: "plan",
    image: null,
    features: ["Unlimited courses", "Certificates", "Priority support", "Community access"],
  },
  enterprise: {
    id: "plan-enterprise",
    title: "Enterprise Plan",
    subtitle: "For growing teams",
    price: 1999,
    type: "plan",
    image: null,
    features: ["Team access (up to 20)", "Admin dashboard", "Custom analytics", "Priority support"],
  },
};

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart: contextCart } = useContext(CartContext);

  /* ── Resolve cart: ?plan= → state.cart → context cart ── */
  const planKey = searchParams.get("plan");
  const planItem = planKey ? PLAN_DETAILS[planKey] : null;

  const cart = planItem
    ? [planItem]
    : state?.cart?.length
    ? state.cart
    : contextCart;

  const subtotal     = cart.reduce((sum, item) => sum + item.price, 0);
  const gst          = subtotal * 0.18;
  const platformFee  = 29;
  const total        = subtotal + gst + platformFee;

  const isPlan = cart.length === 1 && cart[0]?.type === "plan";

  return (
    <div className="min-h-screen bg-blue-50/40 py-14 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

        {/* ══════════ LEFT — ORDER DETAILS ══════════ */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-1">
                <Receipt size={11} className="text-blue-400" /> Order Summary
              </p>
              <h1 className="text-2xl font-extrabold text-blue-900">Checkout</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold
                         hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </button>
          </div>

          {/* ── Empty state ── */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <ShoppingCart size={28} className="text-blue-300" />
              </div>
              <p className="text-blue-300 font-semibold text-sm">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white
                           text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
              >
                <BookOpen size={14} /> Browse Courses
              </button>
            </div>

          ) : isPlan ? (
            /* ── PLAN PURCHASE UI ── */
            <div className="border border-blue-100 rounded-2xl p-8 bg-blue-50/40">

              {/* Plan header */}
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
                  <GraduationCap size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1">
                    <BadgeCheck size={10} /> Subscription Plan
                  </span>
                  <h2 className="text-xl font-extrabold text-blue-900 leading-tight mt-0.5">
                    {cart[0].title}
                  </h2>
                  <p className="text-sm text-blue-400">{cart[0].subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-blue-700">₹{cart[0].price}</p>
                  <p className="text-xs text-blue-300 font-medium">per month</p>
                </div>
              </div>

              <div className="border-t border-blue-100 my-5" />

              {/* Features grid */}
              {cart[0].features?.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {cart[0].features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-blue-700 font-medium
                                 bg-white border border-blue-100 rounded-xl px-4 py-3 shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={13} className="text-white" />
                      </div>
                      <span className="text-blue-400 shrink-0">
                        {featureIconMap[f]}
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-blue-300 font-medium mt-6 text-center flex items-center justify-center gap-3">
                <span className="flex items-center gap-1"><ShieldCheck size={11} /> Billed monthly</span>
                <span>•</span>
                <span>Cancel anytime</span>
                <span>•</span>
                <span>30-day money back</span>
              </p>
            </div>

          ) : (
            /* ── COURSE / CERT UI ── */
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 border border-blue-100 rounded-xl p-5
                             hover:shadow-md hover:shadow-blue-50 transition-all bg-white"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-36 h-24 rounded-xl object-cover shrink-0 border border-blue-100"
                    />
                  ) : (
                    <div className="w-36 h-24 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <BookOpen size={28} className="text-blue-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-blue-900 leading-snug">{item.title}</h2>
                    {item.instructor && (
                      <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                        <GraduationCap size={11} /> {item.instructor}
                      </p>
                    )}
                    {item.rating && (
                      <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                        <Star size={11} className="fill-blue-300 text-blue-300" /> {item.rating}
                      </p>
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-blue-700 shrink-0">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════ RIGHT — PAYMENT SUMMARY ══════════ */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50 p-8 h-fit sticky top-24">

            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-1">
              <CreditCard size={11} /> Billing Summary
            </p>
            <h2 className="text-xl font-extrabold text-blue-900 mb-7">Price Details</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-blue-600">
                <span className="font-medium flex items-center gap-1.5">
                  <Receipt size={13} className="text-blue-400" /> Subtotal
                </span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span className="font-medium flex items-center gap-1.5">
                  <BarChart3 size={13} className="text-blue-400" /> GST (18%)
                </span>
                <span className="font-semibold">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span className="font-medium flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-blue-400" /> Platform Fee
                </span>
                <span className="font-semibold">₹{platformFee}</span>
              </div>
              <div className="border-t border-blue-100 pt-4 flex justify-between">
                <span className="text-base font-extrabold text-blue-900 flex items-center gap-1.5">
                  <CreditCard size={15} className="text-blue-600" /> Total Payable
                </span>
                <span className="text-base font-extrabold text-blue-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Plan badge */}
            {isPlan && (
              <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-700 font-semibold flex items-center gap-2">
                <PartyPopper size={14} className="text-blue-500 shrink-0" />
                Subscribing to <strong className="ml-1">{cart[0].title}</strong>
              </div>
            )}

            {/* Trust badge */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-500 font-medium leading-relaxed">
              <p className="flex items-center gap-1.5 font-semibold text-blue-600 mb-1">
                <Lock size={12} /> 100% Secure Payments
              </p>
              <p className="flex items-center gap-1.5 text-blue-400">
                <CreditCard size={11} /> Credit Card &nbsp;•&nbsp; Debit Card &nbsp;•&nbsp; UPI
              </p>
            </div>

            <button
              onClick={() => navigate("/payment", { state: { cart, total } })}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl
                         text-base font-bold transition-all shadow-md shadow-blue-200 active:scale-95
                         flex items-center justify-center gap-2"
            >
              Proceed to Payment <ChevronRight size={16} />
            </button>

            <p className="text-[11px] text-blue-300 text-center mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={10} /> By proceeding, you agree to our Terms & Privacy Policy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
