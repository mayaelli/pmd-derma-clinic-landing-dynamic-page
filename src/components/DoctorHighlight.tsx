"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  Award,
  GraduationCap,
  ShieldCheck,
  Building2,
  Globe2,
  Calendar,
  Sparkles,
  MapPin,
} from "lucide-react";

interface DoctorHighlightProps {
  onBookClick?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DoctorHighlight({ onBookClick }: DoctorHighlightProps) {
  const credentials = [
    {
      icon: GraduationCap,
      title: "RN, MD",
      desc: "Registered Nurse & Doctor of Medicine (2016)",
      color: "text-[#C87D87]",
      bg: "bg-[#C87D87]/10",
    },
    {
      icon: ShieldCheck,
      title: "FPDS Board-Certified",
      desc: "Fellow of the Philippine Dermatological Society",
      color: "text-[#908A94]",
      bg: "bg-[#908A94]/10",
    },
    {
      icon: Award,
      title: "DPACS Diplomate",
      desc: "Philippine Academy of Cutaneous Surgery",
      color: "text-[#E48EAB]",
      bg: "bg-[#E48EAB]/10",
    },
    {
      icon: Globe2,
      title: "FEAFWH Fellow",
      desc: "European Assoc. of Fellows in Wound Healing (Madrid)",
      color: "text-[#908A94]",
      bg: "bg-[#908A94]/10",
    },
    {
      icon: Building2,
      title: "EAMC Residency",
      desc: "Dermatology Training at East Avenue Medical Center",
      color: "text-[#E48EAB]",
      bg: "bg-[#E48EAB]/10",
    },
    {
      icon: Sparkles,
      title: "Harvard Medical School",
      desc: "Leadership in Medicine SE Asia Program Alumna",
      color: "text-[#CD9581]",
      bg: "bg-[#CD9581]/10",
    },
  ];

  return (
    <section
      id="about-doctor"
      className="scroll-mt-20 bg-[#FAF7F2] py-16 sm:py-20 border-b border-[#E5BCA9]/30 relative overflow-hidden"
    >
      {/* Ambient Background Glows */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 right-0 w-96 h-96 bg-[#FBEAD6]/50 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-[#E5BCA9]/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Column 1: Aesthetic Framed Doctor Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Outer Decorative Glowing Accent Ring */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-b from-[#E5BCA9]/60 via-[#F8BFC5]/20 to-[#E5BCA9]/40 opacity-70 blur-md pointer-events-none" />

              {/* Sophisticated Image Frame Box */}
              <div className="relative rounded-[2.25rem] overflow-hidden bg-white p-2.5 sm:p-3 border-2 border-white/90 shadow-2xl shadow-[#E48EAB]/10 backdrop-blur-md">
                <div className="relative aspect-4/5 w-full rounded-[1.75rem] overflow-hidden bg-[#FAF7F2]">
                  <Image
                    src="/precious-md-new-doctor.png"
                    alt="Dr. Precious Usman Imam, Board-Certified Dermatologist"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    quality={95}
                    unoptimized
                    className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                    priority
                  />
                </div>

                {/* Repositioned Floating Location Badge Inside Frame */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  animate={{ y: [0, -4, 0] }}
                  /* @ts-ignore */
                  transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                  className="absolute bottom-5 left-5 right-5 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E5BCA9]/50 shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E48EAB] animate-pulse" />
                    <span className="text-xs font-sans font-semibold text-[#333D29]">
                      Dr. Precious Usman Imam
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#C87D87]">
                    <MapPin className="w-3.5 h-3.5 text-[#C87D87]" />
                    <span>Iligan City</span>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>

          {/* Column 2: Biography & Staggered Credentials */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Badge & Title */}
            <div className="space-y-3 relative z-10 pt-2 lg:pt-0 text-left">
              <motion.div variants={itemVariants} className="inline-block">
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-3.5 py-1 rounded-lg text-xs font-sans font-semibold shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C87D87]" />
                  <span>Medical Leadership</span>
                </div>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2B30] tracking-tight leading-tight"
              >
                Dr. Precious Usman Imam
                <span className="block text-sm sm:text-base font-sans font-normal text-[#C87D87] mt-1">
                  RN, MD, FPDS
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="font-sans text-sm text-slate-700 leading-relaxed"
              >
                Dr. Precious Usman Imam is a board-certified dermatologist and the founder of the
                <strong className="font-semibold text-slate-900"> Precious MD Dermatology Center</strong> in Iligan City. She provides specialized medical, surgical, and aesthetic care to patients across Lanao del Norte and Lanao del Sur.
              </motion.p>
            </div>

            {/* Qualifications Grid */}
            <div className="space-y-3">
              <motion.h3
                variants={itemVariants}
                className="font-serif text-lg font-bold text-[#333D29] flex items-center gap-2"
              >
                Qualifications & Credentials
              </motion.h3>

              {/* Staggered Grid Cards */}
              <motion.div
                variants={containerVariants}
                className="grid sm:grid-cols-2 gap-3"
              >
                {credentials.map((cred, idx) => {
                  const Icon = cred.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-white p-3.5 rounded-2xl border border-[#E5BCA9]/30 shadow-xs hover:border-[#E5BCA9]/80 hover:shadow-sm transition-all group flex items-start gap-3 cursor-default"
                    >
                      <div className={`w-9 h-9 rounded-xl ${cred.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-4 h-4 ${cred.color}`} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-serif text-xs font-bold text-[#2D2B30] group-hover:text-[#C87D87] transition-colors">
                          {cred.title}
                        </div>
                        <div className="font-sans text-[11px] text-[#525B44] font-light leading-snug">
                          {cred.desc}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Action Bar */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                onClick={onBookClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[#CD9581] hover:bg-[#B8846F] text-white font-sans text-xs font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white/80" />
                <span>Book Consultation with Dr. Precious</span>
              </motion.button>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}