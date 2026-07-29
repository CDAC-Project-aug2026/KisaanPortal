import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import RazorpayModal from "../components/RazorpayModal";
import InvoiceModal from "../components/InvoiceModal";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const equipment = location.state;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [coupon, setCoupon] = useState("");
  const [bill, setBill] = useState(null);
  const [membershipType, setMembershipType] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

 const calculatePrice = async () => {
  if (!startDate || !endDate) {
    toast.warning("Please select start date and end date");
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end.getTime() <= start.getTime()) {
    toast.warning("End date cannot be before start date");
    return;
  }

  try {
   


     const response = await axios.get(
  "http://localhost:3001/pricing/bill",
  {
    params: {
  pricePerDay: equipment.price,
  startDate,
  endDate,
  coupon: coupon || null,
  membershipType: membershipType || null
}
  }
);

setBill(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ||
    "Unable to calculate price"
  );}
  };
 

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bill) {
      toast.warning("Please calculate price first");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    // Payment must succeed before the booking is created
    setShowPayment(true);
  };

  const createBookingAfterPayment = async (paymentInfo) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
  "http://localhost:3001/booking/add",
  {
    equipmentId: equipment.id,
    userId: Number(userId),
    startDate,
    endDate,
    finalPrice: bill.finalAmount
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log("Booking Saved =", response.data);

      setShowPayment(false);

      const saved = response.data;
      setInvoiceData({
        invoiceNumber: `INV-${saved?.id ?? Date.now()}`,
        dateTime: new Date().toLocaleString("en-IN"),
        customerName: localStorage.getItem("name") || "Customer",
        customerEmail: localStorage.getItem("email") || "-",
        userId,
        equipmentName: equipment.name,
        location: equipment.location,
        startDate,
        endDate,
        rentalDays: bill.rentalDays,
        breakdown: bill,
        finalAmount: bill.finalAmount,
        paymentMethod: paymentInfo?.method || "UPI",
        transactionId: paymentInfo?.transactionId || "-",
        status: "Payment Successful — Booking Confirmed",
      });
    } catch (error) {
  console.error("Booking Error:", error);
  setShowPayment(false);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Response:", error.response.data);

    toast.error(
      "Payment was successful, but booking could not be saved: " +
        (typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data))
    );
  } else {
    toast.error("Payment was successful, but the server is not responding.");
  }
}
};

  if (!equipment) {
  navigate("/equipment");
  return null;
}

  return (
<div className="max-w-3xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-green-100">
<h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">        Book {equipment.name}
      </h1>

      <img
        src={equipment.img}
        alt={equipment.name}
className="w-full h-48 md:h-64 object-cover rounded-xl mb-5 shadow-sm"      />

<p className="text-base md:text-lg mb-2">
          <strong>Location:</strong> {equipment.location}
      </p>

<p className="text-base md:text-lg mb-4">
          <strong>Price:</strong> ₹{equipment.price}/day
      </p>

      <form
        onSubmit={handleBookingSubmit}
        className="mt-6 space-y-4"
      >
        <span className="font-semibold">
                        📅Start :
         </span>
<input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  className="w-full border p-3 rounded-lg text-sm md:text-base"
  value={startDate}
  onChange={(e) => {
    setStartDate(e.target.value);
    setBill(null);
  }}
  required
/>
 <span className="font-semibold">
                        📅End :
                      </span>
<input
  type="date"
  min={startDate || new Date().toISOString().split("T")[0]}
  className="w-full border p-3 rounded-lg text-sm md:text-base"
  value={endDate}
  onChange={(e) => {
    setEndDate(e.target.value);
    setBill(null);
  }}
  required
/>

       
<div className="bg-blue-100 border border-blue-300 p-3 md:p-4 rounded-lg">  
  <h3 className="font-bold text-blue-800 mb-2">
    Available Coupons
  </h3>

  <p>🎉 SAVE10 → 10% OFF</p>
  <p>🎉 SAVE20 → 20% OFF</p>
  <p>🎉 FARMER25 → 25% OFF</p>
</div>

    <select
      className="w-full border p-3 rounded-lg"
      value={membershipType}
      onChange={(e) => {
  setMembershipType(e.target.value);
  setBill(null);
}}
    >
      <option value="">No Membership</option>
      <option value="SILVER">Silver Membership</option>
      <option value="GOLD">Gold Membership</option>
    </select>
        {/* <input
          type="text"
          placeholder="SAVE10 | SAVE20 | FARMER25"
          className="w-full border p-3 rounded-lg"
          value={coupon}
          onChange={(e) => {
  setCoupon(e.target.value.trim().toUpperCase());
  setBill(null);
}}
        /> */}
         <button
          type="button"
          onClick={calculatePrice}
className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 text-sm md:text-base"        >
          Calculate Price
        </button>

        

      {bill && (
  <div className="bg-green-100 border border-green-300 p-4 rounded-lg">

    <h3 className="text-xl font-bold text-green-800 mb-3">
      Pricing Invoice
    </h3>


<div className="space-y-2">

  <div className="flex justify-between">
    <span>Rental Days</span>
    <span>{bill.rentalDays}</span>
  </div>
  

  <div className="flex justify-between">
    <span>Base Price</span>
    <span>₹{bill.basePrice}</span>
  </div>
  {bill.discount > 0 && (
  <div className="flex justify-between text-green-700 font-medium">
    <span>Rental Discount</span>
    <span>- ₹{bill.discount.toFixed(2)}</span>
  </div>
)}

  <div className="flex justify-between">
    <span>GST</span>
    <span>₹{bill.gst}</span>
  </div>

  <div className="flex justify-between">
    <span>Membership</span>
    <span>{bill.membershipType || "None"}</span>
  </div>

  <div className="flex justify-between">
    <span>Membership Discount</span>
    <span>- ₹{bill.membershipDiscount}</span>
  </div>

  <div className="flex justify-between">
    <span>Coupon</span>
    <span>{bill.couponCode || "None"}</span>
  </div>

  <div className="flex justify-between">
    <span>Coupon Discount</span>
    <span>- ₹{bill.couponDiscount}</span>
  </div>

  <hr />

  <div className="flex justify-between text-2xl font-bold text-green-700">
    <span>Final Amount</span>
    <span>₹{bill.finalAmount}</span>
  </div>

</div>
    

  </div>
)}

       

      <button
  type="submit"
  disabled={!bill}
  className={`w-full py-3 rounded-lg text-sm md:text-base font-semibold text-white transition-colors ${
    bill
      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md"
      : "bg-green-700/60 cursor-not-allowed"
  }`}
>
  {bill ? `Pay ₹${bill.finalAmount} & Book` : "Confirm Booking"}
</button>
      </form>

      {showPayment && bill && (
        <RazorpayModal
          amount={bill.finalAmount}
          itemName={equipment.name}
          onClose={() => setShowPayment(false)}
          onSuccess={createBookingAfterPayment}
        />
      )}

      {invoiceData && (
        <InvoiceModal
          data={invoiceData}
          onContinue={() => {
            setInvoiceData(null);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
}

export default Booking;