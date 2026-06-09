"use client";

import { useState, useEffect } from "react";
import { type LandingContent } from "./content-config";

export default function WebinarForm({ whatsappLink }: { whatsappLink: string }) {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    whatsapp: "",
    profession: "Job",
    city: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.whatsapp.trim() || formData.whatsapp.length < 10) newErrors.whatsapp = "Valid number required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateForm();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setFormData({ firstName: "", email: "", whatsapp: "", profession: "Job", city: "" });
      setErrors({});
      setTouched({});
      if (whatsappLink) {
        window.open(whatsappLink, "_blank");
      }
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field: string) => `w-full px-5 py-3 bg-white text-gray-900 border-0 rounded-full text-sm focus:outline-none transition-all shadow-sm ${
    errors[field] && touched[field]
      ? "ring-2 ring-red-500"
      : "focus:ring-2 focus:ring-[#10B981]"
  }`;

  const selectClass = (field: string) => `w-full px-5 py-3 bg-white text-gray-700 border-0 rounded-full text-sm appearance-none cursor-pointer focus:outline-none transition-all shadow-sm ${
    errors[field] && touched[field]
      ? "ring-2 ring-red-500"
      : "focus:ring-2 focus:ring-[#10B981]"
  }`;

  const labelClass = "block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider";
  const errorClass = "text-red-400 text-xs mt-1 font-medium";

  if (status === "success") {
    return (
      <div className="bg-[#10B981]/10 border border-[#10B981] rounded-2xl p-8 text-center animate-slide-down">
        <style>{`.animate-slide-down { animation: slideDown 0.5s ease-out; }`}</style>
        <div className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-gray-300 mb-1">You are successfully registered.</p>
        <p className="text-sm text-gray-400">Check your email for details. Redirecting to WhatsApp...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-shake { animation: shake 0.3s; }
        .animate-slide-down { animation: slideDown 0.5s ease-out; }
      `}</style>

      <div className="mb-3">
        <label className={labelClass}>First Name <span className="text-[#10B981]">*</span></label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter your full name"
          className={inputClass("firstName")}
        />
        {errors.firstName && touched.firstName && <p className={errorClass}>{errors.firstName}</p>}
      </div>

      <div className="mb-3">
        <label className={labelClass}>Email ID <span className="text-[#10B981]">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter your email address"
          className={inputClass("email")}
        />
        {errors.email && touched.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div className="mb-3">
        <label className={labelClass}>Whatsapp Number <span className="text-[#10B981]">*</span></label>
        <div className={`flex items-center bg-white rounded-full shadow-sm focus-within:ring-2 transition-all overflow-hidden ${
          errors.whatsapp && touched.whatsapp
            ? "ring-2 ring-red-500"
            : "focus-within:ring-2 focus-within:ring-[#10B981]"
        }`}>
          <span className="px-5 py-3 text-sm font-semibold text-gray-600">+91</span>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="9876543210"
            className="flex-1 px-2 py-3 text-sm bg-transparent placeholder-gray-400 outline-none text-gray-900"
          />
        </div>
        {errors.whatsapp && touched.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
      </div>

      <div className="mb-3">
        <label className={labelClass}>Profession <span className="text-[#10B981]">*</span></label>
        <select
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          onBlur={handleBlur}
          className={selectClass("profession")}
        >
          <option>Job</option>
          <option>Student</option>
          <option>Business Owner</option>
          <option>Freelancer</option>
          <option>Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className={labelClass}>City <span className="text-[#10B981]">*</span></label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter your city"
          className={inputClass("city")}
        />
        {errors.city && touched.city && <p className={errorClass}>{errors.city}</p>}
      </div>

      {status === "error" && (
        <p className="text-red-400 text-center mb-4 text-sm font-medium animate-shake">Something went wrong. Try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={`w-full font-bold py-3 px-6 rounded-full text-base uppercase tracking-wider transition-all shadow-md hover:shadow-lg ${
          status === "submitting"
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-[#10B981] hover:bg-[#059669] text-black hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {status === "submitting" ? "Registering..." : "Register Now"}
      </button>
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
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center shadow-lg">
      <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{content?.successTitle ?? "You are Registered"}</h3>
      <p className="text-lg text-gray-600 mb-6">{content?.successMessage ?? "Your registration has been saved. See you at the webinar."}</p>

      <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 mb-6">
        <p className="text-lg font-bold text-gray-900 mb-2">Joining WhatsApp Community</p>
        <p className="text-base text-gray-600 mb-4">Redirecting automatically in {seconds}s</p>
        <div className="w-full bg-gray-300 rounded-full h-2 mb-6 overflow-hidden">
          <div className="bg-[#10B981] h-2 rounded-full transition-all duration-1000" style={{ width: `${((2 - seconds) / 2) * 100}%` }} />
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full rounded-lg bg-[#10B981] px-6 py-4 text-lg font-bold text-white text-center hover:bg-[#059669] transition-colors">
          Join WhatsApp Group
        </a>
      </div>

      <button onClick={onReset} className="text-base text-gray-500 hover:text-gray-700 transition-colors font-semibold">
        {content?.registerAnotherText ?? "Register Another Person"}
      </button>
    </div>
  );
}
