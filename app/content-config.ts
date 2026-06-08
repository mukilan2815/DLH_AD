export interface LandingContent {
  _version?: string;
  headline: string;
  headlineHighlight: string;
  subheadline: string;
  urgencyText: string;
  webinarTitle: string;
  bulletPoints: string[];
  webinarDate: string;
  webinarTime: string;
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
  speakerName: string;
  speakerRole: string;
  speakerCompany: string;
  registerAnotherText: string;
  stickyButtonText: string;
}

const CURRENT_VERSION = "2";

export const defaultContent: LandingContent = {
  _version: CURRENT_VERSION,
  headline: "Learn how to make more than 35,000 side income every month",
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
  webinarDate: "Webinar Happens 9th June 2026",
  webinarTime: "Tuesday @ 07:00 PM",
  whatsappLink: "https://chat.whatsapp.com/YOUR_GROUP_LINK",
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
  successTitle: "You are Registered",
  successMessage: "Your registration has been saved. See you at the webinar.",
  speakerName: "Anushree",
  speakerRole: "Performance Marketing Strategist",
  speakerCompany: "Brand Monk Group of Companies",
  registerAnotherText: "Register Another Person",
  stickyButtonText: "Register Now",
};

const STORAGE_KEY = "dlh_landing_content";

export function getContent(): LandingContent {
  if (typeof window === "undefined") return defaultContent;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultContent;
  try {
    const parsed = JSON.parse(raw) as Partial<LandingContent>;
    // Reset if cached version is stale
    if (parsed._version !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return defaultContent;
    }
    return { ...defaultContent, ...parsed };
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: Partial<LandingContent>): void {
  if (typeof window === "undefined") return;
  const current = getContent();
  const merged = { ...current, ...content };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function resetContent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
