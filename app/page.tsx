"use client";

import Image from "next/image";
import WebinarForm from "./RegistrationForm";
import { getContent, type LandingContent } from "./content-config";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState<LandingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setContent(getContent());
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!content) return null;

  return (
    <>
      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center z-50 animate-fade-out">
          <style>{`
            @keyframes fadeOut {
              0% { opacity: 1; }
              100% { opacity: 0; pointer-events: none; }
            }
            @keyframes slideInUp {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
              50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8); }
            }
            .animate-fade-out { animation: fadeOut 0.5s ease-in forwards 1.5s; }
            .animate-slide-in { animation: slideInUp 0.6s ease-out; }
            .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          `}</style>
          <div className="text-center animate-slide-in">
            <div className="animate-pulse-glow inline-block mb-6">
              <Image src="/logo.png" alt="Digital Learners Hub" width={200} height={60} priority />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">Welcome!</h1>
            <p className="text-emerald-600 font-bold">Loading your webinar registration...</p>
            <div className="mt-6 flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#1a1a1a] flex flex-col lg:flex-row">
        {/* LEFT SIDE - GREEN */}
        <div className="w-full lg:w-1/2 bg-[#10B981] relative flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-12 overflow-hidden">
          {/* Diagonal darker green shape */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-[#059669] origin-top-right" style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 20% 100%)' }} />
          </div>

          <div className="relative z-10 text-white max-w-lg">
            <div className="mb-8 inline-block bg-white/95 rounded-xl px-5 py-3 shadow-lg">
              <Image src="/logo.png" alt="Digital Learners Hub" width={220} height={65} priority />
            </div>

            <p className="text-base font-semibold mb-4 opacity-95">
              {content.webinarDate}, {content.webinarTime}
            </p>

            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-[1.1] mb-5 uppercase tracking-tight">
              Learn How To Make More Than{" "}
              <span className="text-white/95">35,000 Side Income</span>{" "}
              Every Month
            </h1>

            <p className="text-base leading-relaxed mb-10 opacity-90 max-w-md">
              {content.subheadline || "Three-day conference focused on music and technology. This Event inconspicuously simple but downright beautiful."}
            </p>

            <div className="flex gap-10 mb-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">Duration</p>
                <p className="text-sm font-bold">2 HOURS 30 MINUTES</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">Conference Date</p>
                <p className="text-sm font-bold">{content.webinarTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-[3px] border-white/40 shadow-xl">
                <Image src="/anushree.jpg" alt={content.speakerName} fill className="object-cover" priority />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-0.5">Main Tutor</p>
                <p className="text-xl font-black">{content.speakerName}</p>
                <p className="text-sm opacity-90">{content.speakerRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - DARK */}
        <div className="w-full lg:w-1/2 bg-[#1a1a1a] flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-12">
          <div className="max-w-md mx-auto w-full">
            <p className="text-[#10B981] font-bold text-lg mb-1">Do Not Hesitate!</p>
            <h2 className="text-3xl font-bold text-white mb-2">Join The Best Webinar</h2>
            <p className="text-sm text-gray-400 mb-8">
              {content.formHeaderSub || "Add a description of your offer and key benefits. What it is and how it helps your customer."}
            </p>

            <WebinarForm whatsappLink={content.whatsappLink} />
          </div>
        </div>
      </div>
    </>
  );
}
