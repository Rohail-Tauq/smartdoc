import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col justify-center items-center text-white px-6">
      
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <FileText size={40} />
        <h1 className="text-3xl font-bold">SmartDoc</h1>
      </div>

      {/* Tagline */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
        Smarter Document Management <br />
        For Modern Businesses
      </h2>
      <p className="mt-4 text-lg text-center max-w-xl opacity-90">
        Upload invoices, receipts, and contracts. Let AI do the heavy lifting by extracting and organizing your data automatically.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <Link
          to="/login"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-200 transition"
        >
          Login
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          Get Started <ArrowRight size={18} />
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-10 text-sm opacity-80">© {new Date().getFullYear()} SmartDoc. All rights reserved.</p>
    </div>
  );
}
