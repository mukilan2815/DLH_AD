"use client";

import { useEffect, useState } from "react";

interface Props {
  headline: string;
  sub: string;
  cta: string;
  onCtaClick: () => void;
}

export default function ExitIntentModal({ headline, sub, cta, onCtaClick }: Props) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !dismissed && !show) {
        setShow(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShow(false); setDismissed(true); }} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 text-center animate-[scaleIn_0.3s_ease-out]">
        <div className="text-4xl mb-3">🛑</div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">{headline}</h3>
        <p className="text-sm text-gray-600 mb-5">{sub}</p>
        <button
          onClick={() => { onCtaClick(); setShow(false); }}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {cta}
        </button>
        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          No thanks, I&apos;ll miss out
        </button>
      </div>
    </div>
  );
}
