"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import type { PromoCampaign } from "@/lib/getPromos";

interface PromosProps {
  promos?: PromoCampaign[];
  onBookClick?: () => void;
}

const formatPrice = (priceStr?: string) => {
  if (!priceStr) return "";
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return priceStr;
  return `₱${num.toLocaleString("en-PH")}`;
};

export function Promos({ promos = [], onBookClick }: PromosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // ── Date & Expiration Logic ──────────────────────────────────────────────
  const processedPromos = useMemo(() => {
    const now = new Date();

    return promos
      .map((promo) => {
        let isExpired = false;
        let isExpiringSoon = false;

        if (promo.validUntil) {
          const expiryDate = new Date(promo.validUntil);
          isExpired = expiryDate < now;
          const diffDays = Math.ceil(
            (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          isExpiringSoon = diffDays > 0 && diffDays <= 5;
        }

        return {
          ...promo,
          isExpired,
          isExpiringSoon,
        };
      })
      .sort((a, b) => Number(a.isExpired) - Number(b.isExpired));
  }, [promos]);

  const activePromos = useMemo(
    () => processedPromos.filter((p) => !p.isExpired),
    [processedPromos]
  );

  const hasData = activePromos.length > 0;
  const currentPromo = activePromos[activeIndex] || activePromos[0];

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % activePromos.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + activePromos.length) % activePromos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 20 : -20,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -20 : 20,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2, ease: [0.42, 0, 1, 1] as [number, number, number, number] },
    }),
  };

  return (
    <section
      id="promos"
      className="scroll-mt-20 bg-[#FAF8F5] py-12 md:py-20 border-b border-[#E8E2D9] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hasData ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-3xl border border-[#E8E2D9] shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F4EF] border border-[#E3DCD3] flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#C87D87]" />
            </div>
            <p className="font-serif text-base font-bold text-[#1A1817]">No Active Promos</p>
            <p className="font-sans text-xs text-[#706A63] max-w-xs">
              There are no ongoing promotions at the moment. Please check back soon for exclusive deals.
            </p>
          </div>
        ) : (
          /* ── 3-Column Louvre Layout Split ───────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch lg:max-h-[85vh] lg:min-h-[420px]">

            {/* COLUMN 1: Title, Dynamic Inclusions List, and Action Button (~35% Width) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6 py-1">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white border border-[#E8E2D9] text-[#1A1817] px-3.5 py-1 rounded-full text-xs font-semibold shadow-2xs">
                  <Tag className="w-3.5 h-3.5 text-[#C87D87]" />
                  <span>Exclusive Clinical Package</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPromo.id + "-title"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl font-bold text-[#1A1817] tracking-tight leading-snug">
                      {currentPromo.title}
                    </h2>

                    {currentPromo.subtitle && (
                      <p className="font-sans text-xs sm:text-sm text-[#706A63] leading-relaxed">
                        {currentPromo.subtitle}
                      </p>
                    )}

                    {/* Redesigned Item Listing */}
                    {currentPromo.items.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#E8E2D9]">
                        {currentPromo.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E2D9] hover:border-[#C87D87]/50 hover:shadow-xs transition-all gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <CheckCircle2 className="w-4 h-4 text-[#C87D87] shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#2C2825] truncate group-hover:text-[#C87D87] transition-colors">
                                  {item.name}
                                </p>
                                {item.sessions && (
                                  <span className="text-[10px] text-[#8C857B] font-mono block">
                                    {item.sessions}
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.price && (
                              <div className="text-right shrink-0">
                                <span className="font-serif text-xs font-bold text-[#A65B66] block">
                                  {formatPrice(item.price)}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-[10px] text-[#A69E95] line-through block">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div>
                <button
                  onClick={() => onBookClick?.()}
                  className="inline-flex items-center justify-center gap-2 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold px-6 py-3.5 rounded-full shadow-md shadow-[#C87D87]/20 transition-all cursor-pointer active:scale-95 group w-full sm:w-auto"
                >
                  <span>Book This Package</span>
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* COLUMN 2: Featured Media Poster Card (~40% Width) */}
            <div className="lg:col-span-5 relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentPromo.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative h-full min-h-[280px] sm:min-h-[360px] md:min-h-[420px] rounded-3xl overflow-hidden border border-[#E8E2D9] group shadow-xs bg-[#F7F4EF] flex flex-col justify-between p-5"
                >
                  <Image
                    src={currentPromo.pubmatImage || "/precious-md-promo.jpg"}
                    alt={currentPromo.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-white/90 backdrop-blur-md text-[#1A1817] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {currentPromo.badge || "Featured Deal"}
                    </span>

                    {currentPromo.validity && (
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20">
                        <Clock className="w-3 h-3 text-[#E8A0A8]" />
                        {currentPromo.validity}
                      </span>
                    )}
                  </div>

                  {/* Bottom Text Overlay & Expand Trigger */}
                  <div className="relative z-10 flex items-end justify-between gap-4 mt-auto">
                    <div className="space-y-1 text-white max-w-[80%]">
                      <p className="font-serif text-lg sm:text-xl font-medium leading-snug drop-shadow-xs">
                        {currentPromo.title}
                      </p>
                      <p className="font-sans text-xs text-white/80 line-clamp-1">
                        Board-certified dermatological care & customized treatment plans.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setLightboxImage(currentPromo.pubmatImage || "/precious-md-promo.jpg")
                      }
                      className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1A1817] border border-white/40 backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                      aria-label="Expand image"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* COLUMN 3: Unified Warm Palette Card & Navigation (~25% Width) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4">

              {/* Inclusions & Highlights Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPromo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white text-[#1A1817] rounded-3xl p-5 border border-[#E8E2D9] flex flex-col justify-between h-full min-h-[260px] relative overflow-hidden shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2.5">
                      <span className="font-serif text-sm font-semibold text-[#2C2825]">
                        Treatment Summary
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#C87D87]" />
                    </div>

                    <p className="text-xs text-[#615B54] leading-relaxed">
                      All promotional packages include a comprehensive initial skin assessment by our certified dermatologists.
                    </p>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-1">
                      <span className="text-[10px] font-mono text-[#8C857B] uppercase block">Status</span>
                      <span className="text-xs font-semibold text-[#A65B66] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C87D87] animate-pulse" />
                        Available for Reservation
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://m.me/preciousmdclinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FCE8E6] text-[#C87D87] text-xs font-semibold py-2.5 px-4 rounded-2xl transition-colors text-center w-full border border-[#E5BCA9]/60 hover:border-[#C87D87]/30"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#C87D87]" />
                    <span>Inquire via Messenger</span>
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Navigation & Pagination Controls */}
              <div className="space-y-3">
                <p className="text-xs text-[#706A63] font-sans leading-snug">
                  Explore available offers or toggle through active promos.
                </p>

                {activePromos.length > 1 && (
                  <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D9]">
                    <span className="text-xs font-mono text-[#8C857B] font-semibold">
                      0{activeIndex + 1} / 0{activePromos.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#1A1817] hover:bg-[#C87D87] hover:text-white hover:border-[#C87D87] transition-all cursor-pointer shadow-2xs active:scale-95"
                        aria-label="Previous promo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#1A1817] hover:bg-[#C87D87] hover:text-white hover:border-[#C87D87] transition-all cursor-pointer shadow-2xs active:scale-95"
                        aria-label="Next promo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </div>

      {/* ── Lightbox Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 md:-top-4 md:-right-4 z-10 w-9 h-9 rounded-full bg-white text-[#1A1817] shadow-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border border-[#E8E2D9]"
                aria-label="Close poster"
              >
                <X className="w-4 h-4 text-[#1A1817]" />
              </button>
              <div className="relative w-full h-[80vh] flex items-center justify-center">
                <Image
                  src={lightboxImage}
                  alt="Promo Poster"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain rounded-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}