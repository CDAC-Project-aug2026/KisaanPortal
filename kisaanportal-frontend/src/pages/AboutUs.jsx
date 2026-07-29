import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import tractorImg from "../assets/about-tractor.png";

function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[45%_55%] gap-4 items-center">
          {/* LEFT */}
          <div data-aos="fade-right" className="max-w-xl">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-800">
              Empowering Farmers With
              <span className="block text-green-700">
                Smart Equipment Rentals
              </span>
            </h1>

            <p className="text-gray-600 mt-6 leading-8 text-lg">
              KisaanPortal connects farmers with equipment owners through
              a secure online platform, making agricultural machinery
              affordable, accessible and easy to book.
            </p>

            <p className="text-gray-600 mt-4 leading-8">
              Instead of purchasing expensive equipment,
              farmers can simply rent tractors, harvesters,
              cultivators and more whenever required.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-white shadow-md rounded-full px-5 py-3 font-semibold text-green-700 hover:scale-105 transition">
                🚜 Easy Booking
              </div>

              <div className="bg-white shadow-md rounded-full px-5 py-3 font-semibold text-green-700 hover:scale-105 transition">
                💰 Affordable Pricing
              </div>

              <div className="bg-white shadow-md rounded-full px-5 py-3 font-semibold text-green-700 hover:scale-105 transition">
                ⭐ Trusted Owners
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            data-aos="fade-left"
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-30"></div>

            <img
              src={tractorImg}
              alt="Tractor"
              className="relative z-10
                w-[340px]
                sm:w-[420px]
                md:w-[500px]
                lg:w-[600px]
                xl:w-[680px]
                object-contain
                hover:scale-105
                transition-all
                duration-500
                drop-shadow-[0_25px_45px_rgba(34,197,94,0.35)]"
            />
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-gray-800">
            Why Choose KisaanPortal?
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Everything you need for simple, secure
            and affordable equipment rentals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            data-aos="zoom-in"
            className="bg-white rounded-2xl shadow-lg p-7
            hover:-translate-y-2 hover:shadow-2xl
            transition-all duration-300"
          >
            <div className="text-5xl mb-5">🚜</div>

            <h3 className="text-xl font-bold mb-3">
              Modern Equipment
            </h3>

            <p className="text-gray-600">
              Access tractors, harvesters and
              farming tools whenever required.
            </p>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            className="bg-white rounded-2xl shadow-lg p-7
            hover:-translate-y-2 hover:shadow-2xl
            transition-all duration-300"
          >
            <div className="text-5xl mb-5">💰</div>

            <h3 className="text-xl font-bold mb-3">
              Cost Effective
            </h3>

            <p className="text-gray-600">
              Save money by renting equipment
              only when needed.
            </p>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="bg-white rounded-2xl shadow-lg p-7
            hover:-translate-y-2 hover:shadow-2xl
            transition-all duration-300"
          >
            <div className="text-5xl mb-5">⚡</div>

            <h3 className="text-xl font-bold mb-3">
              Fast Booking
            </h3>

            <p className="text-gray-600">
              Complete bookings within
              just a few clicks.
            </p>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="300"
            className="bg-white rounded-2xl shadow-lg p-7
            hover:-translate-y-2 hover:shadow-2xl
            transition-all duration-300"
          >
            <div className="text-5xl mb-5">🛡️</div>

            <h3 className="text-xl font-bold mb-3">
              Secure Platform
            </h3>

            <p className="text-gray-600">
              Verified owners,
              transparent pricing
              and trusted rentals.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-800">
              How KisaanPortal Works
            </h2>

            <p className="text-gray-600 mt-3">
              Rent agricultural equipment in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div data-aos="fade-up" className="text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-lg group-hover:bg-green-700 group-hover:text-white transition duration-300">
                🔍
              </div>

              <h3 className="font-bold text-xl mt-5">
                Search
              </h3>

              <p className="text-gray-600 mt-3">
                Browse available farming equipment.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="150" className="text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-lg group-hover:bg-green-700 group-hover:text-white transition duration-300">
                📅
              </div>

              <h3 className="font-bold text-xl mt-5">
                Book
              </h3>

              <p className="text-gray-600 mt-3">
                Select your rental period online.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-lg group-hover:bg-green-700 group-hover:text-white transition duration-300">
                🚜
              </div>

              <h3 className="font-bold text-xl mt-5">
                Use
              </h3>

              <p className="text-gray-600 mt-3">
                Complete your farming work efficiently.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="450" className="text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-lg group-hover:bg-green-700 group-hover:text-white transition duration-300">
                ✅
              </div>

              <h3 className="font-bold text-xl mt-5">
                Return
              </h3>

              <p className="text-gray-600 mt-3">
                Return equipment safely after use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section
        className="py-16 bg-gradient-to-r from-green-700 to-green-600"
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <h2 className="text-5xl font-bold">500+</h2>
              <p className="mt-3">Farmers</p>
            </div>

            <div className="text-white">
              <h2 className="text-5xl font-bold">150+</h2>
              <p className="mt-3">Equipment</p>
            </div>

            <div className="text-white">
              <h2 className="text-5xl font-bold">1200+</h2>
              <p className="mt-3">Rentals</p>
            </div>

            <div className="text-white">
              <h2 className="text-5xl font-bold">98%</h2>
              <p className="mt-3">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR VALUES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-gray-800">
            Our Values
          </h2>

          <p className="text-gray-600 mt-3">
            The principles that drive KisaanPortal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            data-aos="fade-up"
            className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-5xl mb-5">🌱</div>

            <h3 className="text-2xl font-bold mb-3">
              Sustainability
            </h3>

            <p className="text-gray-600 leading-7">
              Helping farmers reduce farming costs by
              sharing agricultural machinery efficiently.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-5xl mb-5">🤝</div>

            <h3 className="text-2xl font-bold mb-3">
              Trust
            </h3>

            <p className="text-gray-600 leading-7">
              Every booking is designed to be secure,
              transparent and reliable.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-5xl mb-5">🚀</div>

            <h3 className="text-2xl font-bold mb-3">
              Innovation
            </h3>

            <p className="text-gray-600 leading-7">
              Leveraging technology to make agricultural
              equipment accessible for everyone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
