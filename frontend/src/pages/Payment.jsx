import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cart = state?.cart || [];

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;

  const platformFee = 20; // Fixed convenience fee

  const total = subtotal + gstAmount + platformFee;

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - Order Details */}
        <div>
          <h1 className="text-3xl font-bold mb-6">
            🛒 Order Summary
          </h1>

          {cart.map(item => (
            <div key={item.id} className="flex justify-between mb-4">
              <span className="text-gray-700">{item.title}</span>
              <span className="font-medium">₹{item.price}</span>
            </div>
          ))}

          <div className="border-t mt-6 pt-6 space-y-3 text-gray-700">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{platformFee.toFixed(2)}</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total Payable</span>
              <span className="text-indigo-600">
                ₹{total.toFixed(2)}
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - Payment Button */}
        <div className="flex flex-col justify-between">
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Secure Checkout
            </h2>

            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
              <p className="text-gray-600 mb-2">
                🔒 Your payment is secured with 256-bit SSL encryption.
              </p>
              <p className="text-gray-600">
                We support Credit Card, Debit Card & UPI.
              </p>
            </div>
          </div>

          <button
            className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl text-lg hover:scale-105 transition duration-300 shadow-lg"
            onClick={() =>
              navigate("/pay", { state: { total } })
            }
          >
            Proceed to Pay ₹{total.toFixed(2)}
          </button>

        </div>

      </div>
    </div>
  );
}

