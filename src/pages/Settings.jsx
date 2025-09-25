import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({ name: parsed.name || "", email: parsed.email || "" });
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/users/update", // backend route you’ll create
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state + localStorage
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("✅ Account information updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Error updating account");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <p className="text-slate-400">
              Settings: Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 text-white flex items-center justify-center rounded-full">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {user?.name || "Guest"}
                </h3>
                <p className="text-slate-400">{user?.email || "No email"}</p>
              </div>
            </div>

            {/* Logout button */}
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Account Settings Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Account Information
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-1 text-slate-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
