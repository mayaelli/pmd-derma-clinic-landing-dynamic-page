"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  Sparkles,
  MapPin,
  Star,
  Crown,
  Shield,
  ChevronRight,
  HeartPulse,
} from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import BookingModal from "./BookingModal";

// ── Fade-up helper ────────────────────────────────────────────────────────────
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Tier data ─────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    tagline: "Start Your Skin Journey",
    icon: Shield,
    color: {
      badge: "from-[#CD7F32] to-[#A0522D]",
      glow: "shadow-[#CD7F32]/20",
      border: "border-[#CD7F32]/30",
      ring: "ring-[#CD7F32]/20",
      text: "text-[#CD7F32]",
      bg: "bg-[#FDF6EE]",
      check: "text-[#CD7F32]",
      cta: "bg-[#CD7F32] hover:bg-[#A0522D]",
    },
    price: "Entry Level",
    priceNote: "Ask about enrollment fee at the clinic",
    recommended: false,
    benefits: [
      "10% discount on all consultations",
      "Access to members-only promos",
      "Birthday month reward",
      "Booking priority over walk-ins",
      "Dedicated patient file & history tracking",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    tagline: "Your Skin, Consistently Cared For",
    icon: Star,
    color: {
      badge: "from-[#A8A9AD] to-[#6E7074]",
      glow: "shadow-[#A8A9AD]/30",
      border: "border-[#A8A9AD]/40",
      ring: "ring-[#A8A9AD]/20",
      text: "text-[#6E7074]",
      bg: "bg-[#F7F8F8]",
      check: "text-[#6E7074]",
      cta: "bg-[#6E7074] hover:bg-[#4A4D50]",
    },
    price: "Most Popular",
    priceNote: "Ask about enrollment fee at the clinic",
    recommended: true,
    benefits: [
      "Everything in Bronze",
      "15% discount on all treatments",
      "1 complimentary basic facial per month",
      "Exclusive member pricing on packages",
      "SMS & email treatment reminders",
      "Seasonal skin assessment (2× per year)",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "The Full VIP Experience",
    icon: Crown,
    color: {
      badge: "from-[#D4AF37] to-[#A68A00]",
      glow: "shadow-[#D4AF37]/30",
      border: "border-[#D4AF37]/40",
      ring: "ring-[#D4AF37]/20",
      text: "text-[#A68A00]",
      bg: "bg-[#FDFAED]",
      check: "text-[#A68A00]",
      cta: "bg-[#D4AF37] hover:bg-[#A68A00]",
    },
    price: "Premium",
    priceNote: "Ask about enrollment fee at the clinic",
    recommended: false,
    benefits: [
      "Everything in Silver",
      "20% discount on all treatments",
      "2 complimentary sessions per month",
      "Priority scheduling — first slot access",
      "Complimentary annual skin assessment",
      "Dedicated patient coordinator",
      "Early access to new treatments & promos",
      "Exclusive Gold-member events & workshops",
    ],
  },
];

const STEPS = [
  {
    number: "01",
    title: "Visit the Clinic",
    desc: "Walk in or book a consultation. Let our staff know you're interested in a membership.",
  },
  {
    number: "02",
    title: "Choose Your Tier",
    desc: "Review the Bronze, Silver, or Gold benefits with our team and pick what fits your skin goals.",
  },
  {
    number: "03",
    title: "Enroll & Enjoy",
    desc: "Complete enrollment at the clinic counter and start enjoying your member benefits right away.",
  },
];

const FAQS = [
  {
    q: "Can I upgrade my membership tier later?",
    a: "Yes. You can upgrade from Bronze → Silver → Gold at any time by visiting the clinic. The difference in enrollment fee will be prorated.",
  },
  {
    q: "Is the membership monthly or annual?",
    a: "Our membership is structured annually. Ask our front desk team about the current enrollment terms and validity period.",
  },
  {
    q: "Can I share my membership with a family member?",
    a: "Memberships are individual and non-transferable. However, we offer family enrollment packages — ask about these at the clinic.",
  },
  {
    q: "What happens to unused monthly sessions?",
    a: "Complimentary sessions (Silver and Gold) are valid within the calendar month and do not carry over. We encourage scheduling early in the month.",
  },
  {
    q: "Is there a lock-in period?",
    a: "No lock-in. Memberships run for 12 months from enrollment date and can be renewed or upgraded at expiry.",
  },
];

