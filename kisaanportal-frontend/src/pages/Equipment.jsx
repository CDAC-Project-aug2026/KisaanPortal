

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import tractor from "../assets/TractorM.png";

function Equipment() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const response = await axios.get("http://localhost:3001/equipment/all");

      const equipmentWithImages = response.data.map((item) => ({
        ...item,
        price: item.pricePerDay,
        img: `http://localhost:3003/uploads/${item.imageUrl}`,
      }));

      setData(equipmentWithImages);
    } catch (error) {
      console.error("Equipment Error:", error);
      toast.error("Failed to load equipment");
    }
  };

  const saveSearchAnalytics = async (keyword) => {
    if (!keyword.trim()) return;

    try {
      await axios.post(
        `http://localhost:3001/api/analytics/search-log?keyword=${encodeURIComponent(
          keyword
        )}`
      );
    } catch (error) {
      console.log("Analytics Error:", error);
    }
  };

  const filtered = data.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());

    const categoryMatch = category === "All" || item.type === category;

    let priceMatch = true;

    if (priceRange === "Below 1500") {
      priceMatch = item.price < 1500;
    } else if (priceRange === "1500 to 3000") {
      priceMatch = item.price >= 1500 && item.price <= 3000;
    } else if (priceRange === "Above 3000") {
      priceMatch = item.price > 3000;
    }

    return searchMatch && categoryMatch && priceMatch;
  });

  return (
    <div className="p-3 md:p-8 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-700 to-green-500 text-white p-4 md:p-8 rounded-3xl mb-8 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-4xl font-bold">
              Browse Equipment 🚜
            </h1>
            <p className="mt-3 text-lg">
              Find the perfect agricultural equipment for your farming needs
            </p>
          </div>

          <img
            src={tractor}
            alt="Tractor"
            className="w-48 sm:w-64 md:w-[420px] mt-6 md:mt-0 drop-shadow-2xl"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-700">8+</h2>
          <p className="text-gray-600">Equipment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-700">5+</h2>
          <p className="text-gray-600">Locations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-700">100+</h2>
          <p className="text-gray-600">Farmers Served</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-700">4.8★</h2>
          <p className="text-gray-600">Average Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-4 md:p-5 rounded-3xl shadow-xl h-fit md:sticky md:top-24"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4">Filters</h2>

          <input
            type="text"
            placeholder="Search equipment..."
            className="w-full border p-3 rounded-lg mb-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveSearchAnalytics(search);
              }
            }}
          />
          <button
            onClick={() => saveSearchAnalytics(search)}
            className="w-full bg-green-700 text-white py-3 rounded-xl mb-4 hover:bg-green-800 transition"
          >
            Search
          </button>

          <select
            className="w-full border p-3 rounded-lg mb-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Machines</option>
            <option value="Tractor">Tractor</option>
            <option value="Harvester">Harvester</option>
            <option value="Cultivator">Cultivator</option>
            <option value="Seeder">Seeder</option>
            <option value="Sprayer">Sprayer</option>
            <option value="rotavator">Rotavator</option>
            <option value="Power Weeder">Power Weeder</option>
          </select>

          <select
            className="w-full border p-3 rounded-lg mb-4"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="All">All Prices</option>
            <option value="Below 1500">Below 1500</option>
            <option value="1500 to 3000">1500 to 3000</option>
            <option value="Above 3000">Above 3000</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setPriceRange("All");
            }}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 rounded-xl hover:scale-105 transition"
          >
            Reset Filters
          </button>

          <div className="mt-6">
            <h3 className="font-bold text-lg text-green-700 mb-3">
              Popular Categories
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCategory("Tractor")}
                className="bg-green-100 p-3 rounded-xl hover:bg-green-200 transition"
              >
                🚜 Tractor
              </button>

              <button
                onClick={() => setCategory("Harvester")}
                className="bg-green-100 p-3 rounded-xl hover:bg-green-200 transition"
              >
                🌾 Harvester
              </button>

              <button
                onClick={() => setCategory("Cultivator")}
                className="bg-green-100 p-3 rounded-xl hover:bg-green-200 transition"
              >
                🌱 Cultivator
              </button>

              <button
                onClick={() => setCategory("Seeder")}
                className="bg-green-100 p-3 rounded-xl hover:bg-green-200 transition"
              >
                🌾 Seeder
              </button>

              <button
                onClick={() => setCategory("Sprayer")}
                className="bg-green-100 p-3 rounded-xl hover:bg-green-200 transition"
              >
                💧 Sprayer
              </button>

              <button
                onClick={() => setCategory("rotavator")}
                className="bg-green-100 p-3 rounded-xl hover:bg-green-200 transition"
              >
                ⚙️ Rotavator
              </button>
            </div>

            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setCategory("All")}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:bg-green-800"
              >
                Show All
              </button>
            </div>

            <div className="bg-green-50 mt-4 p-3 rounded-xl space-y-1">
              <h3 className="font-bold text-green-700 mb-2">Quick Stats</h3>
              <p>🚜 {data.length} Equipment</p>
              <p>📍 5 Locations</p>
              <p>⭐ 4.8 Rating</p>
            </div>
          </div>
        </motion.div>

        <div className="md:col-span-3">
          <p className="mb-4 text-gray-700 text-lg font-semibold">
            {filtered.length} equipment available
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl flex flex-col justify-between"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-44 md:h-52 w-full object-cover transition duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {item.type}
                    </span>

                    <h2 className="text-lg md:text-xl font-bold mt-3">
                      {item.name}
                    </h2>

                    <p className="text-gray-600 mt-2">📍 {item.location}</p>

                    <p className="text-yellow-500 mt-2">⭐ 4.8 Rating</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5 border-t pt-4">
                    <p className="text-green-700 font-bold text-lg md:text-xl">
                      ₹{item.price}/day
                    </p>

                    <button
                      onClick={() =>
                        navigate("/booking", {
                          state: item,
                        })
                      }
                      className="bg-gradient-to-r from-green-600 to-green-800 text-white px-3 md:px-4 py-2 rounded-xl hover:scale-105 transition text-sm md:text-base w-full sm:w-auto"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-10 text-lg">
              No equipment found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Equipment;