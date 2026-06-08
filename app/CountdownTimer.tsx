"use client";

import { useEffect, useState } from "react";

interface Props {
  targetDate: string; // e.g. "2026-06-09T19:00:00"
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (expired) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-100 px-4 py-3 text-center">
        <p className="text-sm font-bold text-red-600">🔴 Webinar has started! Join now before it fills up!</p>
      </div>
    );
  }

  const box = "flex flex-col items-center bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2 min-w-[56px]";
  const num = "text-xl font-extrabold text-emerald-600 tabular-nums";
  const lbl = "text-[10px] font-bold text-gray-400 uppercase mt-0.5";

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl border border-amber-200/60 px-4 py-3 text-center shadow-sm">
      <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wider">⏳ Webinar Starts In</p>
      <div className="flex items-center justify-center gap-2">
        <div className={box}><span className={num}>{pad(timeLeft.days)}</span><span className={lbl}>Days</span></div>
        <span className="text-lg font-bold text-amber-400">:</span>
        <div className={box}><span className={num}>{pad(timeLeft.hours)}</span><span className={lbl}>Hrs</span></div>
        <span className="text-lg font-bold text-amber-400">:</span>
        <div className={box}><span className={num}>{pad(timeLeft.minutes)}</span><span className={lbl}>Min</span></div>
        <span className="text-lg font-bold text-amber-400">:</span>
        <div className={box}><span className={num}>{pad(timeLeft.seconds)}</span><span className={lbl}>Sec</span></div>
      </div>
    </div>
  );
}
