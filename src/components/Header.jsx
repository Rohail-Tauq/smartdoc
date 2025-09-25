import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
       
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setUser(null);
    }
  }, []);

  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700/50 flex justify-end items-center px-6">
      <div className="flex items-center gap-3">
        {user ? (
          <p className="text-white font-medium">Welcome, {user.name} 👋</p>
        ) : (
          <p className="text-slate-400">Not logged in</p>
        )}
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-full ring-2 ring-slate-700/50 hover:ring-indigo-500/50 transition-all">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}