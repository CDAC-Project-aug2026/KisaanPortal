import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import InvoiceModal from "../components/InvoiceModal";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");

  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [equipmentNames, setEquipmentNames] = useState({});
  const [viewInvoice, setViewInvoice] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadBookings();

    if (role === "OWNER") {
      loadAnalytics();
    }
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/booking/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data || [];
      setBookings(data);

      // Some older bookings were saved before the equipment name was
      // being stored on the booking itself. For those, fetch the name
      // from equipment-service directly so the UI never has to show a
      // raw equipment id. Backend/DB is not touched — this is purely
      // a read done from the frontend.
      const missingIds = [
        ...new Set(
          data
            .filter((b) => !b.equipmentName && b.equipmentId)
            .map((b) => b.equipmentId)
        ),
      ];

      missingIds.forEach(async (id) => {
        try {
          const res = await axios.get(`http://localhost:3001/equipment/${id}`);
          const eqName = res.data?.equipment?.name;
          if (eqName) {
            setEquipmentNames((prev) => ({ ...prev, [id]: eqName }));
          }
        } catch (err) {
          console.log("Could not fetch equipment name for id", id, err);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const response = await axios.get(
        `http://localhost:3001/api/analytics/monthly-report?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data || []);
    } catch (error) {
      console.log("Analytics Error :", error);
    }
  };

  const uniqueBookings = useMemo(() => {
    return bookings.filter(
      (booking, index, self) =>
        index === self.findIndex((b) => b.id === booking.id)
    );
  }, [bookings]);

  // Derive a display category purely on the frontend, without touching
  // the backend: CANCELLED bookings stay cancelled; among the rest,
  // a booking is "completed" once its end date has passed, otherwise
  // it's "upcoming" (covers both future and currently-active rentals).
  const categorizeBooking = (booking) => {
    if (booking.status === "CANCELLED") return "cancelled";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(booking.endDate);

    return end < today ? "completed" : "upcoming";
  };

  const categorizedBookings = useMemo(() => {
    const groups = { upcoming: [], completed: [], cancelled: [] };
    uniqueBookings.forEach((booking) => {
      groups[categorizeBooking(booking)].push(booking);
    });
    return groups;
  }, [uniqueBookings]);

  const visibleBookings = categorizedBookings[activeTab] || [];

  const totalSpent = uniqueBookings.reduce(
    (sum, booking) => sum + (booking.finalPrice || 0),
    0
  );

  const activeBookings = uniqueBookings.filter(
    (booking) => booking.status === "BOOKED"
  ).length;

  const totalSearches = analytics.reduce(
    (sum, item) => sum + item.searchCount,
    0
  );

  const chartData = analytics.map((item) => ({
    keyword: item.keyword,
    percentage:
      totalSearches === 0
        ? 0
        : Number(((item.searchCount / totalSearches) * 100).toFixed(1)),
    available: item.equipmentAvailable,
  }));

  const canCancelBooking = (startDate) => {
    const bookingDate = new Date(startDate);
    const now = new Date();
    // Calculate difference in hours between now and start date
    const diffHours = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    // Cancellation allowed if start date is strictly more than 24h away
    return diffHours >= 24;
  };

  const cancelBooking = async (bookingId, startDate) => {
    if (!canCancelBooking(startDate)) {
      toast.warning("You can only cancel bookings at least 24 hours prior to the start date.");
      return;
    }

    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.delete(
        `http://localhost:3001/booking/delete/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking Cancelled Successfully");
      loadBookings();

      if (role === "OWNER") {
        loadAnalytics();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Unable to cancel booking"
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-5xl font-bold text-green-700">🌾 Dashboard</h1>
            <p className="text-gray-600 mt-3 text-lg">
              Welcome back,{" "}
              <span className="font-bold text-green-700">{name}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600">
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="text-4xl font-bold text-green-700 mt-3">
              {uniqueBookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-yellow-500">
            <p className="text-gray-500">Total Spent</p>
            <h2 className="text-4xl font-bold text-yellow-600 mt-3">
              ₹{totalSpent}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-600">
            <p className="text-gray-500">Active Bookings</p>
            <h2 className="text-4xl font-bold text-blue-700 mt-3">
              {activeBookings}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-600">
            <p className="text-gray-500">Account Type</p>
            <h2 className="text-3xl font-bold text-purple-700 mt-3">
              {role}
            </h2>
          </div>
        </div>

        {/* Analytics */}
        {role === "OWNER" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-green-700">
                📊 Monthly Search Analytics
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="percentage">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.available ? "#22c55e" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded"></div>
                <span className="font-medium">Equipment Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded"></div>
                <span className="font-medium">Equipment Not Available</span>
              </div>
            </div>

            <div className="overflow-x-auto mt-10">
              <table className="w-full border border-gray-200">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Keyword</th>
                    <th className="p-3">Searches</th>
                    <th className="p-3">Demand %</th>
                    <th className="p-3">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-green-50 text-center"
                    >
                      <td className="p-3 font-semibold text-left">
                        {item.keyword}
                      </td>
                      <td className="p-3">{analytics[index]?.searchCount}</td>
                      <td className="p-3 font-bold text-blue-600">
                        {item.percentage}%
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          item.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.available ? "Available" : "Not Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <Link to="/equipment">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <div className="text-5xl mb-4">🚜</div>
              <h2 className="text-2xl font-bold text-gray-800">
                Browse Equipment
              </h2>
              <p className="text-gray-600 mt-2">
                Explore available tractors, harvesters, and other farming equipment.
              </p>
            </div>
          </Link>

          <Link to="/reviews">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              <p className="text-gray-600 mt-2">
                Read customer reviews and share your experience.
              </p>
            </div>
          </Link>

          <div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-2xl shadow-xl p-6 h-full">
            <div className="text-5xl mb-4">🌾</div>
            <h2 className="text-2xl font-bold">My Account</h2>
            <p className="mt-2 text-green-100">
              Manage bookings and track rental history.
            </p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              {uniqueBookings.length} Booking(s)
            </span>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-md w-fit">
            {[
              { key: "upcoming", label: "🕒 Upcoming", color: "green" },
              { key: "completed", label: "✅ Completed", color: "blue" },
              { key: "cancelled", label: "❌ Cancelled", color: "red" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-green-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-white/20"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {categorizedBookings[tab.key].length}
                </span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
              <div className="text-5xl animate-pulse">🚜</div>
              <p className="mt-4 text-lg text-gray-600">
                Loading your bookings...
              </p>
            </div>
          )}

          {!loading && uniqueBookings.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-7xl">📭</div>
              <h2 className="text-3xl font-bold mt-6">No Bookings Found</h2>
              <p className="text-gray-600 mt-3">
                Looks like you haven't rented any equipment yet.
              </p>
              <Link
                to="/equipment"
                className="inline-block mt-8 bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl"
              >
                Browse Equipment
              </Link>
            </div>
          )}

          {!loading && uniqueBookings.length > 0 && visibleBookings.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl">🗂️</div>
              <h2 className="text-2xl font-bold mt-5">
                No {activeTab} bookings
              </h2>
              <p className="text-gray-600 mt-2">
                Nothing to show in this tab right now.
              </p>
            </div>
          )}

          {!loading &&
            visibleBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-6 overflow-hidden border border-green-100"
              >
                <div
                  className={`h-2 bg-gradient-to-r ${
                    categorizeBooking(booking) === "cancelled"
                      ? "from-red-500 to-red-400"
                      : categorizeBooking(booking) === "completed"
                      ? "from-blue-600 to-blue-400"
                      : "from-green-600 to-green-400"
                  }`}
                ></div>
                <div className="p-6 flex flex-col lg:flex-row justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      🚜{" "}
                      {booking.equipmentName ||
                        equipmentNames[booking.equipmentId] ||
                        `Equipment #${booking.equipmentId}`}
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Booking ID :{" "}
                      <span className="font-semibold">#{booking.id}</span>
                    </p>
                    <div className="mt-5 space-y-2">
                      <p>
                        <span className="font-semibold">📅 Start :</span>{" "}
                        {booking.startDate}
                      </p>
                      <p>
                        <span className="font-semibold">📅 End :</span>{" "}
                        {booking.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-4xl font-bold text-green-700">
                        ₹{booking.finalPrice}
                      </p>
                      <span
                        className={`inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold ${
                          booking.status === "BOOKED"
                            ? categorizeBooking(booking) === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                            : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {categorizeBooking(booking) === "completed"
                          ? "COMPLETED"
                          : booking.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 mt-5 w-full sm:w-auto">
                      <button
                        onClick={() =>
                          setViewInvoice({
                            invoiceNumber: `INV-${booking.id}`,
                            dateTime: booking.startDate,
                            customerName: name,
                            customerEmail:
                              localStorage.getItem("email") || "-",
                            userId,
                            equipmentName:
                              booking.equipmentName ||
                              equipmentNames[booking.equipmentId] ||
                              `Equipment #${booking.equipmentId}`,
                            location: "-",
                            startDate: booking.startDate,
                            endDate: booking.endDate,
                            rentalDays: "-",
                            breakdown: null,
                            finalAmount: booking.finalPrice,
                            paymentMethod: "Razorpay (Demo)",
                            transactionId: `pay_${booking.id}`,
                            status:
                              booking.status === "CANCELLED"
                                ? "Booking Cancelled"
                                : "Payment Successful — Booking Confirmed",
                          })
                        }
                        className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-6 py-2.5 rounded-xl font-medium transition-all duration-300"
                      >
                        🧾 View Invoice
                      </button>

                      {booking.status === "BOOKED" &&
                        categorizeBooking(booking) === "upcoming" && (
                          <button
                            onClick={() =>
                              cancelBooking(booking.id, booking.startDate)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
                          >
                            Cancel Booking
                          </button>
                        )}
                    </div>

                    {categorizeBooking(booking) === "upcoming" && (
                      <span className="mt-3 text-sm font-medium text-gray-600">
                        Cancellation is allowed prior to 24h of booking start.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {viewInvoice && (
        <InvoiceModal data={viewInvoice} onClose={() => setViewInvoice(null)} />
      )}
    </div>
  );
}

export default Dashboard;