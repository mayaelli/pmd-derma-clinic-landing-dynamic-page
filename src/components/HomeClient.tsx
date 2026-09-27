"use client";

import { useState } from "react";
import BookingModal from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import HomeBento from "@/components/HomeBento";
import { Promos } from "@/components/Promos";
import { Reels } from "@/components/Reels";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { ExtendedServiceItem, BentoCardData } from "@/lib/getServicesServer";
import { PromoCampaign } from "@/lib/getPromos";
import type { Reel } from "@/lib/reels";

interface HomeClientProps {
  bentoCards: BentoCardData[];
  promosData: PromoCampaign[];
  reelsData: Reel[];
}

export default function HomeClient({ bentoCards, promosData, reelsData }: HomeClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Header onBookClick={() => setIsBookingOpen(true)} />

      <Hero onBookClick={() => setIsBookingOpen(true)} />

      {/* 6-Card Bento Showcase */}
      <HomeBento bentoCards={bentoCards} />

      <Promos promos={promosData} />

      <Reels reels={reelsData} />

      <TestimonialsSection />

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </main>
  );
}