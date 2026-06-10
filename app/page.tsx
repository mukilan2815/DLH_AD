"use client";

import Image from "next/image";
import WebinarForm from "./RegistrationForm";
import Marquee from "./Marquee";
import { getContent, fetchContentFromDb, type LandingContent } from "./content-config";
import { useEffect, useState } from "react";
import ExitIntentModal from "./ExitIntentModal";
import {
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  Award,
  Users,
  TrendingUp,
  Globe,
  Briefcase,
  Zap,
  Star,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [content, setContent] = useState<LandingContent>(getContent());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    // Fetch from DB on mount and refetch every 5 seconds
    const fetchContent = async () => {
      const dbContent = await fetchContentFromDb();
      if (dbContent) setContent(dbContent);
    };

    fetchContent();
    const interval = setInterval(fetchContent, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    const card = document.getElementById("registration-form-card");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const nameInput = document.getElementsByName("firstName")[0];
      if (nameInput) {
        setTimeout(() => nameInput.focus({ preventScroll: true }), 800);
      }
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const cardDetails = [
    {
      icon: TrendingUp,
      title: "Passive Income Mastery",
      color: "from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600"
    },
    {
      icon: Globe,
      title: "Instant Web Creation",
      color: "from-amber-50 to-orange-50 border-amber-100 text-amber-600"
    },
    {
      icon: Briefcase,
      title: "Career Opportunities",
      color: "from-blue-50 to-indigo-50 border-blue-100 text-blue-600"
    },
    {
      icon: Zap,
      title: "Agency & Freelancing",
      color: "from-purple-50 to-pink-50 border-purple-100 text-purple-600"
    }
  ];

  const faqs = [
    {
      question: "Is this webinar really free?",
      answer: "Yes, this masterclass is 100% free of charge. Our mission at Digital Learners Hub is to empower learners with practical digital skills. No credit card is required."
    },
    {
      question: "Who is this masterclass for?",
      answer: "This is built for students, corporate employees looking for a secondary income source, freelancers, and small business owners who want to scale their operations using modern digital marketing methodologies."
    },
    {
      question: "What if I cannot attend live at the scheduled time?",
      answer: "While we highly recommend attending live to participate in the interactive Q&A and claim free bonus templates."
    },
    {
      question: "Do I need any technical background?",
      answer: "Not at all. We teach step-by-step using no-code tools and beginner-friendly frameworks, so you do not need any coding experience to succeed."
    }
  ];

  return (
    <>
      {/* Main Page Content */}
      <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-emerald-100 selection:text-slate-900 relative overflow-hidden">
        
        {/* Soft Background Accent Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-[120px] pointer-events-none" />

        {/* Global Navigation Header */}
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Digital Learners Hub" width={180} height={52} className="object-contain" priority />
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{content.urgencyText || "Spots filling fast"}</span>
              </span>
              <button
                onClick={scrollToForm}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs md:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Claim Seat
              </button>
            </div>
          </div>
        </header>

        {/* Marquee Banner */}
        <Marquee />

        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-8 items-start lg:items-center">
            
            {/* LEFT COLUMN: Hero Copy & Countdown */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Live Status Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE MASTERCLASS</span>
                </div>
              </div>

              {/* Dynamic Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                {content.headline}
                <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  {content.headlineHighlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-8">
                {content.subheadline || "Learn high-income digital marketing skills directly from working professionals."}
              </p>

              {/* Mini Date Badge - Centered */}
              <div className="flex justify-center w-full mb-6">
                <div className="flex flex-col items-center text-center bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">📅 {content.webinarDate}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">⏰ {content.webinarTime} IST</p>
                </div>
              </div>

              {/* Bullets List (Hero) */}
              <div className="space-y-3 mt-8 hidden lg:block">
                {content.bulletPoints.slice(0, 3).map((point, index) => (
                  <div key={index} className="flex items-start gap-3 text-slate-600 text-sm font-semibold">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Ticket Card Form */}
            <div id="registration-form-card" className="lg:col-span-5 relative w-full">
              <div className="absolute -inset-1.5 bg-slate-200/60 rounded-[2rem] blur-md opacity-40 transition duration-500" />

              <div className="relative bg-white border border-slate-150 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-200/50 w-full">
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                    {content.formHeaderTag || "FREE REGISTRATION"}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-3 leading-tight">
                    {content.formHeaderSub || "Reserve Your Spot Instantly"}
                  </h2>
                </div>

                <WebinarForm content={content} whatsappLink={content.whatsappLink} />

                {/* Secure Badge */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600/80" />
                  <span>{content.trustText || "Your registration is secure & 100% free"}</span>
                </div>
              </div>
            </div>

          </div>
        </section>



        {/* SPEAKER PROFILE SECTION */}
        <section className="border-t border-slate-200/60 bg-slate-100/30 relative">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Speaker Photo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-1 bg-slate-200 rounded-2xl blur opacity-25" />
                  <div className="relative border border-slate-200 bg-white p-3 rounded-2xl shadow-sm">
                    <Image 
                      src="/anushree.jpg" 
                      alt={content.speakerName} 
                      width={380} 
                      height={420} 
                      className="rounded-xl object-cover w-full h-[400px]" 
                      priority
                    />
                    <div className="absolute top-6 right-6 bg-white border border-slate-200 rounded-full px-3.5 py-1 text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live Instructor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaker Bio */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Meet Your Coach
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-1">
                  {content.speakerName}
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  {content.speakerRole} <span className="text-emerald-600">@ {content.speakerCompany}</span>
                </p>

                <div className="mt-8 space-y-4 max-w-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Active Industry Practitioner</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Anushree manages client portfolios and scales ad campaign channels live every day, teaching with real-world scenarios.</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">100% Practical Focus</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Zero theoretical fluff. Walk away with exact blueprints, checklist resources, and tools you can start using today.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="border-t border-slate-200/60 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 lg:py-20">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Support & Help
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index}
                    className="bg-white border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm md:text-base">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-48 border-t border-slate-100" : "max-h-0"
                    }`}>
                      <p className="px-6 py-4 text-xs md:text-sm text-slate-500 font-medium leading-relaxed bg-slate-50/40">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SCROLL FOOTER BAR */}
        <div className={`fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl transition-all duration-300 ${
          showSticky ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        }`}>
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-1 rounded-md border border-slate-200 hidden sm:block">
              <Image src="/logo.png" alt="Digital Learners Hub" width={80} height={24} className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">🎓 Webinar Registration Open</p>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-md">
                  📅 {content.webinarDate}
                </div>
                <div className="text-slate-700 font-semibold text-sm">
                  {content.webinarTime}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={scrollToForm}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 w-full md:w-auto cursor-pointer"
            >
              <span>{content.stickyButtonText || "Register Now"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 relative z-10 text-center">
          <div className="max-w-7xl mx-auto px-6 text-slate-400 text-xs font-medium space-y-4">
            <p>&copy; {new Date().getFullYear()} Digital Learners Hub. All rights reserved.</p>
            <p className="max-w-md mx-auto leading-relaxed">
              Disclaimer: This masterclass is for educational purposes. Success depends on effort, implementation, and market factors. We do not guarantee dynamic side incomes without work.
            </p>
          </div>
        </footer>

        {/* Exit Intent Modal recapture */}
        <ExitIntentModal
          headline="Don't Miss This Opportunity! ⏳"
          sub="Seats are filling up fast for tonight's live webinar. Grab your free spot before the countdown ends."
          cta="Register For Free Now"
          onCtaClick={scrollToForm}
        />

      </div>
    </>
  );
}


