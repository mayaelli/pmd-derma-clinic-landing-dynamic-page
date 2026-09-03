"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Maximize2,
  X,
  Clock,
  Check,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import type { PromoCampaign } from "@/lib/getPromos";

interface PromosProps {
  promos?: PromoCampaign[];
  onBookClick?: () => void;
}

export function Promos({ promos = [], onBookClick }: PromosProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Auto-expiration & Date Logic ─────────────────────────────────────────
  const processedPromos = useMemo(() => {
    const now = new Date();

    return promos
      .map((promo) => {
        let isExpired = false;
        let isExpiringSoon = false;

        // Parse optional expiration date if structured in promo or validity
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
      // Filter out promos that are expired (or keep them at the end if flagged)
      .sort((a, b) => Number(a.isExpired) - Number(b.isExpired));
  }, [promos]);

  const activePromos = useMemo(
    () => processedPromos.filter((p) => !p.isExpired),
    [processedPromos]
  );

  const hasData = activePromos.length > 0;

  // ── Carousel Controls ──────────────────────────────────────────────────────
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Keyboard accessibility for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  return (
    <section
      id="promos"
      className="scroll-mt-20 bg-white py-12 border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-3.5 py-1 rounded-lg text-xs font-sans font-semibold shadow-sm">
              <Tag className="w-3.5 h-3.5 text-[#C87D87]" />
              <span>Special Packages & Deals</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2B30] tracking-tight">
              Current Clinical Promos
            </h2>
            <p className="font-sans text-sm text-slate-700">
              Swipe through our exclusive board-certified dermatological bundles and limited-time offers.
            </p>
          </div>

          {/* Navigation Arrows for Carousel */}
          {hasData && (
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full bg-white border border-[#E5BCA9]/50 flex items-center justify-center text-[#525B44] hover:text-[#E48EAB] hover:border-[#E48EAB]/40 shadow-xs transition-all cursor-pointer"
                aria-label="Previous promo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full bg-white border border-[#E5BCA9]/50 flex items-center justify-center text-[#525B44] hover:text-[#E48EAB] hover:border-[#E48EAB]/40 shadow-xs transition-all cursor-pointer"
                aria-label="Next promo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Empty State ────────────────────────────────────────────────── */}
        {!hasData ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#E5BCA9]" />
            </div>
            <p className="font-serif text-base font-bold text-[#333D29]">No Active Promos</p>
            <p className="font-sans text-sm text-slate-700 max-w-xs">
              There are no ongoing promotions at the moment. Please check back soon for exclusive deals.
            </p>
          </div>
        ) : (
          /* ── Horizontal Scroll Carousel ────────────────────────────────── */
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#E5BCA9]/40 scrollbar-track-transparent"
          >
            {activePromos.map((promo) => (
              <div
                key={promo.id}
                className="snap-start shrink-0 w-[88vw] sm:w-[520px] lg:w-[620px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Expiring Soon Banner */}
                {promo.isExpiringSoon && (
                  <div className="bg-[#FFF5F3] border-b border-[#FADCD9] text-[#9E5755] px-4 py-1.5 text-[11px] font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Ending Soon! Grab this offer before it expires.</span>
                  </div>
                )}

                <div className="p-6 grid md:grid-cols-12 gap-6 items-start">

                  {/* Poster Thumbnail Column */}
                  <div className="md:col-span-5 relative group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-[4/5] w-full">
                    <Image
                      src={promo.pubmatImage || "/precious-md-promo.jpg"}
                      alt={promo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      onClick={() =>
                        setLightboxImage(promo.pubmatImage || "/precious-md-promo.jpg")
                      }
                      className="absolute inset-0 bg-[#333D29]/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer p-2 text-center"
                    >
                      <span className="bg-white/95 text-[#333D29] px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md flex items-center gap-1.5">
                        <Maximize2 className="w-3 h-3 text-[#C87D87]" />
                        Full Poster
                      </span>
                    </div>
                  </div>

                  {/* Promo Details Column */}
                  <div className="md:col-span-7 space-y-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {promo.badge && (
                          <span className="bg-[#C87D87] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                            {promo.badge}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">
                          <Clock className="w-3 h-3 text-[#C87D87]" />
                          Valid: {promo.validity}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#2D2B30] leading-snug">
                        {promo.title}
                      </h3>
                      {promo.subtitle && (
                        <p className="font-sans text-sm text-slate-700 mt-1 line-clamp-2">
                          {promo.subtitle}
                        </p>
                      )}

                      {/* Package Itemized Rates */}
                      <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                        {promo.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                          >
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <div className="font-sans text-xs font-semibold text-[#333D29] truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-[#908A94] font-medium">
                                {item.sessions}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-serif text-xs md:text-sm font-bold text-[#C87D87]">
                                {item.price}
                              </div>
                              {item.originalPrice && (
                                <div className="text-[9px] text-[#525B44]/60 line-through">
                                  {item.originalPrice}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Action Bar */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 mt-auto">
                  <span className="text-[11px] text-slate-600 hidden sm:flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#E48EAB]" />
                    Includes consultation evaluation
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <a
                      href="https://m.me/preciousmdclinic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E3E4E8] text-[#2D2B30] text-xs font-semibold px-3.5 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#908A94]" />
                      <span>Inquire</span>
                    </a>
                    <button
                      onClick={() => onBookClick?.()}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                      <span>Claim Deal</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── Pubmat Lightbox Viewer Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xs"
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
                className="absolute -top-10 right-0 md:-top-4 md:-right-4 z-10 w-9 h-9 rounded-full bg-white text-gray-800 shadow-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border border-[#E5BCA9]/40"
                aria-label="Close poster"
              >
                <X className="w-4 h-4 text-[#333D29]" />
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