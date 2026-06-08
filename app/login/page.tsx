"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "admin" && password === "BMCadminpass") {
      localStorage.setItem("dlh_admin_logged_in", "true");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-8 overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-br-full opacity-50" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-teal-100 to-transparent rounded-tl-full opacity-50" />

          <div className="relative text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              Admin Login
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Digital Learners Hub CRM
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-gray-600 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="w-full mt-1.5 rounded-xl border border-gray-200/80 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none shadow-sm transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full mt-1.5 rounded-xl border border-gray-200/80 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none shadow-sm transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center font-medium bg-red-50 rounded-lg py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(16,185,129,0.45)] hover:scale-[1.02] hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <Link
                href="/"
                className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                ← Back to Registration Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
