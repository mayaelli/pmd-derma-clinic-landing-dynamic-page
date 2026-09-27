"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Reel } from "@/lib/reels";

interface ReelsProps {
  reels?: Reel[];
}

export function Reels({ reels = [] }: ReelsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const hasData = reels.length > 0;
  const activeReel = activeIndex !== null ? reels[activeIndex] : null;

  // ── Reset player when switching ───────────────────────────────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || activeIndex === null) return;
    vid.pause();
    vid.load();
    vid.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setIsMuted(false);
  }, [activeIndex]);

  // ── Lock body scroll when modal open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  // ── ESC to close ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft" && activeIndex !== null) goPrev();
      if (e.key === "ArrowRight" && activeIndex !== null) goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const closeModal = () => {
    videoRef.current?.pause();
    setActiveIndex(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); setIsPlaying(true); }
    else { vid.pause(); setIsPlaying(false); }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const goPrev = () => setActiveIndex((i) => i !== null ? (i - 1 + reels.length) % reels.length : 0);
  const goNext = () => setActiveIndex((i) => i !== null ? (i + 1) % reels.length : 0);

  const scrollStrip = (dir: "left" | "right") => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section
      id="reels"
      className="scroll-mt-20 bg-[#F0EBE5] py-10 md:py-14 border-b border-[#E8E2D9] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E3DCD3] pb-4 gap-2 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[#A6626A] text-[10px] font-mono tracking-widest uppercase">
              <Film className="w-3 h-3 text-[#C87D87]" />
              <span>Clinic Reels</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1817] tracking-tight">
              Skin Tips & Derm Advice
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#706A63] font-light">
              Expert skin care guidance and dermatology insights from Dr. Precious.
            </p>
          </div>

          {/* Strip scroll arrows — desktop */}
          {hasData && reels.length > 3 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollStrip("left")}
                className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white text-[#706A63] hover:border-[#C87D87] hover:text-[#C87D87] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip("right")}
                className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white text-[#706A63] hover:border-[#C87D87] hover:text-[#C87D87] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!hasData ? (
          <div className="py-14 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-3xl border border-[#E8E2D9]">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F4EF] border border-[#E3DCD3] flex items-center justify-center">
              <Film className="w-5 h-5 text-[#C87D87]" />
            </div>
            <p className="font-serif text-base font-bold text-[#1A1817]">No Reels Yet</p>
            <p className="text-xs text-[#706A63] max-w-xs">
              Video reels will appear here once published by the clinic.
            </p>
          </div>
        ) : (
          /* ── Horizontal filmstrip ─────────────────────────────────────── */
          <div className="relative">
            {/* Fade edge — right */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F0EBE5] to-transparent z-10 pointer-events-none" />
            {/* Fade edge — left */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#F0EBE5] to-transparent z-10 pointer-events-none" />

            <div
              ref={stripRef}
              className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {reels.map((reel, idx) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  index={idx}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}

              {/* Trailing spacer so last card doesn't sit against the fade */}
              <div className="shrink-0 w-8" />
            </div>
          </div>
        )}
      </div>

      {/* ── Fullscreen modal player ──────────────────────────────────────────── */}
      <AnimatePresence>
        {activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="relative flex flex-col md:flex-row gap-6 items-center md:items-end max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1A1817] border border-white/10 shadow-2xl flex-shrink-0"
                style={{ maxHeight: "60vh", aspectRatio: "9/16", width: "auto" }}
              >
                <video
                  ref={videoRef}
                  src={activeReel.videoUrl}
                  className="h-full w-auto object-cover"
                  playsInline
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  style={{ maxHeight: "60vh" }}
                />

                {/* Tap to play overlay */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all">
                      <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                    </div>
                  </button>
                )}

                {/* Prev / Next on video */}
                {reels.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Bottom controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer backdrop-blur-sm"
                  >
                    {isPlaying
                      ? <Pause className="w-4 h-4 fill-white" />
                      : <Play className="w-4 h-4 fill-white ml-0.5" />
                    }
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Info panel — beside on desktop, below on mobile */}
              <div className="md:max-w-xs space-y-3 text-white md:pb-4">
                {activeReel.category && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-[#C87D87]/25 text-[#C87D87] text-xs font-bold border border-[#C87D87]/30">
                    {activeReel.category}
                  </span>
                )}
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                  {activeReel.title}
                </h3>
                {activeReel.description && (
                  <p className="text-sm text-white/60 leading-relaxed">
                    {activeReel.description}
                  </p>
                )}
                {activeReel.duration && (
                  <p className="text-xs text-white/40">Duration: {activeReel.duration}</p>
                )}

                {/* Counter */}
                {reels.length > 1 && (
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={goPrev} className="p-2 rounded-full border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-all cursor-pointer">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-white/40 font-mono tabular-nums">
                      {String((activeIndex ?? 0) + 1).padStart(2, "0")} / {String(reels.length).padStart(2, "0")}
                    </span>
                    <button type="button" onClick={goNext} className="p-2 rounded-full border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-all cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={closeModal}
                className="fixed top-4 right-4 md:absolute md:-top-3 md:-right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Individual reel card in the strip ────────────────────────────────────────
function ReelCard({
  reel,
  index,
  onClick,
}: {
  reel: Reel;
  index: number;
  onClick: () => void;
}) {
  const thumbRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  // Play silent preview on hover
  useEffect(() => {
    const vid = thumbRef.current;
    if (!vid) return;
    if (hovered) {
      vid.currentTime = 0;
      vid.play().catch(() => { });
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [hovered]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="relative shrink-0 snap-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87D87] focus-visible:ring-offset-2 rounded-2xl"
      style={{ width: 160 }}
      aria-label={`Play reel: ${reel.title}`}
    >
      {/* 9:16 card */}
      <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden bg-[#2C2825] border border-[#E8E2D9] relative shadow-sm hover:shadow-md transition-shadow">

        {/* Thumbnail video (silent preview) */}
        <video
          ref={thumbRef}
          src={reel.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          loop
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Category badge */}
        {reel.category && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#C87D87]/90 text-white text-[9px] font-bold rounded-full truncate max-w-[80%]">
            {reel.category}
          </span>
        )}

        {/* Duration badge */}
        {reel.duration && (
          <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
            {reel.duration}
          </span>
        )}

        {/* Play button — shows on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Static play icon — shows when not hovered */}
        {!hovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Title at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-[11px] font-semibold text-white line-clamp-2 leading-snug">
            {reel.title}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
