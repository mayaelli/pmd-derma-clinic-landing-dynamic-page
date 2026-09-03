"use client";

import { useState } from "react";
import BookingModal from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import Services from "@/components/Services";
import { Promos } from "@/components/Promos";
import { Feedback } from "@/components/Feedback";
import { DoctorHighlight } from "@/components/DoctorHighlight";
import { Footer } from "@/components/Footer";
import { ExtendedServiceItem } from "@/lib/getServicesServer";
import { PromoCampaign } from "@/lib/getPromos";
import { FeedbackItem } from "@/lib/getFeedbacks";

interface HomeClientProps {
  servicesData: Record<string, ExtendedServiceItem[]>;
  promosData: PromoCampaign[];
  feedbacksData: FeedbackItem[];
}

export default function HomeClient({ servicesData, promosData, feedbacksData }: HomeClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-20 overflow-x-hidden">
      <Header onBookClick={() => setIsBookingOpen(true)} />
      <Hero onBookClick={() => setIsBookingOpen(true)} />

      <Services
        services={servicesData}
        loading={false}
        onBookClick={() => setIsBookingOpen(true)}
      />

      <Promos promos={promosData} />

      <Feedback initialFeedbacks={feedbacksData} />
      <DoctorHighlight onBookClick={() => setIsBookingOpen(true)} />
      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </main>
  );
}
