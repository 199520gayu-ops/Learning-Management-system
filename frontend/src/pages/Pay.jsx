import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pay() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const total = state?.total || 0;

  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");

  const handlePayment = () => {
    if (paymentMethod === "credit" || paymentMethod === "debit") {
      if (!cardNumber || !expiry || !cvv || !name) {
        alert("Please fill all card details");
        return;
      }
    }

    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter UPI ID");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      navigate("/success", { state: { total } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - PAYMENT FORM */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Payment Method
          </h1>

          {/* METHOD SELECTOR */}
          <div className="space-y-3 mb-6">
            {["credit", "debit", "upi"].map((method) => (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === method
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-400"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium">
                    {method === "upi"
                      ? "UPI Payment"
                      : `${method} Card`}
                  </span>
                  {paymentMethod === method && (
                    <span className="text-indigo-600 font-bold">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CARD FORM */}
          {(paymentMethod === "credit" || paymentMethod === "debit") && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Holder Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-1/2 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="password"
                  placeholder="CVV"
                  maxLength="3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-1/2 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* UPI FORM */}
          {paymentMethod === "upi" && (
            <div>
              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {/* PAY BUTTON */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full mt-8 py-4 rounded-2xl text-white text-lg font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] shadow-lg"
            }`}
          >
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            🔒 Secure encrypted payment
          </p>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 h-fit sticky top-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Order Summary
          </h2>

          <div className="flex justify-between text-lg mb-4">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between text-lg mb-4">
            <span>Tax</span>
            <span>₹0</span>
          </div>

          <div className="border-t pt-4 flex justify-between text-xl font-bold text-indigo-600">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            ✔ Instant course access <br />
            ✔ Secure transaction <br />
            ✔ 7-day refund policy
          </div>
        </div>

      </div>
    </div>
  );
}


