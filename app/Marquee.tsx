"use client";

export default function Marquee() {
  const message = "🎓 Limited Spots Available - Only 50 Seats Left!  •  ⏰ Webinar Starts: 12th June 2026 at 7:00 PM IST  •  💰 FREE Masterclass + Bonus Templates Worth ₹5000  •  🚀 Learn High-Income Digital Marketing Skills  •  🎁 Live Q&A Session + Certificate Included  •  ";

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative py-2 md:py-2.5 shadow-lg border-y border-emerald-600/30">
      <style>{`
        @keyframes marquee-mobile {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-desktop {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .marquee-text {
          animation: marquee-mobile 25s linear infinite;
          white-space: nowrap;
          display: inline-block;
          will-change: transform;
        }
        @media (min-width: 768px) {
          .marquee-text {
            animation: marquee-desktop 18s linear infinite;
          }
        }
        .marquee-container:hover .marquee-text {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-container relative overflow-hidden">
        <div className="marquee-text font-semibold text-xs md:text-sm text-emerald-300 drop-shadow-lg px-4">
          {message}
        </div>
       
      </div>

      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10" />
      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10" />
    </div>
  );
}
