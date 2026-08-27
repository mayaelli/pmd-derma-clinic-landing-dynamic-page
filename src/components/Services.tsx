"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { clinicConfig, ServicesConfig, ServiceItem } from "@/config/clinicConfig";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  X,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Activity,
  ClipboardList,
} from "lucide-react";

interface ServicesProps {
  services?: ServicesConfig;
  onBookClick?: () => void;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512290900673-7002c0228a48?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop",
];

export function Services({ services: passedServices, onBookClick }: ServicesProps) {  
  const [activeTab, setActiveTab] = useState<"medical" | "aesthetic" | "specialty">("medical");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use passed servicesData or fallback to local clinicConfig
  const services = passedServices || clinicConfig.services;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const tabs = [
    { id: "medical", label: "Medical & Surgical" },
    { id: "aesthetic", label: "Facial & Aesthetic" },
    { id: "specialty", label: "Specialized Care" },
  ] as const;

  return (
    <section id="services" className="scroll-mt-20 bg-white py-10 border-b border-[#E5BCA9]/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBEAD6]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E5BCA9]/50 text-[#C87D87] px-3.5 py-1 rounded-full text-xs font-sans font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C87D87]" />
              <span>Tailored Skin Treatments</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#333D29] tracking-tight">
              Clinical & Aesthetic Menu
            </h2>
            <p className="font-sans text-sm text-[#6B7556] leading-relaxed font-light">
              Explore specialized procedures directed personally by a board-certified dermatologist.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-[#E5BCA9]/40 bg-[#FAF7F2] hover:bg-[#6B7556] hover:text-white text-[#333D29] flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-[#E5BCA9]/40 bg-[#FAF7F2] hover:bg-[#6B7556] hover:text-white text-[#333D29] flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-full font-sans text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive ? "text-white" : "text-[#525B44] bg-[#FAF7F2] hover:bg-[#FBEAD6]/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-[#6B7556] rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {(services[activeTab] || []).map((service, idx) => {
              const imageSrc =
                service.image ||
                `/services/${activeTab}-${idx + 1}.jpg` ||
                FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedService({ ...service, image: imageSrc })}
                  className="snap-start min-w-[280px] sm:min-w-[320px] max-w-[340px] bg-[#FAF7F2]/60 rounded-3xl border border-[#E5BCA9]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 w-full bg-[#FBEAD6]/60 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={service.name}
                      fill
                      priority={idx === 0}
                      sizes="340px"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                      }}
                    />
                    
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sans font-semibold text-[#6B7556] border border-white/80 shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#C87D87]" />
                      <span>Dermatologist Supervised</span>
                    </div>

                    <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white text-[#333D29] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="w-4 h-4 text-[#C87D87]" />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white/80 backdrop-blur-xs">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-[#333D29] group-hover:text-[#C87D87] transition-colors">
                        {service.name}
                      </h3>
                      <p className="font-sans text-xs text-[#525B44] leading-relaxed line-clamp-3 font-light">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5BCA9]/30 flex items-center justify-between text-xs font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B7556]">
                        <Clock className="w-3.5 h-3.5 text-[#C87D87]" />
                        30–45 Mins
                      </span>
                      <span className="font-semibold text-[#C87D87] group-hover:underline flex items-center gap-0.5">
                        View Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Dynamic Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-[#333D29]/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5BCA9]/50 z-10 flex flex-col max-h-[90vh]"
            >
              <div className="relative h-48 md:h-56 w-full bg-[#FAF7F2] shrink-0">
                <Image
                  src={selectedService.image || FALLBACK_IMAGES[0]}
                  alt={selectedService.name}
                  fill
                  sizes="600px"
                  className="object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGES[0];
                  }}
                />

                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#333D29] flex items-center justify-center transition-all shadow-md z-20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-[#C87D87] shadow-xs uppercase">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#333D29]">
                    {selectedService.name}
                  </h3>
                  <p className="font-sans text-xs text-[#525B44] leading-relaxed font-light mt-2">
                    {selectedService.desc}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-[#FAF7F2] rounded-2xl border border-[#E5BCA9]/30 text-center">
                    <Clock className="w-4 h-4 text-[#C87D87] mx-auto mb-1" />
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">Duration</span>
                    <span className="text-xs font-semibold text-[#333D29]">30–45 Mins</span>
                  </div>
                  <div className="p-2.5 bg-[#FAF7F2] rounded-2xl border border-[#E5BCA9]/30 text-center">
                    <ShieldCheck className="w-4 h-4 text-[#6B7556] mx-auto mb-1" />
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">Provider</span>
                    <span className="text-xs font-semibold text-[#333D29]">Board-Certified MD</span>
                  </div>
                  <div className="p-2.5 bg-[#FAF7F2] rounded-2xl border border-[#E5BCA9]/30 text-center">
                    <Activity className="w-4 h-4 text-[#C87D87] mx-auto mb-1" />
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">Recovery</span>
                    <span className="text-xs font-semibold text-[#333D29]">
                      {selectedService.recovery || "7–10 Days Course"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-xs font-bold text-[#333D29] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#C87D87]" />
                    Common Symptoms & Indications
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#525B44]">
                    {(
                      selectedService.symptoms || [
                        "Expanding redness & localized warmth",
                        "Localized pain or skin tenderness",
                        "Localized swelling & tissue tightness",
                        "Abscesses, cysts, or bacterial lesions",
                      ]
                    ).map((symptom, i) => (
                      <li key={i} className="flex items-start gap-1.5 bg-[#FAF7F2]/50 p-2 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7556] shrink-0 mt-0.5" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-xs font-bold text-[#333D29] uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-[#6B7556]" />
                    What Your Visit Includes
                  </h4>
                  <ol className="text-xs text-[#525B44] space-y-2">
                    {(
                      selectedService.includes || [
                        "Direct clinical assessment by Dr. Precious Usman Imam",
                        "Pathogen screening & culture swab sampling (if indicated)",
                        "Custom targeted prescription (oral or topical antibiotics)",
                        "Follow-up monitoring plan to prevent infection recurrence",
                      ]
                    ).map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#E5BCA9]/20 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-[#C87D87]/10 text-[#C87D87] font-bold text-[10px] flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Emergency Precaution:</strong>
                    {selectedService.warning ||
                      "If you are experiencing a high fever, systemic chills, or rapidly spreading red streaks along your skin, please seek immediate emergency department care."}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E5BCA9]/30">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#525B44] hover:bg-[#FAF7F2] transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      onBookClick?.();
                    }}
                    className="inline-flex items-center gap-2 bg-[#6B7556] hover:bg-[#586146] text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#FBEAD6]" />
                    <span>Book Appointment</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}