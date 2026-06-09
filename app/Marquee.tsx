"use client";

export default function Marquee() {
  const messages = [
    "🎓 Limited Spots Available - Only 50 Seats Left!",
    "⏰ Webinar Starts: 9th June 2026 at 7:00 PM IST",
    "💰 FREE Masterclass + Bonus Templates Worth ₹5000",
    "🚀 Learn High-Income Digital Marketing Skills",
    "🎁 Live Q&A Session + Certificate Included",
  ];

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 overflow-hidden relative py-3 shadow-lg">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .marquee-content {
          animation: scroll 20s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-container flex overflow-hidden">
        <div className="marquee-content flex gap-12 pr-12">
          {messages.map((msg, idx) => (
            <span
              key={idx}
              className="text-white font-bold text-sm md:text-base flex-shrink-0 drop-shadow-lg"
            >
              {msg}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {messages.map((msg, idx) => (
            <span
              key={`dup-${idx}`}
              className="text-white font-bold text-sm md:text-base flex-shrink-0 drop-shadow-lg"
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-600 to-transparent pointer-events-none" />
      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-600 to-transparent pointer-events-none" />
    </div>
  );
}
