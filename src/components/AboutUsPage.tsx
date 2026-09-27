"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Award,
  GraduationCap,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Microscope,
  Star,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { fetchDoctors, fetchClinicInfo, type Doctor } from "@/lib/doctorActions";
import BookingModal from "./BookingModal";

// ── Fade-up on scroll helper ──────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 28);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const STATS = [
  { value: 5, suffix: "+", label: "Years of Clinical Excellence" },
  { value: 3000, suffix: "+", label: "Patients Treated" },
  { value: 20, suffix: "+", label: "Aesthetic Procedures" },
  { value: 100, suffix: "%", label: "Board-Certified Care" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Clinical Integrity",
    desc: "Every recommendation is evidence-based, guided by the latest dermatological research and standards.",
  },
  {
    icon: HeartPulse,
    title: "Patient-First Approach",
    desc: "We listen deeply before we treat — because understanding your skin story is the foundation of every plan.",
  },
  {
    icon: Microscope,
    title: "Precision Aesthetics",
    desc: "Advanced technology paired with an artistic eye delivers natural, nuanced results that enhance — not alter.",
  },
  {
    icon: Star,
    title: "Lasting Confidence",
    desc: "Our goal isn't a single visit — it's a lifelong partnership in skin health and self-confidence.",
  },
];

