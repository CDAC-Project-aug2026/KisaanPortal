import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
  const userId = localStorage.getItem("userId") || "";

  const initial = name.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-green-800/40 hover:bg-green-800/60 pl-2 pr-3 py-1.5 rounded-full transition"
      >
        <span className="w-8 h-8 rounded-full bg-yellow-400 text-green-900 font-bold flex items-center justify-center text-sm">
          {initial}
        </span>
        <span className="hidden md:inline text-sm font-medium max-w-[110px] truncate">
          {name}
        </span>
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-yellow-400 text-green-900 font-bold flex items-center justify-center text-lg">
                {initial}
              </span>
              <div className="overflow-hidden">
                <p className="font-bold truncate">{name}</p>
                <p className="text-xs text-green-100 truncate">{email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">User ID</span>
              <span className="font-semibold">#{userId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Type</span>
              <span className="font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {role}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-semibold truncate max-w-[150px]">{email}</span>
            </div>
          </div>

          <div className="border-t px-4 py-3 flex flex-col gap-2">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="w-full text-sm font-medium text-green-700 hover:bg-green-50 py-2 rounded-lg transition"
            >
              📊 Go to Dashboard
            </button>
            <button
              onClick={logout}
              className="w-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
