"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Grid } from "lucide-react";
import { BentoCardData, ExtendedServiceItem } from "@/lib/getServicesServer";

interface HomeBentoProps {
  bentoCards: BentoCardData[];
  onSelectService?: (service: ExtendedServiceItem) => void;
}

export default function HomeBento({ bentoCards, onSelectService }: HomeBentoProps) {
  const slots: Record<number, BentoCardData> = {};
  bentoCards.forEach((card) => {
    slots[card.slot] = card;
  });

  return (
    <section className="bg-white py-10 sm:py-12 md:py-14 border-b border-[#E3DCD3]">
      {/* Max-width container with generous outer margins */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 lg:px-16 space-y-6 sm:space-y-8 md:space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E3DCD3] pb-4 gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[#A6626A] text-[10px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-[#C87D87]" />
              <span>Curated Selections</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1817] tracking-tight">
              Featured Procedures
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#706A63] font-light">
              Discover our signature aesthetic & clinical treatments.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5">
          {/* --- TOP SECTION --- */}
          {/* Slot 1: Top Left */}
          <BentoTile data={slots[1]} className="md:col-span-3 h-64 sm:h-64 md:h-72 lg:h-80" />

          {/* Slot 2: Top Middle */}
          <BentoTile data={slots[2]} className="md:col-span-3 h-64 sm:h-64 md:h-72 lg:h-80" />

          {/* Right Column Stack (Wide Horizontals) */}
          <div className="md:col-span-6 grid grid-cols-1 gap-3 sm:gap-4 md:gap-5">
            {/* Slot 3: Top Right Wide */}
            <BentoTile data={slots[3]} className="h-36 sm:h-36 md:h-40 lg:h-40" />
            {/* Slot 4: Middle Right Wide */}
            <BentoTile data={slots[4]} className="h-36 sm:h-36 md:h-40 lg:h-40" />
          </div>

          {/* --- BOTTOM SECTION --- */}
          {/* Slot 5: Bottom Left */}
          <BentoTile data={slots[5]} className="md:col-span-4 h-52 sm:h-52 md:h-56" />

          {/* Slot 6: Bottom Middle */}
          <BentoTile data={slots[6]} className="md:col-span-4 h-52 sm:h-52 md:h-56" />

          {/* Slot 7: Bottom Right CTA (View All) */}
          <ViewAllTile className="md:col-span-4 h-52 sm:h-52 md:h-56" />
        </div>
      </div>
    </section>
  );
}

function BentoTile({
  data,
  className = "",
}: {
  data?: BentoCardData;
  className?: string;
}) {
  if (!data) {
    return (
      <div className={`bg-[#EFECE8]/50 border border-dashed border-[#E3DCD3] rounded-2xl p-4 flex flex-col justify-end ${className}`}>
        <span className="text-[10px] text-[#A69E95] font-mono uppercase tracking-wider">Available Slot</span>
      </div>
    );
  }

  return (
    <Link
      href={data.href}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-[#E3DCD3]/60 bg-[#1A1817] shadow-xs ${className}`}
    >
      {/* Base Image */}
      {data.image ? (
        <Image
          src={data.image}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#C87D87] to-[#8A5BB5]" />
      )}

      {/* Base Black Overlay for Contrast */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-opacity duration-300" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Card Content */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10 text-white">
        <div>
          {data.category && (
            <span className="inline-block text-[9px] font-mono uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              {data.category}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-base sm:text-lg font-normal leading-snug drop-shadow-xs line-clamp-2">
            {data.title}
          </h3>

          {/* Minimalist Round Arrow Button */}
          <div className="w-8 h-8 rounded-full bg-white text-[#1A1817] flex items-center justify-center shrink-0 group-hover:bg-[#C87D87] group-hover:text-white transition-colors duration-300 shadow-sm">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ViewAllTile({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/services"
      className={`group rounded-2xl border border-[#E3DCD3] bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#C87D87]/60 hover:shadow-md transition-all duration-300 shadow-xs text-[#1A1817] ${className}`}
    >
      <div>
        <div className="w-9 h-9 rounded-xl bg-[#F7EFE9] border border-[#E8D7CD] flex items-center justify-center text-[#A6626A] mb-3">
          <Grid className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6626A] block">
          Full Catalog
        </span>
        <h3 className="font-serif text-xl font-normal text-[#1A1817] mt-1">
          View All Treatments
        </h3>
        <p className="text-xs text-[#706A63] font-light mt-1">
          Explore our full menu of clinical & cosmetic procedures.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#C87D87] font-medium pt-2">
        <span>Browse Catalog</span>
        <div className="w-8 h-8 rounded-full bg-[#F7EFE9] group-hover:bg-[#C87D87] text-[#A6626A] group-hover:text-white flex items-center justify-center transition-colors duration-300">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}