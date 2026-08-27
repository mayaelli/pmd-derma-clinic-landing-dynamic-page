"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Calendar,
  UserCheck,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Are all procedures performed by a board-certified dermatologist?",
    answer:
      "Yes. Every medical, surgical, and aesthetic procedure is either personally conducted or directly supervised by Dr. Precious to ensure strict clinical safety and professional standards.",
  },
  {
    question: "Do I need to schedule a consultation before booking a procedure?",
    answer:
      "We highly recommend an initial consultation. This allows Dr. Precious to evaluate your skin type, discuss medical history, and design a custom treatment plan suited specifically to your goals.",
  },
  {
    question: "Is there any downtime after facial or laser treatments?",
    answer:
      "Downtime varies by procedure. Mild treatments like Hydra Facials have zero downtime, while deeper laser or meso treatments may cause mild redness for 24–48 hours. Post-care guidelines are provided after every session.",
  },
  {
    question: "What payment methods do you accept at the clinic?",
    answer:
      "We accept Cash, GCash, Bank Transfers, and major Credit/Debit cards directly at our Iligan City clinic.",
  },
];

export function TrustAndFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [imageError, setImageError] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="about-faq"
      className="scroll-mt-20 bg-white py-20 border-b border-[#E5BCA9]/30 relative overflow-hidden"
    >
      {/* Subtle Ambient Background Accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FBEAD6]/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -ml-20" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-[#F0C4CB]/20 rounded-full blur-3xl pointer-events-none -mr-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E5BCA9]/50 text-[#C87D87] px-3.5 py-1 rounded-full text-xs font-sans font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C87D87]" />
            <span>Expertise & Answers</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#333D29] tracking-tight">
            Meet Your Dermatologist & FAQ
          </h2>

          <p className="font-sans text-sm text-[#525B44] font-light leading-relaxed">
            Learn more about our medical leadership and find clear answers to common treatment questions.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Doctor Profile Card (5 Cols) */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#E5BCA9]/40 shadow-xs space-y-6 relative">
            
            {/* Image Container with Fallback */}
            <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-[#FBEAD6]/60 border border-[#E5BCA9]/30 flex items-center justify-center">
              {!imageError ? (
                <Image
                  src="/doctor-portrait.jpg"
                  alt="Dr. Precious - Board Certified Dermatologist"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                /* Fallback Graphic when image isn't available */
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#C87D87]/15 flex items-center justify-center text-[#C87D87]">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <span className="font-serif text-lg font-bold text-[#333D29]">
                    Dr. Precious, MD
                  </span>
                  <span className="text-xs text-[#6B7556]">Board-Certified Dermatologist</span>
                </div>
              )}

              {/* Floating Badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C87D87]/15 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#C87D87]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#333D29]">Board-Certified MD</div>
                  <div className="text-[10px] text-[#6B7556]">Dermatology Specialist</div>
                </div>
              </div>
            </div>

            {/* Doctor Bio Details */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#333D29]">
                Dr. Precious
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#525B44] leading-relaxed font-light">
                Dedicated to providing evidence-based dermatological care. Specializing in medical skin conditions, advanced facial aesthetics, and personalized laser rejuvenation.
              </p>
            </div>

            {/* Quick Credentials List */}
            <div className="space-y-2.5 pt-3 border-t border-[#E5BCA9]/30">
              <div className="flex items-center gap-2.5 text-xs text-[#333D29] font-medium">
                <GraduationCap className="w-4 h-4 text-[#C87D87] shrink-0" />
                <span>Doctor of Medicine (MD)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#333D29] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#6B7556] shrink-0" />
                <span>Diplomate, Dermatological Society</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#333D29] font-medium">
                <Sparkles className="w-4 h-4 text-[#C87D87] shrink-0" />
                <span>Tailored Treatment Philosophy</span>
              </div>
            </div>

            {/* Direct CTA */}
            <a
              href="#booking"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#6B7556] hover:bg-[#586146] text-white text-xs font-semibold py-3.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-98"
            >
              <Calendar className="w-4 h-4 text-[#FBEAD6]" />
              <span>Consult Dr. Precious</span>
            </a>
          </div>

          {/* Right Column: Accordion FAQ (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#C87D87]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7556]">
                Frequently Asked Questions
              </span>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#FAF7F2] border-[#E5BCA9]/60 shadow-xs"
                        : "bg-white border-[#E5BCA9]/30 hover:border-[#E5BCA9]/60"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                    >
                      <span className="font-serif text-sm md:text-base font-bold text-[#333D29]">
                        {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 bg-[#C87D87] text-white"
                            : "bg-[#FAF7F2] text-[#333D29]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${idx}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-2 font-sans text-xs sm:text-sm text-[#525B44] leading-relaxed font-light border-t border-[#E5BCA9]/20">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}