export function MembershipPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1817] font-sans antialiased selection:bg-[#FCE8E6]">
      <Header />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden border-b border-[#E8E2D9]">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FCE8E6]/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#F7F4EF]/80 blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E8E2D9] rounded-full shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C87D87]" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#706A63]">
              Precious MD Loyalty Program
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1817] leading-[1.1] tracking-tight"
          >
            Invest in Your Skin.
            <br />
            <em className="not-italic text-[#C87D87]">Earn Every Visit.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm sm:text-base text-[#706A63] leading-relaxed max-w-xl mx-auto font-light"
          >
            Our membership program rewards your commitment to consistent skin care.
            Choose a tier, visit the clinic to enroll, and enjoy exclusive benefits
            from your very first session.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F7F4EF] border border-[#E8E2D9] rounded-full text-xs text-[#706A63] font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C87D87] shrink-0" />
            Membership claimed in-person · Ground Floor, JGC Building, Iligan City
          </motion.div>
        </div>
      </section>

      {/* ── TIER CARDS ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <FadeUp className="text-center mb-12 space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87]">
              Choose Your Level
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Membership Tiers
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {TIERS.map((tier, i) => (
              <FadeUp key={tier.id} delay={i * 0.1}>
                <div
                  className={`relative rounded-3xl border-2 ${tier.color.border} ${tier.color.bg} ${tier.recommended
                    ? `ring-2 ${tier.color.ring} shadow-xl ${tier.color.glow} md:-translate-y-4`
                    : "shadow-sm"
                    } p-7 flex flex-col gap-6 transition-all duration-300 hover:shadow-lg`}
                >
                  {/* Recommended badge */}
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#A8A9AD] to-[#6E7074] text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-md whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  {/* Tier header */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.color.badge} flex items-center justify-center shadow-md`}>
                      <tier.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-serif text-xl font-semibold ${tier.color.text}`}>
                        {tier.name}
                      </h3>
                      <p className="text-[11px] text-[#706A63] font-medium">
                        {tier.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price note */}
                  <div className="space-y-0.5">
                    <p className={`font-serif text-lg font-semibold ${tier.color.text}`}>
                      {tier.price}
                    </p>
                    <p className="text-[10px] text-[#908A84]">{tier.priceNote}</p>
                  </div>

                  {/* Divider */}
                  <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${tier.color.text}`} />

                  {/* Benefits */}
                  <ul className="space-y-2.5 flex-1">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 ${tier.color.check} shrink-0 mt-0.5`} />
                        <span className="text-xs text-[#4A4440] leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => setBookingOpen(true)}
                    className={`w-full py-3 rounded-2xl ${tier.color.cta} text-white text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    Claim {tier.name} Membership
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Footnote */}
          <FadeUp delay={0.4} className="text-center mt-8">
            <p className="text-xs text-[#908A84]">
              All memberships are enrolled in-person at the clinic. Bring a valid ID.
              Benefits activate immediately upon enrollment.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white border-b border-[#E8E2D9]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">

          <FadeUp className="text-center mb-12 space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87]">
              Simple Process
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              How to Enroll
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-[#E8E2D9]" />

            {STEPS.map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.12} className="flex flex-col items-center text-center gap-4">
                <div className="relative w-16 h-16 rounded-full bg-[#FCE8E6] border-2 border-[#E8E2D9] flex items-center justify-center shrink-0 z-10">
                  <span className="font-serif text-lg font-semibold text-[#C87D87]">
                    {step.number}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm text-[#1A1817]">{step.title}</h3>
                  <p className="text-xs text-[#706A63] leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4} className="mt-12 text-center">
            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A1817] hover:bg-[#C87D87] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-[#C87D87]/30 cursor-pointer"
            >
              Book a Visit to Enroll
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── TIER COMPARISON TABLE ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-[#E8E2D9]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">

          <FadeUp className="text-center mb-10 space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87]">
              Side by Side
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Compare Tiers
            </h2>
          </FadeUp>

          <FadeUp delay={0.1} className="overflow-x-auto rounded-2xl border border-[#E8E2D9] shadow-sm">
            <table className="w-full text-[10px] sm:text-xs text-left min-w-[480px]">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  <th className="p-2 sm:p-4 font-semibold text-[#1A1817] bg-white w-2/5">Benefit</th>
                  {TIERS.map((tier) => (
                    <th key={tier.id} className={`p-2 sm:p-4 text-center font-bold ${tier.color.text} ${tier.color.bg}`}>
                      <div className="flex flex-col items-center gap-1">
                        <tier.icon className="w-4 h-4" />
                        {tier.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Consultation discount", values: ["10%", "15%", "20%"] },
                  { label: "Members-only promos", values: [true, true, true] },
                  { label: "Birthday reward", values: [true, true, true] },
                  { label: "Booking priority", values: [true, true, true] },
                  { label: "Complimentary sessions/month", values: ["—", "1 session", "2 sessions"] },
                  { label: "Skin assessment", values: ["—", "2× per year", "Annual"] },
                  { label: "SMS & email reminders", values: ["—", true, true] },
                  { label: "Exclusive package pricing", values: ["—", true, true] },
                  { label: "Priority scheduling", values: ["—", "—", true] },
                  { label: "Dedicated coordinator", values: ["—", "—", true] },
                  { label: "Early treatment access", values: ["—", "—", true] },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-[#E8E2D9] ${i % 2 === 0 ? "bg-white" : "bg-[#FDFCFA]"}`}>
                    <td className="p-2 sm:p-4 text-[#4A4440] font-medium">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className={`p-2 sm:p-4 text-center ${TIERS[j].color.bg}`}>
                        {val === true ? (
                          <Check className={`w-4 h-4 ${TIERS[j].color.check} mx-auto`} />
                        ) : val === false ? (
                          <span className="text-[#C8C3BC]">—</span>
                        ) : (
                          <span className={`font-semibold ${TIERS[j].color.text}`}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#F7F4EF] border-b border-[#E8E2D9]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">

          <FadeUp className="text-center mb-10 space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C87D87]">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Frequently Asked
            </h2>
          </FadeUp>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-[#FDFCFA] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-semibold text-[#1A1817] pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-[#C87D87]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs text-[#706A63] leading-relaxed border-t border-[#E8E2D9] pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#1A1817]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center space-y-6">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C87D87]" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/60">
                Ready to Join?
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-snug">
              Your skin deserves
              <br />
              <em className="not-italic text-[#C87D87]">consistent care.</em>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto">
              Visit us at the clinic to enroll in a membership tier that fits your
              skin goals and budget. Our staff will walk you through everything.
            </p>
          </FadeUp>
          <FadeUp delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md shadow-[#C87D87]/25 hover:-translate-y-0.5 cursor-pointer"
            >
              <HeartPulse className="w-4 h-4" />
              Book a Visit
            </button>
            <a
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors"
            >
              Learn about the clinic
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </FadeUp>
        </div>
      </section>

      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
