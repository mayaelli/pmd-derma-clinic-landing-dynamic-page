"use client";

import { clinicConfig } from "@/config/clinicConfig";
import { ShieldCheck, Calendar, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  onBookClick?: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  return (
    <div id="hero" className="bg-white border-b border-slate-200 min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">

        {/* Animated Text Column */}
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
          className="space-y-6 max-w-xl"
        >
          {/* Top Badge: Pioneering Hair Restoration */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
            }}
            className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-sans font-semibold shadow-sm hover:shadow-md transition-shadow"
          >
            <Sparkles className="w-4 h-4 text-[#C87D87] shrink-0" />
            <span>Iligan’s First & Only Hair Transplant Service</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] } },
            }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-[#2D2B30] leading-[1.15] tracking-tight"
          >
            Board-Certified Medical Care &{" "}
            <span className="relative inline-block text-[#C87D87] underline decoration-[#F0C4CB] decoration-wavy decoration-2 underline-offset-8">
              Hair Restoration
            </span>
          </motion.h1>



          {/* Supporting Paragraph */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="font-sans text-slate-700 text-sm sm:text-base leading-relaxed"
          >
            Providing comprehensive care across hair, skin, and nails—from advanced diagnostic pathology and surgical procedures to aesthetic treatments, personally directed by a board-certified dermatologist.
          </motion.p>

          {/* Interactive Call to Action Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                onBookClick?.();
              }}
              className="inline-flex items-center gap-2.5 bg-[#CD9581] hover:bg-[#B8846F] text-white font-sans text-xs font-semibold tracking-wide px-7 py-4 rounded-xl shadow-[0_10px_25px_rgba(205,149,129,0.35)] hover:shadow-[0_15px_30px_rgba(205,149,129,0.45)] transition-all"
            >
              <Calendar className="w-4 h-4 text-white/80" />
              Book Availability
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${clinicConfig.phone}`}
              className="inline-flex items-center gap-2.5 bg-white/90 hover:bg-white border border-[#E3E4E8] text-[#2D2B30] font-sans text-xs font-semibold tracking-wide px-7 py-4 rounded-xl shadow-xs hover:shadow-md transition-all backdrop-blur-sm"
            >
              <Phone className="w-4 h-4 text-[#908A94]" />
              {clinicConfig.phone}
            </motion.a>
          </motion.div>

          {/* Stats Cards Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200"
          >
            {clinicConfig.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex flex-col items-start p-3 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-sm shadow-xs transition-all hover:bg-white/70 hover:shadow-xs"
              >
                <div className="font-serif text-2xl font-bold text-[#2D2B30] tracking-tight">{stat.value}</div>
                <div className="font-sans text-[10px] font-semibold text-[#908A94] uppercase tracking-wider mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Image Container */}
        <div className="relative flex items-center justify-center w-full min-h-[460px] md:min-h-[520px]">

          {/* Ambient Background Glow 1 (Blush) */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.35, 0.5, 0.35],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-6 -right-6 w-72 h-72 bg-[#F0C4CB] rounded-full blur-3xl pointer-events-none"
          />

          {/* Ambient Background Glow 2 (Antique Rose Accent) */}
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#C87D87] rounded-full blur-3xl pointer-events-none"
          />

          {/* Main Image Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
              scale: 1
            }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              y: {
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }}
            className="relative z-10 w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(30,41,59,0.08)] border border-white/60 bg-white/40 backdrop-blur-sm group transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(30,41,59,0.12)]"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
              <Image
                src="/precious-md-new-hero.png"
                alt="Dr. Precious - Board-Certified Dermatologist"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Floating Glassmorphism Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, 6, 0]
            }}
            transition={{
              opacity: { delay: 0.5, duration: 0.5 },
              x: { delay: 0.5, duration: 0.5 },
              y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            className="absolute -bottom-2 -left-2 md:-left-6 z-20 bg-white/80 backdrop-blur-md border border-white/80 p-3.5 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F8BFC5] flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-[#E48EAB]" />
            </div>
            <div>
              <div className="font-serif text-xs font-bold text-[#333D29]">PDS Accredited</div>
              <div className="font-sans text-[10px] text-[#908A94]">Board Certified Medical Care</div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}