export function AboutUsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  // Default to the featured doctor index — updated after data loads
  const [activeDoctor, setActiveDoctor] = useState(0);
  const [clinicDescription, setClinicDescription] = useState("");
  const [missionStatement, setMissionStatement] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [credHovered, setCredHovered] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [info, docs] = await Promise.all([fetchClinicInfo(), fetchDoctors()]);
        if (info) {
          setMissionStatement(info.mission_statement || "");
          setClinicDescription(info.clinic_description || "");
        }
        // Featured doctor always first, and set as default active
        const sorted = [...docs].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        setDoctors(sorted);
        // Pre-select the featured doctor if one exists
        const featuredIndex = sorted.findIndex((d) => d.is_featured);
        setActiveDoctor(featuredIndex >= 0 ? featuredIndex : 0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const doctor = doctors[activeDoctor] ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-5 h-5 border border-[#C87D87] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#706A63]">Loading</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1817] font-sans antialiased selection:bg-[#FCE8E6]">
      <Header />

      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-0 lg:min-h-[90vh] flex items-center overflow-hidden border-b border-[#E8E2D9] bg-[#FAF8F5]">

        {/* Subtle decorative circle */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#FCE8E6]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-[400px] h-[400px] rounded-full bg-[#F7F4EF]/80 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-center pt-24 pb-16 lg:py-0">

          {/* Left — headline */}
          <div className="lg:col-span-6 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E8E2D9] rounded-full shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C87D87]" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#706A63]">
                The Sanctuary &amp; Science
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1817] leading-[1.1] tracking-tight"
            >
              Where Science
              <br />
              <em className="not-italic text-[#C87D87]">Meets Skin.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="text-sm sm:text-base text-[#706A63] leading-relaxed max-w-lg font-light"
            >
              {missionStatement ||
                "Dedicated to delivering compassionate, world-class dermatologic and aesthetic care tailored to your unique skin health journey."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-3 pt-2"
            >
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1817] hover:bg-[#C87D87] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-[#C87D87]/30 cursor-pointer"
              >
                Book a Consultation
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="#doctor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#706A63] hover:text-[#C87D87] transition-colors cursor-pointer"
              >
                Meet the Doctor
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>

          {/* Right — doctor portrait */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm lg:max-w-md pb-8">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border border-[#E8E2D9] bg-[#F7F4EF]" />
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#E8E2D9] shadow-xl bg-[#F7F4EF]">
                <Image
                  src={
                    doctors.find((d) => d.is_featured)?.image_url ||
                    doctors[0]?.image_url ||
                    "/precious-md-new-doctor.png"
                  }
                  alt="Precious MD Doctor"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 15%" }}
                  sizes="(max-width: 768px) 90vw, 420px"
                  priority
                />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF8F5]/60 to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -bottom-5 -left-5 bg-white border border-[#E8E2D9] rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FCE8E6] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-[#C87D87]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#706A63] font-medium">Board Certified</p>
                  <p className="text-xs font-bold text-[#1A1817]">Dermatologist</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#706A63] font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-[#C87D87] to-transparent"
          />
        </motion.div>
      </section>

      {/* ── 2. STATS STRIP ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E8E2D9] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-[#E8E2D9]">
            {STATS.map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.08} className="text-center px-2 sm:px-4">
                <p className="font-serif text-3xl sm:text-4xl font-light text-[#C87D87]">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] text-[#706A63] font-medium tracking-wide mt-1.5 leading-snug">
                  {stat.label}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ABOUT / PHILOSOPHY ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Left image collage */}
            <FadeUp delay={0} className="lg:col-span-5">
              <div className="relative h-[420px] sm:h-[500px]">
                <div className="absolute top-0 left-0 w-2/3 h-3/4 rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-md">
                  <Image
                    src="/facial.jpg"
                    alt="Precious MD Clinic"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-md">
                  <Image
                    src="/microneedling.jpg"
                    alt="Precious MD Signage"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                {/* Decorative dot grid */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 grid grid-cols-4 gap-1.5 opacity-30">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C87D87]" />
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Right text */}
            <div className="lg:col-span-7 space-y-6">
              <FadeUp delay={0.1}>
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87] block">
                  Our Philosophy
                </span>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1817] leading-relaxed">
                  &ldquo;{missionStatement || "Dedicated to world-class dermatologic care tailored to your unique skin health."}&rdquo;
                </h2>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="w-12 h-px bg-[#C87D87]" />
              </FadeUp>
              <FadeUp delay={0.35}>
                <p className="text-sm text-[#706A63] leading-relaxed font-light">
                  {clinicDescription ||
                    "At Precious MD, we blend advanced clinical expertise with personalized treatments to restore confidence and accentuate your natural beauty. Every patient is met with deep respect, careful listening, and a commitment to transparent, honest care."}
                </p>
              </FadeUp>

              {/* Values grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {VALUES.map((val, i) => (
                  <FadeUp key={val.title} delay={0.4 + i * 0.08}>
                    <div className="group p-4 rounded-2xl bg-white border border-[#E8E2D9] hover:border-[#C87D87]/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-[#FCE8E6] flex items-center justify-center shrink-0 group-hover:bg-[#C87D87] transition-colors duration-300">
                          <val.icon className="w-4 h-4 text-[#C87D87] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1A1817]">{val.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#706A63] leading-relaxed">{val.desc}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. DOCTOR SHOWCASE ─────────────────────────────────────────────── */}
      {doctors.length > 0 && (
        <section id="doctor" className="py-20 lg:py-28 bg-[#F7F4EF] border-b border-[#E8E2D9]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            <FadeUp className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87] block mb-1.5">
                    Medical Direction
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1817]">
                    Meet the Specialist
                  </h2>
                </div>
                {/* Doctor selector — numbered chevron nav */}
                {doctors.length > 1 && (
                  <div className="hidden sm:flex items-center gap-3">
                    <button
                      onClick={() => setActiveDoctor((i) => (i - 1 + doctors.length) % doctors.length)}
                      className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white text-[#706A63] hover:border-[#C87D87] hover:text-[#C87D87] flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Previous doctor"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    <span className="text-xs font-mono text-[#706A63] tabular-nums">
                      {String(activeDoctor + 1).padStart(2, "0")} / {String(doctors.length).padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => setActiveDoctor((i) => (i + 1) % doctors.length)}
                      className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white text-[#706A63] hover:border-[#C87D87] hover:text-[#C87D87] flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Next doctor"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </FadeUp>

            <AnimatePresence mode="wait">
              {doctor && (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start"
                >
                  {/* Portrait */}
                  <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-4">
                    <div className="relative w-full max-w-[280px] lg:max-w-full mb-6">
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#E8E2D9] shadow-lg relative">
                        {doctor.image_url ? (
                          <Image
                            src={doctor.image_url}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                            style={{ objectPosition: "center 15%" }}
                            sizes="(max-width: 1024px) 280px, 320px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-6xl text-[#C87D87]/30">
                            {doctor.name.charAt(0)}
                          </div>
                        )}
                        {/* Subtle color overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F4EF]/80 to-transparent" />
                      </div>

                      {/* Featured badge */}
                      {doctor.is_featured && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute -bottom-4 left-4 bg-[#1A1817] text-white px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider flex items-center gap-1.5 shadow-lg"
                        >
                          <Award className="w-3 h-3 text-[#C87D87]" />
                          Featured Specialist
                        </motion.div>
                      )}
                    </div>

                    {/* Mobile doctor selector — numbered chevron */}
                    {doctors.length > 1 && (
                      <div className="flex sm:hidden items-center gap-3 mt-2">
                        <button
                          onClick={() => setActiveDoctor((i) => (i - 1 + doctors.length) % doctors.length)}
                          className="w-7 h-7 rounded-full border border-[#E8E2D9] bg-white text-[#706A63] flex items-center justify-center cursor-pointer"
                          aria-label="Previous doctor"
                        >
                          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                        </button>
                        <span className="text-[10px] font-mono text-[#706A63] tabular-nums">
                          {activeDoctor + 1} / {doctors.length}
                        </span>
                        <button
                          onClick={() => setActiveDoctor((i) => (i + 1) % doctors.length)}
                          className="w-7 h-7 rounded-full border border-[#E8E2D9] bg-white text-[#706A63] flex items-center justify-center cursor-pointer"
                          aria-label="Next doctor"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bio panel */}
                  <div className="lg:col-span-8 space-y-7 lg:pt-4">

                    {/* Name + title */}
                    <div>
                      <motion.h3
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1817] leading-tight"
                      >
                        {doctor.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[11px] font-semibold tracking-[0.25em] text-[#C87D87] uppercase mt-2"
                      >
                        {doctor.title_role}
                      </motion.p>
                    </div>

                    {/* Quote / Bio */}
                    {(doctor.quote || doctor.bio) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="relative pl-5 border-l-2 border-[#C87D87]"
                      >
                        <p className="font-serif text-base sm:text-lg text-[#4A4440] italic leading-relaxed font-light">
                          &ldquo;{doctor.quote || doctor.bio}&rdquo;
                        </p>
                      </motion.div>
                    )}

                    {/* Bio text (if separate from quote) */}
                    {doctor.bio && doctor.quote && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-[#706A63] leading-relaxed font-light"
                      >
                        {doctor.bio}
                      </motion.p>
                    )}

                    {/* Credentials */}
                    {doctor.credentials?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="pt-5 border-t border-[#E8E2D9] space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#C87D87]" />
                          <h4 className="text-[10px] font-bold text-[#1A1817] uppercase tracking-[0.2em]">
                            Credentials &amp; Affiliations
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {doctor.credentials.map((cred, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + idx * 0.05 }}
                              onMouseEnter={() => setCredHovered(idx)}
                              onMouseLeave={() => setCredHovered(null)}
                              className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200 cursor-default ${credHovered === idx
                                ? "bg-[#C87D87] text-white border-[#C87D87] shadow-sm shadow-[#C87D87]/30"
                                : "bg-white text-[#4A4440] border-[#E8E2D9] hover:border-[#C87D87]/50"
                                }`}
                            >
                              {cred}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-2"
                    >
                      <button
                        onClick={() => setBookingOpen(true)}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C87D87] hover:bg-[#B8707A] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md shadow-[#C87D87]/25 hover:shadow-[#C87D87]/40 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <HeartPulse className="w-4 h-4" />
                        Book a Consultation with {doctor.name.split(" ")[0]}
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ── 5. SOCIAL MEDIA ────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <FadeUp className="mb-12">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87] block mb-1.5">
              Follow Along
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Find Us Online
            </h2>
            <p className="text-sm text-[#706A63] font-light mt-2 max-w-lg">
              Stay updated with skin care tips, promos, and clinic news across our social channels.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-end">
            {[
              {
                platform: "Facebook",
                handle: "@PreciousMDDermatology",
                followers: "18K+ Followers",
                url: "https://facebook.com/PreciousMDDermatology",
                screenshot: null, // replace with "/your-fb-screenshot.png" when ready
                color: "from-[#1877F2] to-[#0d5fc7]",
                iconBg: "bg-[#1877F2]",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
              },
              {
                platform: "Instagram",
                handle: "@preciousmddermatology",
                followers: "Follow for skin tips",
                url: "https://instagram.com/preciousmddermatology",
                screenshot: null,
                color: "from-[#833AB4] via-[#E1306C] to-[#F77737]",
                iconBg: "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5 text-white">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" strokeWidth={0} />
                  </svg>
                ),
              },
              {
                platform: "TikTok",
                handle: "@preciousmdclinic",
                followers: "Derm tips & reels",
                url: "https://tiktok.com/@preciousmdclinic",
                screenshot: null,
                color: "from-[#010101] to-[#2b2b2b]",
                iconBg: "bg-[#010101]",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.86 4.86 0 01-1.01-.06z" />
                  </svg>
                ),
              },
            ].map((social, i) => (
              <FadeUp key={social.platform} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-5">

                  {/* Mock phone frame */}
                  <div className="relative w-[200px] mx-auto">
                    {/* Phone shell */}
                    <div className="relative bg-[#1A1817] rounded-[2.5rem] p-2.5 shadow-2xl ring-1 ring-white/10">
                      {/* Notch */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#1A1817] rounded-full z-20 flex items-center justify-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2C2825]" />
                        <div className="w-6 h-1.5 rounded-full bg-[#2C2825]" />
                      </div>

                      {/* Screen */}
                      <div className="relative rounded-[2rem] overflow-hidden bg-[#F7F4EF]" style={{ aspectRatio: "9/16" }}>
                        {social.screenshot ? (
                          <img
                            src={social.screenshot}
                            alt={`${social.platform} page`}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          /* Placeholder screen */
                          <div className="w-full h-full flex flex-col">
                            {/* Platform header bar */}
                            <div className={`h-14 bg-gradient-to-r ${social.color} flex items-center px-4 gap-2.5`}>
                              <div className={`w-7 h-7 rounded-full ${social.iconBg} flex items-center justify-center shrink-0 ring-1 ring-white/20`}>
                                {social.icon}
                              </div>
                              <div>
                                <p className="text-white text-[9px] font-bold leading-tight">{social.handle}</p>
                                <p className="text-white/70 text-[8px]">{social.followers}</p>
                              </div>
                            </div>
                            {/* Placeholder content blocks */}
                            <div className="flex-1 p-3 space-y-2 bg-white">
                              <div className="grid grid-cols-3 gap-1">
                                {Array.from({ length: 9 }).map((_, j) => (
                                  <div
                                    key={j}
                                    className="aspect-square rounded-sm bg-[#F0EBE5]"
                                    style={{ opacity: 1 - j * 0.06 }}
                                  />
                                ))}
                              </div>
                              <div className="space-y-1.5 pt-1">
                                <div className="h-2 rounded-full bg-[#F0EBE5] w-3/4" />
                                <div className="h-2 rounded-full bg-[#F0EBE5] w-1/2" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Subtle screen glare */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Home indicator */}
                      <div className="mt-2 flex justify-center">
                        <div className="w-20 h-1 rounded-full bg-white/20" />
                      </div>
                    </div>

                    {/* Side buttons */}
                    <div className="absolute -right-1.5 top-20 w-1 h-10 bg-[#2C2825] rounded-r-sm" />
                    <div className="absolute -left-1.5 top-16 w-1 h-7 bg-[#2C2825] rounded-l-sm" />
                    <div className="absolute -left-1.5 top-26 w-1 h-7 bg-[#2C2825] rounded-l-sm" />
                  </div>

                  {/* Platform info below phone */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${social.iconBg} flex items-center justify-center`}>
                        {social.icon}
                      </div>
                      <span className="font-semibold text-sm text-[#1A1817]">{social.platform}</span>
                    </div>
                    <p className="text-xs text-[#706A63]">{social.handle}</p>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A1817] hover:bg-[#C87D87] text-white text-[11px] font-semibold rounded-full transition-all duration-300 cursor-pointer"
                    >
                      Follow Us
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. LOCATION & HOURS ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <FadeUp className="mb-10">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87] block mb-1.5">
              Find Us
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Visit the Clinic
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Info card */}
            <FadeUp delay={0.1} className="lg:col-span-4">
              <div className="h-full bg-[#1A1817] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#C87D87]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.25em] text-white/40 uppercase mb-1">Address</p>
                      <p className="text-sm text-white/80 font-light leading-relaxed">
                        Ground Floor, JGC Building<br />
                        Badelles Street, Poblacion<br />
                        Iligan City, Philippines 9200
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-[#C87D87]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.25em] text-white/40 uppercase mb-1">Hours</p>
                      <p className="text-sm text-white/80 font-light leading-relaxed">
                        Mon – Fri: 9:00 AM – 6:00 PM<br />
                        Sat: 9:00 AM – 2:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-[#C87D87]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.25em] text-white/40 uppercase mb-1">Contact</p>
                      <p className="text-sm text-white/80 font-light leading-relaxed">
                        +1 (555) 019-2834<br />
                        concierge@preciousmd.com
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setBookingOpen(true)}
                  className="w-full py-3 rounded-2xl bg-[#C87D87] hover:bg-[#B8707A] text-white text-xs font-semibold transition-all duration-300 cursor-pointer shadow-md shadow-[#C87D87]/20"
                >
                  Book an Appointment
                </button>
              </div>
            </FadeUp>

            {/* Map */}
            <FadeUp delay={0.2} className="lg:col-span-8">
              <div className="h-full min-h-[360px] rounded-3xl overflow-hidden border border-[#E8E2D9] shadow-sm">
                <iframe
                  title="Clinic Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3!2d124.2452!3d8.2280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ff8b0000000001%3A0x1!2sJGC+Building%2C+Badelles+St%2C+Iligan+City%2C+Lanao+del+Norte!5e0!3m2!1sen!2sph!4v1710000000000!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "360px" }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      <Footer />

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
