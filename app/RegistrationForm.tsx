"use client";

import { useState } from "react";
import { type LandingContent } from "./content-config";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface WebinarFormProps {
  content: LandingContent;
  whatsappLink: string;
}

export default function WebinarForm({ content, whatsappLink }: WebinarFormProps) {
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

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .slice(0, 100)
      .replace(/[<>\"']/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const nameRegex = /^[a-zA-Z\s.''-]{2,100}$/;
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const firstName = formData.firstName.trim();
    if (!firstName) {
      newErrors.firstName = "Name is required";
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = "Name must be 2-100 characters (letters only)";
    }

    const email = formData.email.trim().toLowerCase();
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email) || email.length > 254) {
      newErrors.email = "Please enter a valid email address";
    }

    const whatsapp = formData.whatsapp.replace(/\D/g, "");
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (whatsapp.length < 10 || whatsapp.length > 15) {
      newErrors.whatsapp = "Please enter a valid phone number (10-15 digits)";
    }

    const city = formData.city.trim();
    if (!city) {
      newErrors.city = "City is required";
    } else if (!nameRegex.test(city)) {
      newErrors.city = "City must be 2-100 characters (letters only)";
    }

    const validProfessions = ["Job", "Student", "Business Owner", "Freelancer", "Other"];
    if (!validProfessions.includes(formData.profession)) {
      newErrors.profession = "Invalid profession selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "firstName" || name === "city") {
      sanitizedValue = sanitizeInput(value).slice(0, 100);
    } else if (name === "email") {
      sanitizedValue = value.trim().slice(0, 254);
    } else if (name === "whatsapp") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (touched[name]) {
      validateForm();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (!validateForm()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus("success");
      setFormData({ firstName: "", email: "", whatsapp: "", profession: "Job", city: "" });
      setErrors({});
      setTouched({});
      
      if (whatsappLink) {
        window.open(whatsappLink, "_blank");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field: string) => `w-full px-4 py-3.5 bg-slate-50 text-slate-900 border rounded-xl text-sm sm:text-base focus:bg-white focus:outline-none transition-all duration-200 placeholder-slate-400 font-medium ${
    errors[field] && touched[field]
      ? "border-red-350 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50/10"
      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 hover:border-slate-300"
  }`;

  const selectClass = (field: string) => `w-full px-4 py-3.5 bg-slate-50 text-slate-900 border rounded-xl text-sm sm:text-base appearance-none cursor-pointer focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
    errors[field] && touched[field]
      ? "border-red-350 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 hover:border-slate-300"
  }`;

  const labelClass = "block text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5";

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {content.successTitle || "You are Registered!"}
        </h3>
        <p className="text-slate-600 mb-6 font-medium text-sm leading-relaxed">
          {content.successMessage || "Your spot has been successfully reserved. See you there!"}
        </p>
        
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-6 rounded-xl text-base transition-all duration-200 shadow-[0_4px_15px_rgba(37,211,102,0.2)] hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Join Our WhatsApp Group</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
      <style>{`
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25em 1.25em;
          padding-right: 2.5rem;
        }
      `}</style>

      <div>
        <label className={labelClass}>Full Name <span className="text-emerald-600">*</span></label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={content.firstNamePlaceholder || "e.g. Nathan Lyon"}
          className={inputClass("firstName")}
        />
        {errors.firstName && touched.firstName && (
          <p className={errorClass}><AlertCircle className="w-3.5 h-3.5 inline" /> {errors.firstName}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Business Email <span className="text-emerald-600">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={content.emailPlaceholder || "e.g. nathan@gmail.com"}
          className={inputClass("email")}
        />
        {errors.email && touched.email && (
          <p className={errorClass}><AlertCircle className="w-3.5 h-3.5 inline" /> {errors.email}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>WhatsApp Number <span className="text-emerald-600">*</span></label>
        <div className={`flex items-center bg-slate-50 border rounded-xl transition-all duration-200 overflow-hidden ${
          errors.whatsapp && touched.whatsapp
            ? "border-red-350 ring-1 ring-red-500/20 bg-red-50/10"
            : "border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600/20 hover:border-slate-350"
        }`}>
          <span className="px-3 sm:px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-500 bg-slate-100 border-r border-slate-200 select-none whitespace-nowrap">
            +91
          </span>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={content.whatsappPlaceholder || "9876543210"}
            className="flex-1 px-4 py-3.5 bg-transparent text-slate-900 placeholder-slate-400 outline-none text-sm sm:text-base font-medium"
          />
        </div>
        {errors.whatsapp && touched.whatsapp && (
          <p className={errorClass}><AlertCircle className="w-3.5 h-3.5 inline" /> {errors.whatsapp}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{content.professionLabel || "Profession"}</label>
          <select
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            onBlur={handleBlur}
            className={selectClass("profession")}
          >
            <option className="bg-white text-slate-900">Job</option>
            <option className="bg-white text-slate-900">Student</option>
            <option className="bg-white text-slate-900">Business Owner</option>
            <option className="bg-white text-slate-900">Freelancer</option>
            <option className="bg-white text-slate-900">Other</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>City <span className="text-emerald-600">*</span></label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={content.cityPlaceholder || "e.g. Mumbai"}
            className={inputClass("city")}
          />
          {errors.city && touched.city && (
            <p className={errorClass}><AlertCircle className="w-3.5 h-3.5 inline" /> {errors.city}</p>
          )}
        </div>
      </div>

      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Something went wrong. Please try again.</span>
        </div>
      )}

      <div className="pt-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`w-full py-3.5 sm:py-4 px-6 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md ${
            status === "submitting"
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98] shadow-emerald-600/10 hover:shadow-emerald-600/20 font-extrabold cursor-pointer"
          }`}
        >
          {status === "submitting" ? "Registering Spot..." : (content.submitButtonText || "REGISTER NOW")}
        </button>
        {content.submitButtonSub && (
          <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-2.5 font-medium">
            {content.submitButtonSub}
          </p>
        )}
      </div>
    </form>
  );
}

const errorClass = "text-red-500 text-xs mt-2 sm:mt-1.5 font-semibold flex items-center gap-1.5";
