import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import {
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";

function Footer() {
  return (
<footer className="bg-slate-950 text-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company */}
          <div>
            <h2 className="text-3xl font-bold text-green-500">
              🚜 KisaanPortal
            </h2>

            <p className="mt-5 text-gray-300 leading-7">
              Smart agricultural equipment rental platform helping farmers
              access modern machinery at affordable prices and improve
              productivity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="/" className="hover:text-green-400 transition">
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/equipment"
                  className="hover:text-green-400 transition"
                >
                  Equipment
                </a>
              </li>

              <li>
                <a
                  href="/how-it-works"
                  className="hover:text-green-400 transition"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a href="/about" className="hover:text-green-400 transition">
                  About Us
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-green-400 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">
              Our Benefits
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>✔ Affordable Rentals</li>
              <li>✔ Verified Equipment</li>
              <li>✔ Easy Booking Process</li>
              <li>✔ 24/7 Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <MdEmail className="text-green-500 text-xl" />
                <span>kisaanportal@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <MdPhone className="text-green-500 text-xl" />
                <span>+91 XXXXX XXXXX</span>
              </div>

              <div className="flex items-center gap-3">
                <MdLocationOn className="text-green-500 text-xl" />
                <span>Pune, Maharashtra</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6 text-2xl">
              <a href="#" className="hover:text-green-400 transition">
                <FaFacebookF />
              </a>

              <a href="#" className="hover:text-green-400 transition">
                <FaTwitter />
              </a>

              <a href="#" className="hover:text-green-400 transition">
                <FaInstagram />
              </a>

              <a href="#" className="hover:text-green-400 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-sm text-gray-500 mt-2">
            © 2026 KisaanPortal. All Rights Reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;