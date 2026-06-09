"use client";

import { useEffect, useState } from "react";
import { getContent, saveContent, resetContent, type LandingContent } from "../content-config";

export default function EditContentSection() {
  const [content, setContent] = useState<LandingContent>(getContent());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(getContent());
  }, []);

  const updateField = (field: keyof LandingContent, value: string | string[]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateBullet = (index: number, value: string) => {
    const updated = [...content.bulletPoints];
    updated[index] = value;
    updateField("bulletPoints", updated);
  };

  const handleSave = () => {
    saveContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleReset = () => {
    if (confirm("Reset all content to default? This cannot be undone.")) {
      resetContent();
      setContent(getContent());
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200/80 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white";

  const labelClass = "text-xs font-bold text-gray-600 uppercase tracking-wider";

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">📝 Edit Landing Page Content</h2>
          <p className="text-sm text-gray-500 mt-1">
            Changes reflect immediately on the registration page.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-5 py-3 shadow-sm animate-bounce">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Saved successfully!
          </div>
        )}
      </div>

      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Headline */}
        <div>
          <label className={labelClass}>Headline</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.headline}
            onChange={(e) => updateField("headline", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Headline Highlight (colored part)</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.headlineHighlight}
            onChange={(e) => updateField("headlineHighlight", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Subheadline</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.subheadline}
            onChange={(e) => updateField("subheadline", e.target.value)}
          />
        </div>

        {/* Urgency */}
        <div>
          <label className={labelClass}>Urgency Strip Text (mobile)</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.urgencyText}
            onChange={(e) => updateField("urgencyText", e.target.value)}
          />
        </div>

        {/* Webinar Title */}
        <div>
          <label className={labelClass}>Webinar Section Title</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.webinarTitle}
            onChange={(e) => updateField("webinarTitle", e.target.value)}
          />
        </div>

        {/* Bullet Points */}
        <div>
          <label className={labelClass}>Bullet Points (4 items)</label>
          <div className="space-y-2 mt-1.5">
            {content.bulletPoints.map((bp, i) => (
              <input
                key={i}
                className={inputClass}
                value={bp}
                onChange={(e) => updateBullet(i, e.target.value)}
                placeholder={`Bullet point ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Webinar Date Line</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.webinarDate}
              onChange={(e) => updateField("webinarDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Webinar Time Line</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.webinarTime}
              onChange={(e) => updateField("webinarTime", e.target.value)}
            />
          </div>
        </div>

        {/* WhatsApp Link */}
        <div>
          <label className={labelClass}>WhatsApp Group Link</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.whatsappLink}
            onChange={(e) => updateField("whatsappLink", e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Users will see a &quot;Join WhatsApp&quot; button after registering.
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Form Header Tag</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.formHeaderTag}
              onChange={(e) => updateField("formHeaderTag", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Form Header Subtext</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.formHeaderSub}
              onChange={(e) => updateField("formHeaderSub", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name Placeholder</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.firstNamePlaceholder}
              onChange={(e) => updateField("firstNamePlaceholder", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Email Placeholder</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.emailPlaceholder}
              onChange={(e) => updateField("emailPlaceholder", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>WhatsApp Placeholder</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.whatsappPlaceholder}
              onChange={(e) => updateField("whatsappPlaceholder", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Profession Label</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.professionLabel}
              onChange={(e) => updateField("professionLabel", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>City Placeholder</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.cityPlaceholder}
            onChange={(e) => updateField("cityPlaceholder", e.target.value)}
          />
        </div>

        {/* Button */}
        <div>
          <label className={labelClass}>Submit Button Text</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.submitButtonText}
            onChange={(e) => updateField("submitButtonText", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Submit Button Subtext</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.submitButtonSub}
            onChange={(e) => updateField("submitButtonSub", e.target.value)}
          />
        </div>

        {/* Trust & Success */}
        <div>
          <label className={labelClass}>Trust Line</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.trustText}
            onChange={(e) => updateField("trustText", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Success Title</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.successTitle}
              onChange={(e) => updateField("successTitle", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Success Message</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.successMessage}
              onChange={(e) => updateField("successMessage", e.target.value)}
            />
          </div>
        </div>

        {/* Speaker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Speaker Name</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.speakerName}
              onChange={(e) => updateField("speakerName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Speaker Role</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.speakerRole}
              onChange={(e) => updateField("speakerRole", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Speaker Company</label>
            <input
              className={inputClass + " mt-1.5"}
              value={content.speakerCompany}
              onChange={(e) => updateField("speakerCompany", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Sticky Button Text (mobile)</label>
          <input
            className={inputClass + " mt-1.5"}
            value={content.stickyButtonText}
            onChange={(e) => updateField("stickyButtonText", e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={handleSave}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-extrabold text-white shadow transition-all hover:scale-[1.02] hover:from-emerald-600 hover:to-teal-600"
        >
          💾 Save Changes
        </button>
        <button
          onClick={handleReset}
          className="rounded-xl bg-gray-50 border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
        >
          ↺ Reset to Default
        </button>
      </div>
    </div>
  );
}
