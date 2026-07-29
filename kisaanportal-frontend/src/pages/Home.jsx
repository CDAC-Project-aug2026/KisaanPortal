import { motion } from "framer-motion";
import heroImage from "../assets/TractorM.png";

function Home() {
  return (
    <div className="bg-green-50 min-h-screen">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-800 leading-tight">
            Smart Farming Starts with KisaanPortal
          </h1>

        <p className="mt-6 text-base md:text-lg text-gray-600 leading-relaxed">
            Rent tractors, harvesters, seeders and modern farm equipment
            at affordable prices. Save money, increase productivity and
            grow your farming business with ease.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <a
              href="/equipment"
              className="
                inline-flex
                items-center
                justify-center
                bg-green-700
                hover:bg-green-800
                text-white
                font-semibold
                px-8
                py-4
                rounded-xl
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              Explore Equipment →
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white p-5 rounded-2xl shadow-md text-center">
              <h2 className="text-3xl font-bold text-green-700">500+</h2>
              <p className="text-gray-600 mt-2">Equipment</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md text-center">
              <h2 className="text-3xl font-bold text-green-700">1000+</h2>
              <p className="text-gray-600 mt-2">Farmers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md text-center">
              <h2 className="text-3xl font-bold text-green-700">50+</h2>
              <p className="text-gray-600 mt-2">Villages</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md text-center">
              <h2 className="text-3xl font-bold text-green-700">24/7</h2>
              <p className="text-gray-600 mt-2">Support</p>
            </div>

          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={heroImage}
            alt="Farm Equipment"
            className="w-full max-w-xl h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

      </div>

      {/* Why Choose KisaanPortal */}
      <div className="bg-white py-16 px-6">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-bold text-center text-green-800">
            Why Choose KisaanPortal?
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-green-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-5xl">🚜</div>

              <h2 className="text-2xl font-bold mt-4 text-green-700">
                Modern Equipment
              </h2>

              <p className="text-gray-600 mt-3">
                Access high-quality tractors, harvesters and modern
                farming machinery whenever needed.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-green-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-5xl">💰</div>

              <h2 className="text-2xl font-bold mt-4 text-green-700">
                Affordable Rentals
              </h2>

              <p className="text-gray-600 mt-3">
                Save money by renting equipment instead of
                purchasing expensive machines.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-green-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-5xl">⚡</div>

              <h2 className="text-2xl font-bold mt-4 text-green-700">
                Quick Booking
              </h2>

              <p className="text-gray-600 mt-3">
                Book tractors and harvesters online
                within minutes from anywhere.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-green-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-5xl">🛠️</div>

              <h2 className="text-2xl font-bold mt-4 text-green-700">
                Well Maintained
              </h2>

              <p className="text-gray-600 mt-3">
                All machines are inspected regularly
                for safety and reliable performance.
              </p>
            </motion.div>

          </div>

        </div>

      </div>

      {/* About Section */}
      <div className="py-16 bg-green-100">
        <div className="max-w-6xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold text-green-800">
            Empowering Farmers with Technology 🌱
          </h2>

          <p className="mt-5 text-lg text-gray-700 max-w-3xl mx-auto">
            KisaanPortal connects farmers with modern agricultural equipment,
            making farming more productive, affordable and efficient.
            Our goal is to support every farmer with easy access to
            high-quality machinery.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Home;