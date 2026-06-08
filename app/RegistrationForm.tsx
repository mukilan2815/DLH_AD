"use client";

import { useEffect, useState } from "react";
import { getContent, type LandingContent } from "./content-config";

export default function RegistrationForm() {
  const [content, setContent] = useState<LandingContent | null>(null);

  useEffect(() => {
    setContent(getContent());
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    whatsapp: "",
    profession: "Job",
    city: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          profession: formData.profession,
          city: formData.city,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const submission = {
        timestamp: new Date().toISOString(),
        firstName: formData.firstName,
        email: formData.email,
        whatsapp: formData.whatsapp,
        profession: formData.profession,
        city: formData.city,
      };
      const existing = localStorage.getItem("dlh_submissions");
      const submissions: typeof submission[] = existing ? JSON.parse(existing) : [];
      submissions.unshift(submission);
      localStorage.setItem("dlh_submissions", JSON.stringify(submissions));

      setStatus("success");
      setFormData({ firstName: "", email: "", whatsapp: "", profession: "Job", city: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <SuccessScreen waLink={content?.whatsappLink ?? ""} onReset={() => setStatus("idle")} content={content} />;
  }

  const input = "w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-1.5">
      <div>
        <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Full Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Enter your full name" className={input} />
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email address" className={input} />
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Whatsapp Number</label>
        <div className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1 transition-all focus-within:border-[#10B981] focus-within:ring-1 focus-within:ring-[#10B981]/20">
          <span className="text-[10px] font-semibold text-gray-400 mr-2 select-none">+91</span>
          <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required placeholder="Enter your whatsapp number" className="flex-1 text-xs text-gray-900 placeholder-gray-400 outline-none bg-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Profession</label>
        <select name="profession" value={formData.profession} onChange={handleChange} className={input + " appearance-none cursor-pointer"}>
          <option>Job</option>
          <option>Student</option>
          <option>Business Owner</option>
          <option>Freelancer</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Enter your city" className={input} />
      </div>

      {status === "error" && <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>}

      <div className="flex justify-end pt-0.5">
        <button type="submit" disabled={status === "submitting"} className="rounded-md bg-[#10B981] px-6 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#059669] active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
          {status === "submitting" ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

function SuccessScreen({ waLink, onReset, content }: { waLink: string; onReset: () => void; content: LandingContent | null }) {
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
    if (!waLink) return;
    const timer = setTimeout(() => window.open(waLink, "_blank"), 2000);
    const interval = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [waLink]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
      <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-2">
        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{content?.successTitle ?? "You are Registered"}</h3>
      <p className="text-xs text-gray-500 mb-2">{content?.successMessage ?? "Your registration has been saved. See you at the webinar."}</p>

      <div className="bg-gray-50 rounded-lg border border-gray-100 p-2.5 mb-2">
        <p className="text-xs font-medium text-gray-800 mb-0.5">Joining WhatsApp Community</p>
        <p className="text-[10px] text-gray-400 mb-1.5">Redirecting automatically in {seconds}s</p>
        <div className="w-full bg-gray-200 rounded-full h-1 mb-1.5 overflow-hidden">
          <div className="bg-[#10B981] h-1 rounded-full transition-all duration-1000" style={{ width: `${((2 - seconds) / 2) * 100}%` }} />
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-white text-center hover:bg-[#059669] transition-colors">
          Join WhatsApp Group
        </a>
      </div>

      <button onClick={onReset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">
        {content?.registerAnotherText ?? "Register Another Person"}
      </button>
    </div>
  );
}
