"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Calendar, Lock } from "lucide-react";
import RegistrationForm from "./RegistrationForm";
import { getContent, type LandingContent } from "./content-config";

export default function Home() {
  const [content, setContent] = useState<LandingContent | null>(null);

  useEffect(() => {
    setContent(getContent());
  }, []);

  if (!content) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <div className="h-1 w-full bg-[#10B981]" />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-6 lg:px-0 py-8 lg:py-0">
        {/* LEFT */}
        <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-auto">
          <div className="mb-6">
            <Image src="/logo.png" alt="Digital Learners Hub" width={160} height={36} priority className="opacity-90" />
          </div>

          <div className="max-w-md text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {content.headline}
              <span className="text-[#10B981]">{content.headlineHighlight}</span>
            </h1>
            <p className="mt-3 text-sm text-gray-500">{content.subheadline}</p>
          </div>

          <div className="mt-8 relative w-full max-w-[260px]">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-md bg-gray-100">
              <Image src="/anushree.jpg" alt={content.speakerName} fill className="object-cover" priority />
            </div>
          </div>

          <div className="mt-4 text-center lg:text-left">
            <p className="text-base font-bold text-gray-900">{content.speakerName}</p>
            <p className="text-sm text-[#10B981] font-semibold">{content.speakerRole}</p>
            <p className="text-xs text-gray-400">{content.speakerCompany}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center w-full lg:w-auto lg:max-w-lg">
          <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 mb-4 shadow-sm">
            <p className="text-xs font-bold text-gray-800 text-center mb-3 uppercase tracking-wide">{content.webinarTitle}</p>
            <ul className="space-y-2">
              {content.bulletPoints.map((bp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-xs text-gray-600 leading-snug">{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 px-6 py-3 text-center flex items-center justify-center gap-5 mb-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{content.webinarDate}</span>
            </div>
            <div className="w-px h-3.5 bg-gray-200" />
            <span className="text-xs font-medium text-[#10B981]">{content.webinarTime}</span>
          </div>

          <RegistrationForm />

          <div className="flex items-center justify-center gap-2 text-gray-300 mt-3">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-medium tracking-wide uppercase">Secure registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
