"use client";

import { useEffect, useState } from "react";
import DashboardContent from "./DashboardContent";
import EditContentSection from "./EditContentSection";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"submissions" | "content">("submissions");

  useEffect(() => {
    const loggedIn = localStorage.getItem("dlh_admin_logged_in");
    if (!loggedIn) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="h-[3px] w-full bg-[#10B981]" />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Digital Learners Hub</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-gray-100/50 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "submissions"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "content"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Edit Content
          </button>
        </div>

        {activeTab === "submissions" && <DashboardContent />}
        {activeTab === "content" && <EditContentSection />}
      </div>
    </div>
  );
}
