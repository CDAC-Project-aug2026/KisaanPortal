import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        {
          email,
          password,
        }
      );

      if (!response.data || !response.data.token) {
        toast.error("Wrong email or password");
        localStorage.clear();
        return;
      }

      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);

      toast.success("Login successful");
      setTimeout(() => {
        window.location.href = "/";
      }, 700);

    } catch (error) {
      console.error(error);
      localStorage.clear();
      toast.error("Wrong email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-yellow-100 px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🚜</div>

          <h1 className="text-3xl font-bold text-green-700">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your KisaanPortal account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 hover:scale-105 transition duration-300 shadow-lg"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600">
            Don't have an account?
          </span>

          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline ml-1"
          >
            Register
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;