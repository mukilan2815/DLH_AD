export interface LandingContent {
  headline: string;
  headlineHighlight: string;
  subheadline: string;
  urgencyText: string;
  webinarTitle: string;
  bulletPoints: string[];
  webinarDate: string;
  webinarTime: string;
  webinarTargetDateTime: string;
  whatsappLink: string;
  formHeaderTag: string;
  formHeaderSub: string;
  firstNamePlaceholder: string;
  emailPlaceholder: string;
  whatsappPlaceholder: string;
  professionLabel: string;
  cityPlaceholder: string;
  submitButtonText: string;
  submitButtonSub: string;
  trustText: string;
  successTitle: string;
  successMessage: string;
  whatsappCtaText: string;
  speakerName: string;
  speakerRole: string;
  speakerCompany: string;
  registerAnotherText: string;
  stickyButtonText: string;
}

export const defaultContent: LandingContent = {
  headline: "Learn how to make more than ₹35,000 side income every month",
  headlineHighlight: " using Digital Marketing",
  subheadline: "(Even if you don't know anything about Digital Marketing)",
  urgencyText: "Only 47 free seats left for tonight's webinar.",
  webinarTitle: "What you will learn in this webinar",
  bulletPoints: [
    "How to earn 20K to 40K in a month using social media.",
    "How to create a website in 5 seconds and earn 15K to 45K a month.",
    "How to find Digital Marketing job opportunities and apply for it.",
    "How to become a freelancer or start your own digital marketing agency.",
  ],
  webinarDate: "Webinar Happens 12th June 2026",
  webinarTime: "Friday @ 7:00 PM",
  webinarTargetDateTime: "2026-06-12T19:00:00",
  whatsappLink: "https://chat.whatsapp.com/KVH9eo1PX1aH2fFmUg7ImN",
  formHeaderTag: "Free Registration",
  formHeaderSub: "Fill the form below to reserve your seat",
  firstNamePlaceholder: "First Name",
  emailPlaceholder: "Email ID",
  whatsappPlaceholder: "Whatsapp Number",
  professionLabel: "Select Your Profession",
  cityPlaceholder: "City",
  submitButtonText: "Register Now",
  submitButtonSub: "100% Free. No credit card required.",
  trustText: "Your information is secure. No spam, ever.",
  successTitle: "You are Registered!",
  successMessage: "Your spot has been successfully reserved. See you there!",
  whatsappCtaText: "TO GET THE WEBINAR LINK JOIN OUR WHATSAPP COMMUNITY👇",
  speakerName: "Anushree",
  speakerRole: "Performance Marketing Strategist",
  speakerCompany: "Brand Monk Group of Companies",
  registerAnotherText: "Register Another Person",
  stickyButtonText: "Register Now",
};

// Sync default content (returns hardcoded defaults synchronously)
export function getContent(): LandingContent {
  return defaultContent;
}

// Fetch from database (async)
export async function fetchContentFromDb(): Promise<LandingContent | null> {
  try {
    const res = await fetch(`/api/content?t=${Date.now()}`, {
      cache: "no-store",
    });
    const json = await res.json();
    console.log("[fetchContentFromDb] API response:", json);
    if (json.success && json.data) {
      return { ...defaultContent, ...json.data };
    }
    return null;
  } catch (err) {
    console.error("[fetchContentFromDb] error:", err);
    return null;
  }
}

// Save to database (async)
export async function saveContent(content: Partial<LandingContent>): Promise<boolean> {
  try {
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const json = await res.json();
    console.log("[saveContent] API response:", json);
    return json.success === true;
  } catch (err) {
    console.error("[saveContent] error:", err);
    return false;
  }
}

// Reset to defaults in database
export async function resetContent(): Promise<boolean> {
  return saveContent(defaultContent);
}
