import { useState } from "react";

/**
 * A visual, front-end-only Razorpay-style payment modal.
 * No real payment gateway is called — this simulates a checkout
 * so that a booking is only confirmed after a "successful" payment.
 */
function RazorpayModal({ amount, itemName, onSuccess, onClose }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [status, setStatus] = useState("form"); // form | processing | success
  const [error, setError] = useState("");

  const validate = () => {
    if (method === "upi") {
      if (!/^[\w.\-]+@[\w.\-]+$/.test(upiId.trim())) {
        setError("Enter a valid UPI ID (e.g. name@bank)");
        return false;
      }
    } else {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        setError("Enter a valid 16-digit card number");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError("Enter expiry as MM/YY");
        return false;
      }
      if (!/^\d{3}$/.test(cvv)) {
        setError("Enter a valid 3-digit CVV");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStatus("processing");
    // Simulate gateway processing delay
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        const txnId =
          "pay_" + Math.random().toString(36).slice(2, 13).toUpperCase();
        onSuccess({
          method: method === "upi" ? "UPI" : "Card",
          transactionId: txnId,
        });
      }, 900);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">🔒</span>
            <div>
              <p className="font-bold leading-none">Razorpay</p>
              <p className="text-[11px] text-blue-100">Secure Checkout</p>
            </div>
          </div>
          {status === "form" && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {status === "form" && (
          <div className="p-5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-500">Paying for</p>
              <p className="font-semibold text-slate-800">{itemName}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                ₹{amount}
              </p>
            </div>

            {/* Method tabs */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMethod("upi")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  method === "upi"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-300"
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  method === "card"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-300"
                }`}
              >
                Card
              </button>
            </div>

            {method === "upi" ? (
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border border-slate-300 p-3 rounded-lg text-sm mb-2"
              />
            ) : (
              <div className="space-y-2 mb-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border border-slate-300 p-3 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-1/2 border border-slate-300 p-3 rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-1/2 border border-slate-300 p-3 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-xs mb-2">{error}</p>
            )}

            <button
              onClick={handlePay}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-sm mt-2"
            >
              Pay ₹{amount}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              This is a demo checkout — no real payment is processed.
            </p>
          </div>
        )}

        {status === "processing" && (
          <div className="p-10 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-600 text-sm">Processing payment…</p>
          </div>
        )}

        {status === "success" && (
          <div className="p-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl">
              ✓
            </div>
            <p className="font-semibold text-green-700">Payment Successful</p>
            <p className="text-xs text-slate-500">Confirming your booking…</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RazorpayModal;
