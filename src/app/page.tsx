"use client";

import { useState, useEffect } from "react";
import BookingModal from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { getServices } from "@/lib/getServices";
import { getPromos, PromoCampaign } from "@/lib/getPromos";
import { getFeedbacks } from "@/lib/getFeedbacks";
import { Services } from "@/components/Services";
import { clinicConfig, ServicesConfig } from "@/config/clinicConfig";
import { Promos } from "@/components/Promos";
import { Feedback } from "@/components/Feedback";
import { DoctorHighlight } from "@/components/DoctorHighlight";
import { Footer } from "@/components/Footer";

// Store your Google Calendar Appointment Schedule URLs here
const SCHEDULE_URLS = {
  DEFAULT: "https://calendar.app.google/Dx3kqgCveUnEREUd7",
};
const feedbacks = await getFeedbacks();

export default function Home() {
  const [servicesData, setServicesData] = useState<ServicesConfig>(clinicConfig.services);
  const [promosData, setPromosData] = useState<PromoCampaign[]>([]);
  const [selectedScheduleUrl, setSelectedScheduleUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [services, promos, feedbacks] = await Promise.all([
          getServices(),
          getPromos(),
          getFeedbacks(),
        ]);
        if (services) setServicesData(services);
        if (promos) setPromosData(promos);
      } catch (error) {
        console.error("Failed to load dynamic sheet data:", error);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Header and Hero open the default appointment schedule */}
      <Header onBookClick={() => setSelectedScheduleUrl(SCHEDULE_URLS.DEFAULT)} />
      <Hero onBookClick={() => setSelectedScheduleUrl(SCHEDULE_URLS.DEFAULT)} />

      {/* Services component */}
      <Services
        services={servicesData}
        onBookClick={() => setSelectedScheduleUrl(SCHEDULE_URLS.DEFAULT)}
      />

      {/* Promos component now receives dynamic promo data */}
      <Promos promos={promosData} />

      <Feedback initialFeedbacks={feedbacks}/>
      <DoctorHighlight onBookClick={() => setSelectedScheduleUrl(SCHEDULE_URLS.DEFAULT)} />
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedScheduleUrl}
        onClose={() => setSelectedScheduleUrl(null)}
        scheduleUrl={selectedScheduleUrl || SCHEDULE_URLS.DEFAULT}
      />
    </main>
  );
}