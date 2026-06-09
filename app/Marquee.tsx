"use client";

export default function Marquee() {
  const message = "🎓 Limited Spots Available - Only 50 Seats Left! • ⏰ Webinar Starts: 9th June 2026 at 7:00 PM IST • 💰 FREE Masterclass + Bonus Templates Worth ₹5000 • 🚀 Learn High-Income Digital Marketing Skills • 🎁 Live Q&A Session + Certificate Included • ";

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 overflow-hidden relative py-3 shadow-lg">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .marquee-text {
          animation: marquee 30s linear infinite;
          white-space: nowrap;
          display: inline-block;
          min-width: 100%;
        }
        .marquee-container:hover .marquee-text {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-container relative overflow-hidden">
        <div className="marquee-text font-bold text-sm md:text-base text-white drop-shadow-lg">
          {message}
        </div>
        <div className="marquee-text font-bold text-sm md:text-base text-white drop-shadow-lg" aria-hidden="true">
          {message}
        </div>
      </div>

      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-red-600 to-transparent pointer-events-none z-10" />
      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-red-600 to-transparent pointer-events-none z-10" />
    </div>
  );
}
