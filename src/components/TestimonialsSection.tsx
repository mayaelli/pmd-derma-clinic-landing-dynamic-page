"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, MessageSquarePlus, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

export interface PublicReview {
  id: string;
  patient_name: string;
  rating: number;
  treatment_tag?: string;
  comment: string;
  created_at: string;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const stripRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const VISIBLE = 3; // cards shown at a time

  const fetchPublishedReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, patient_name, rating, treatment_tag, comment, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => { fetchPublishedReviews(); }, []);

  // Scroll the strip to align the current card
  const scrollTo = useCallback((index: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const card = strip.children[index] as HTMLElement;
    if (!card) return;
    strip.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setCurrentIndex(index);
  }, []);

  // Sync currentIndex when user manually scrolls
  const handleScroll = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const cardWidth = (strip.children[0] as HTMLElement)?.offsetWidth ?? 0;
    if (!cardWidth) return;
    const gap = 24;
    const idx = Math.round(strip.scrollLeft / (cardWidth + gap));
    setCurrentIndex(Math.min(idx, reviews.length - 1));
  }, [reviews.length]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < reviews.length - VISIBLE;

  return (
    <section id="feedback" className="scroll-mt-20 py-12 sm:py-14 md:py-16 px-5 sm:px-6 md:px-8 bg-[#1A1817] border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-7 md:space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-white/10 pb-5 sm:pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider text-[#C87D87] uppercase">
              Patient Experiences
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
              What Our Patients Say
            </h2>
            <p className="text-xs text-white/50 max-w-lg">
              Read real stories and feedback from patients treated by Dr. Precious.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C87D87] hover:bg-[#b8707a] text-white font-medium text-xs rounded-xl shadow-xs transition-colors self-start md:self-auto cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shrink-0 w-[calc(33.333%-1rem)] h-48 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 p-8 space-y-3">
            <Quote className="w-8 h-8 text-[#C87D87]/40 mx-auto" />
            <p className="text-sm font-medium text-white">No patient reviews featured yet.</p>
            <p className="text-xs text-white/40">Be the first to share your experience!</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && reviews.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {/* Strip */}
            <div
              ref={stripRef}
              onScroll={handleScroll}
              className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="shrink-0 snap-start w-[calc(100%-2rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white/5 border border-white/10 hover:border-[#C87D87]/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-3 sm:space-y-4 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-white/10 fill-white/5"
                              }`}
                          />
                        ))}
                      </div>
                      {rev.treatment_tag && (
                        <span className="px-2 py-0.5 bg-[#C87D87]/20 text-[#C87D87] rounded-full text-[10px] font-medium border border-[#C87D87]/20 shrink-0">
                          {rev.treatment_tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-white">{rev.patient_name}</span>
                    <span className="text-[10px] text-white/30">
                      {new Date(rev.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls — only show when more than VISIBLE reviews */}
            {reviews.length > VISIBLE && (
              <div className="flex items-center justify-between">
                {/* Counter */}
                <span className="text-xs font-mono text-white/30 tabular-nums">
                  {String(currentIndex + 1).padStart(2, "0")} —{" "}
                  {String(Math.min(currentIndex + VISIBLE, reviews.length)).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
                </span>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: reviews.length - VISIBLE + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollTo(i)}
                      className={`rounded-full transition-all cursor-pointer ${i === currentIndex
                          ? "w-4 h-1.5 bg-[#C87D87]"
                          : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                      aria-label={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Prev / Next arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollTo(currentIndex - 1)}
                    disabled={!canPrev}
                    className="w-8 h-8 rounded-full border border-white/15 text-white/50 hover:border-[#C87D87] hover:text-[#C87D87] flex items-center justify-center transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo(currentIndex + 1)}
                    disabled={!canNext}
                    className="w-8 h-8 rounded-full border border-white/15 text-white/50 hover:border-[#C87D87] hover:text-[#C87D87] flex items-center justify-center transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchPublishedReviews();
        }}
      />
    </section>
  );
}
