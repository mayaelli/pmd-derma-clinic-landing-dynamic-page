"use client";

import { useState, useEffect } from "react";
import { clinicConfig } from "@/config/clinicConfig";
import { Calendar, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  onBookClick?: () => void;
}

const HERO_IMAGES = [
  {
    src: "/precious-md-face.png",
    alt: "Precious MD Dermatology Center Signage",
  },
  {
    src: "/precious-md-hero-main.png",
    alt: "Dr. Precious - Board-Certified Dermatologist",
  },
  {
    src: "/precious-md-business-card.png",
    alt: "Precious MD Rose Monogram",
  },
];

export function Hero({ onBookClick }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="bg-[#FAF8F5] border-b border-[#E8E2D9] h-screen flex items-center overflow-hidden"
    >
      <div className="w-full h-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-stretch">

          {/* Left content column */}
          <div className="lg:col-span-5 flex flex-col justify-center px-5 sm:px-14 lg:px-16 py-8 lg:py-12 lg:mt-0 z-10 bg-[#FAF8F5] relative">

            {/* Subtle vertical accent line */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#E8E2D9] to-transparent hidden lg:block" />

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12, delayChildren: 0.1 },
                },
              }}
              className="space-y-6 max-w-lg"
            >
              {/* Eyebrow — location + credential */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2.5"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E8E2D9] rounded-full shadow-xs">
                  <svg className="w-3.5 h-3.5 text-[#C87D87] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[11px] font-semibold text-[#665E58] tracking-wide">
                    PDS Board-Certified · Iligan City
                  </span>
                </div>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.215, 0.61, 0.355, 1] } },
                }}
                className="font-serif font-bold text-[#2B2625] leading-[1.1] tracking-tight"
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                  WebkitFontSmoothing: "antialiased",
                }}
              >
                <span className="block text-[#665E58] font-light text-lg sm:text-xl mb-1" style={{ fontFamily: "inherit" }}>
                  Iligan&apos;s Dermatologist
                </span>
                Your Skin,{" "}
                <span className="text-[#C87D87] relative inline-block">
                  in Expert Hands.
                  <svg className="absolute -bottom-1 left-0 w-full h-[6px]" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <path d="M0,3 Q25,0.5 50,3 T100,3 T150,3 T200,3" fill="none" stroke="#C87D87" strokeWidth="1.5" opacity="0.35" />
                  </svg>
                </span>
              </motion.h1>

              {/* One-line description */}
              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="text-sm sm:text-[15px] font-light text-[#706A63] leading-relaxed"
              >
                Expert clinical dermatology and aesthetic care — from acne protocols
                to skin rejuvenation — tailored for every patient.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="flex flex-wrap items-center gap-3 pt-1"
              >
                <button
                  onClick={onBookClick}
                  className="inline-flex items-center gap-2 bg-[#C88F9A] hover:bg-[#b67d8c] text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Consultation
                </button>

                <a
                  href={`tel:${clinicConfig.phone}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F4EF] text-[#2B2625] border border-[#E8E2D9] text-sm font-medium px-6 py-3.5 rounded-full transition-all duration-300 shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#C87D87]" />
                  {clinicConfig.phone}
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } } }}
                className="grid grid-cols-3 gap-4 pt-5 border-t border-[#E8E2D9]"
              >
                {[
                  { value: "18K+", label: "Followers" },
                  { value: "10+", label: "Years of Practice" },
                  { value: "20+", label: "Procedures" },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <div className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#2B2625]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-[#8C857B] uppercase tracking-wider mt-0.5 font-medium truncate">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* 60% Width Image Slideshow Container */}
          <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] lg:h-full w-full bg-[#F0ECE6] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={HERO_IMAGES[currentImageIndex].src}
                  alt={HERO_IMAGES[currentImageIndex].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center"
                />
                {/* Soft gradient edge overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#FAF8F5] lg:via-transparent lg:to-transparent lg:w-32" />
              </motion.div>
            </AnimatePresence>

            {/* Slide Pagination Overlay */}
            <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-20 flex items-center gap-3 bg-[#FAF8F5]/80 backdrop-blur-md px-4 py-2 border border-[#E8E2D9]">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1 transition-all duration-300 cursor-pointer ${currentImageIndex === index
                    ? "w-8 bg-[#2B2625]"
                    : "w-2 bg-[#2B2625]/30 hover:bg-[#2B2625]/60"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
