"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Maximize2, X, Clock, Check, MessageCircle } from "lucide-react";
import type { PromoCampaign } from "@/lib/getPromos";

interface PromosProps {
  promos?: PromoCampaign[];
}

const activePromos: PromoCampaign[] = [
  {
    id: "summer-2026",
    title: "Summer Glow Specials",
    subtitle: "Exclusive bundle packages tailored for seasonal skin restoration.",
    validity: "April 1 – June 1, 2026",
    pubmatImage: "/precious-md-promo.jpg",
    badge: "Limited Offer",
    items: [
      { name: "Slimming Meso", sessions: "4 sessions", price: "₱20,000" },
      { name: "Face Firming Meso", sessions: "4 sessions", price: "₱15,000" },
      { name: "Face Whitening Meso", sessions: "4 sessions", price: "₱12,000" },
      { name: "Lifting & Brightening Meso Botox", sessions: "1 session", price: "₱10,000" },
      { name: "Underarm Botox (Sweatox)", sessions: "1 session", price: "₱10,000" },
      { name: "Underarm Diode Hair Removal", sessions: "4 sessions", price: "₱6,000" },
      { name: "Brazilian Diode Hair Removal", sessions: "4 sessions", price: "₱7,000" },
      { name: "Hydra Facial & Black Doll Combo", sessions: "1 session", price: "₱3,500", originalPrice: "₱5,500" },
    ],
  },
];

export function Promos({ promos: passedPromos }: PromosProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const displayPromos = passedPromos && passedPromos.length > 0 ? passedPromos : activePromos;

  return (
    <section id="promos" className="scroll-mt-20 bg-[#FAF7F2] py-12 border-b border-[#E5BCA9]/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white border border-[#C87D87]/40 text-[#C87D87] px-3.5 py-1 rounded-full text-xs font-sans font-semibold shadow-xs">
            <Tag className="w-3.5 h-3.5 text-[#C87D87]" />
            <span>Special Packages</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#333D29] tracking-tight">
            Current Clinical Promos
          </h2>
          <p className="font-sans text-sm text-[#6B7556] font-light">
            Grab board-certified dermatological treatments bundled at exclusive promotional rates.
          </p>
        </div>

        {/* Promo Campaigns Grid */}
        {displayPromos.map((promo) => (
          <div key={promo.id} className="grid lg:grid-cols-12 gap-8 items-start bg-white rounded-3xl p-6 md:p-8 border border-[#E5BCA9]/40 shadow-sm mb-8 last:mb-0">
            
            {/* Visual Column: Pubmat Card */}
            <div className="lg:col-span-5 relative group rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E5BCA9]/30 shadow-xs">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={promo.pubmatImage || "/precious-md-promo.jpg"}
                  alt={promo.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                />
                
                <div 
                  onClick={() => setLightboxImage(promo.pubmatImage || "/precious-md-promo.jpg")}
                  className="absolute inset-0 bg-[#333D29]/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                >
                  <span className="bg-white/90 text-[#333D29] px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-[#C87D87]" />
                    View Full Poster
                  </span>
                </div>
              </div>
            </div>

            {/* Content Column: Pricing Menu */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-[#C87D87] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                    {promo.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6B7556] font-medium bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E5BCA9]/30">
                    <Clock className="w-3.5 h-3.5 text-[#C87D87]" />
                    Valid: {promo.validity}
                  </span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#333D29]">
                  {promo.title}
                </h3>
                <p className="font-sans text-xs text-[#525B44] mt-1 font-light">
                  {promo.subtitle}
                </p>

                {/* Structured Itemized Rates */}
                <div className="mt-6 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {promo.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2]/70 hover:bg-[#FAF7F2] border border-[#E5BCA9]/20 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-sans text-xs md:text-sm font-semibold text-[#333D29]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#6B7556] font-medium">
                          {item.sessions}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-sm md:text-base font-bold text-[#C87D87]">
                          {item.price}
                        </div>
                        {item.originalPrice && (
                          <div className="text-[10px] text-[#525B44]/60 line-through">
                            {item.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Call */}
              <div className="pt-4 border-t border-[#E5BCA9]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#6B7556] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#C87D87]" />
                  Includes doctor consultation evaluation
                </span>
                <a
                  href="https://m.me/preciousmdclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6B7556] hover:bg-[#586146] text-white text-xs font-semibold px-7 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Inquire about this promo</span>
                </a>
              </div>

            </div>

          </div>
        ))}

      </div>

    {/* Pubmat Lightbox Viewer */}
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
              {/* Floating Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 md:-top-4 md:-right-4 z-10 w-10 h-10 rounded-full bg-white text-gray-800 shadow-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                aria-label="Close poster"
              >
                <X className="w-5 h-5 text-[#333D29]" />
              </button>

              {/* Poster Image Container */}
              <div className="relative w-full h-[80vh] flex items-center justify-center">
                <Image
                  src={lightboxImage}
                  alt="Promo Poster"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain rounded-xl"
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