import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Equipment from "./pages/Equipment.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Booking from "./pages/Booking.jsx";
import Reviews from "./pages/Reviews.jsx";
import AddEquipment from "./pages/AddEquipment.jsx";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import HowItWorks from "./pages/HowItWorks";

import Footer from "./components/Footer";
import ProfileMenu from "./components/ProfileMenu";

function MainApp() {
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        toastClassName="kp-toast"
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-green-700 text-white px-4 lg:px-8 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="w-full flex justify-between items-center md:w-auto">
          <h1 className="text-xl md:text-3xl font-bold">
            🚜 KisaanPortal
          </h1>

          <div className="flex items-center gap-3 md:hidden">
            {token && <ProfileMenu />}
            <button
              className="text-3xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        <div
          className={`
            ${menuOpen ? "flex" : "hidden"}
            lg:flex
            flex-col
            lg:flex-row
            flex-wrap
            gap-3
            lg:gap-5
            text-sm
            lg:text-base
            items-center
            justify-center
            w-full
            lg:w-auto
          `}
        >
          <Link
            className="hover:text-yellow-300"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            className="hover:text-yellow-300"
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>

          <Link
            className="hover:text-yellow-300"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>

          {token && (
            <>
              <Link
                className="hover:text-yellow-300"
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                className="hover:text-yellow-300"
                to="/equipment"
                onClick={() => setMenuOpen(false)}
              >
                Equipment
              </Link>

              <Link
                className="hover:text-yellow-300"
                to="/reviews"
                onClick={() => setMenuOpen(false)}
              >
                Reviews
              </Link>

              {role === "OWNER" && (
                <Link
                  className="hover:text-yellow-300"
                  to="/addEquipment"
                >
                  Add Equipment
                </Link>
              )}

              <div className="hidden md:block">
                <ProfileMenu />
              </div>
            </>
          )}

          {!token && (
            <>
              <Link
                className="hover:text-yellow-300"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="hover:text-yellow-300"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/addEquipment" element={<AddEquipment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;
