"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare, CheckCircle2 } from "lucide-react";
import { FeedbackItem } from "@/lib/getFeedbacks";

interface FeedbackProps {
  initialFeedbacks?: FeedbackItem[];
}

export function Feedback({ initialFeedbacks = [] }: FeedbackProps) {
  const testimonials = initialFeedbacks;
  const hasData = testimonials.length > 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section id="feedback" className="scroll-mt-15 bg-white py-10 border-b border-[#E5BCA9]/30 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[300px] bg-[#FBEAD6]/50 blur-3xl rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-4 space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-3.5 py-1 rounded-lg text-xs font-sans font-semibold shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-[#C87D87]" />
            <span>Patient Experiences</span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#333D29] tracking-tight">
            Words From Our Clients
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#525B44] font-light leading-relaxed">
            Real stories and honest feedback from patients who trusted us with their skin journey.
          </p>
        </div>

        {!hasData ? (
          /* ── Empty State ── */
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E5BCA9]/40 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#E5BCA9]" />
            </div>
            <p className="font-serif text-base font-bold text-[#333D29]">Reviews Unavailable</p>
            <p className="font-sans text-xs text-[#525B44] font-light max-w-xs">
              Patient feedback will appear here once it&apos;s been added. Check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Hero Quote Card */}
            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-lg">

              {/* Top Decorative Elements */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E5BCA9]/30 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-[#C87D87]" />
                </div>
                <div className="text-xs font-sans font-semibold text-[#908A94] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E5BCA9]/30">
                  {currentIndex + 1} <span className="text-[#C87D87]">/</span> {testimonials.length}
                </div>
              </div>

              {/* Animated Quote Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id || currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: current.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C87D87] text-[#C87D87]" />
                    ))}
                  </div>

                  {/* Large Review Statement */}
                  <blockquote className="font-serif text-lg sm:text-2xl text-[#333D29] leading-relaxed font-medium italic">
                    &ldquo;{current.comment}&rdquo;
                  </blockquote>

                  {/* Patient Profile Footer */}
                  <div className="pt-6 border-t border-[#E5BCA9]/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base font-bold text-[#333D29]">
                          {current.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#908A94] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E5BCA9]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#C87D87]" /> Verified Patient
                        </span>
                      </div>
                      {current.roleOrService && (
                        <p className="font-sans text-xs text-[#C87D87] font-semibold">
                          Procedure: {current.roleOrService}
                        </p>
                      )}
                    </div>
                    {current.date && (
                      <span className="text-xs text-[#525B44]/70 font-light">{current.date}</span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Flanking Arrow Controls */}
              <div className="absolute top-1/2 -left-5 sm:-left-6 -translate-y-1/2">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-white border border-[#E5BCA9]/50 text-[#2D2B30] hover:bg-[#CD9581] hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute top-1/2 -right-5 sm:-right-6 -translate-y-1/2">
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-white border border-[#E5BCA9]/50 text-[#2D2B30] hover:bg-[#CD9581] hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Nav Pills */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                    ? "w-8 bg-[#CD9581]"
                    : "w-2.5 bg-[#E5BCA9]/50 hover:bg-[#CD9581]"
                    }`}
                  aria-label={`View feedback from ${t.name}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
