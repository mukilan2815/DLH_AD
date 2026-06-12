"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Loader } from "lucide-react";
import { getContent, fetchContentFromDb, type LandingContent } from "../content-config";

export default function ThankYouPage() {
  const [content, setContent] = useState<LandingContent>(getContent());
  const [countdown, setCountdown] = useState<number>(5);
  const [whatsappLink, setWhatsappLink] = useState<string>("");

  useEffect(() => {
    // Fetch from DB on mount and refetch every 5 seconds
    const fetchContent = async () => {
      const dbContent = await fetchContentFromDb();
      if (dbContent) setContent(dbContent);
    };

    fetchContent();
    const interval = setInterval(fetchContent, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get("redirect");
    if (redirectUrl) {
      setWhatsappLink(decodeURIComponent(redirectUrl));
    }
  }, []);

  useEffect(() => {
    if (!whatsappLink) return;

    setCountdown(15);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = whatsappLink;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [whatsappLink]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-emerald-100 selection:text-slate-900 relative overflow-hidden flex flex-col">
      {/* Soft Background Accent Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Digital Learners Hub" width={180} height={52} className="object-contain" priority />
          </div>
          <div className="text-xs font-semibold text-slate-500">Thank You</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white border border-slate-150 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-200/50">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-8 animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                {content.successTitle || "You are Registered!"}
              </h1>

              {/* Message */}
              <p className="text-slate-600 mb-8 font-medium text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                {content.successMessage || "Your spot has been successfully reserved. See you there!"}
              </p>


              {/* WhatsApp CTA Text */}
              <div className="mb-6">
                <p className="text-base font-bold text-slate-900 mb-4">
                  {content.whatsappCtaText || "TO GET THE WEBINAR LINK JOIN OUR WHATSAPP COMMUNITY👇"}
                </p>
              </div>

              {/* WhatsApp Button */}
              {whatsappLink && (
                <button
                  onClick={() => window.location.href = whatsappLink}
                  className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-8 rounded-xl text-base md:text-lg transition-all duration-200 shadow-[0_4px_15px_rgba(37,211,102,0.2)] hover:scale-[1.02] active:scale-[0.98] mb-4"
                >
                  <span>Join Our WhatsApp Group</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {/* Countdown */}
              {whatsappLink && countdown > 0 && (
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Redirecting in {countdown}s...</span>
                </div>
              )}

              {/* Back to Home Link */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <a
                  href="/"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 text-slate-400 text-xs font-medium space-y-3">
          <p>&copy; {new Date().getFullYear()} Digital Learners Hub. All rights reserved.</p>
          <p className="max-w-md mx-auto leading-relaxed">
            Disclaimer: This masterclass is for educational purposes. Success depends on effort, implementation, and market factors. We do not guarantee dynamic side incomes without work.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
