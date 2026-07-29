import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning("Password and confirm password do not match");
      return;
    }

    if (role === "") {
      toast.warning("Please select Farmer or Owner");
      return;
    }

    if (!agree) {
      toast.warning("Please agree to terms");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      console.log(response.data);

      toast.success("Registration successful");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setAgree(false);

    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
          "Registration failed"
        );
      } else {
        toast.error("Server not responding");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-yellow-100 px-4 py-10">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">
            🚜  
          </div>

          <h1 className="text-3xl font-bold text-green-700">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join KisaanPortal and start renting agricultural equipment.
          </p>

        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="font-semibold text-gray-700">
              Full Name
            </label>

            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg mt-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg mt-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Phone Number
            </label>

            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg mt-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg mt-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg mt-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-3">
              Select Your Role
            </p>

            <div className="grid grid-cols-2 gap-4">

              <div
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  role === "FARMER"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >

                <label className="cursor-pointer flex items-center">

                  <input
                    type="radio"
                    name="role"
                    value="FARMER"
                    checked={role === "FARMER"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />

                  🌱 Farmer

                </label>

                <p className="text-sm text-gray-500 mt-2">
                  Rent farming equipment
                </p>

              </div>

              <div
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  role === "OWNER"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >

                <label className="cursor-pointer flex items-center">

                  <input
                    type="radio"
                    name="role"
                    value="OWNER"
                    checked={role === "OWNER"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />

                  🚜 Owner

                </label>

                <p className="text-sm text-gray-500 mt-2">
                  List your equipment
                </p>

              </div>

            </div>

          </div>

          <label className="flex items-start gap-2 text-gray-600">

            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />

            <span>
              I agree to the{" "}
              <span className="text-green-700 font-semibold">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-green-700 font-semibold">
                Privacy Policy
              </span>
            </span>

          </label>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-green-800 hover:scale-105 transition duration-300"
          >
            Create Account
          </button>

        </form>

        <div className="text-center mt-6">

          <span className="text-gray-600">
            Already have an account?
          </span>

          <Link
            to="/login"
            className="text-green-700 font-semibold ml-2 hover:underline"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;