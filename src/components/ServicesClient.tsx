"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { CategoryData, ExtendedServiceItem, SubcategoryData } from "@/lib/getServicesServer";
import {
  Search,
  X,
  Sparkles,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServicesClientProps {
  categories: CategoryData[];
}

interface SheetState {
  subcategory: SubcategoryData;
  categoryName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function zeroPad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServicesClient({ categories }: ServicesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSheet, setActiveSheet] = useState<SheetState | null>(null);

  // Refs for each category section so we can smooth-scroll to them
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // ── URL sync ──────────────────────────────────────────────────────────────

  const updateURL = useCallback(
    (categorySlug: string) => {
      const params = new URLSearchParams();
      params.set("category", categorySlug);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  // Scroll to category section on initial load if URL param present
  useEffect(() => {
    const catParam = searchParams.get("category") || searchParams.get("cat");
    if (!catParam) return;
    const matchingCategory = categories.find((c) => c.slug === catParam);
    if (!matchingCategory) return;

    const timer = setTimeout(() => {
      const el = sectionRefs.current[matchingCategory.id];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchParams, categories]);

  // ── Derived data ──────────────────────────────────────────────────────────

  const totalServices = useMemo(
    () =>
      categories.reduce(
        (acc, cat) =>
          acc + cat.subcategories.reduce((s, sub) => s + sub.services.length, 0),
        0
      ),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        subcategories: cat.subcategories
          .map((sub) => ({
            ...sub,
            services: sub.services.filter(
              (svc) =>
                svc.name.toLowerCase().includes(q) ||
                sub.title.toLowerCase().includes(q) ||
                sub.description?.toLowerCase().includes(q) ||
                cat.name.toLowerCase().includes(q)
            ),
          }))
          .filter((sub) => sub.services.length > 0),
      }))
      .filter((cat) => cat.subcategories.length > 0);
  }, [categories, searchQuery]);

  // ── Category nav scroll ───────────────────────────────────────────────────

  const scrollToCategory = useCallback((cat: CategoryData) => {
    updateURL(cat.slug);
    const el = sectionRefs.current[cat.id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [updateURL]);

  // ── Body scroll lock when sheet is open ──────────────────────────────────

  useEffect(() => {
    if (activeSheet) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const savedTop = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (savedTop) window.scrollTo({ top: parseInt(savedTop) * -1, behavior: "instant" });
    }
  }, [activeSheet]);

  // ── Keyboard close ────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSheet(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1817] font-sans antialiased">
      <Header onBookClick={() => setIsBookingOpen(true)} />

      <main>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <HeroSection
          categories={categories}
          onCategoryClick={scrollToCategory}
        />

        {/* ── CATEGORY SECTIONS ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
          {/* Search bar — tight to the hero bottom */}
          <div className="relative max-w-sm mb-5 sm:mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0A9A2]" />
            <input
              type="text"
              placeholder="Search procedures, concerns…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-3 rounded-xl border border-[#E8E2D9] bg-white text-xs text-[#1A1817] placeholder:text-[#B0A9A2] focus:outline-none focus:border-[#C88F9A] transition-all font-sans shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0A9A2] hover:text-[#1A1817] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories — spaced from each other */}
          <div className="space-y-10 sm:space-y-16">
            {filteredCategories.length === 0 ? (
              <EmptySearch query={searchQuery} onClear={() => setSearchQuery("")} />
            ) : (
              filteredCategories.map((cat, catIdx) => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  index={catIdx}
                  sectionRef={(el) => { sectionRefs.current[cat.id] = el; }}
                  onCardClick={(sub) =>
                    setActiveSheet({ subcategory: sub, categoryName: cat.name })
                  }
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* ── TREATMENT SHEET ───────────────────────────────────────────────── */}
      <TreatmentSheet
        sheet={activeSheet}
        onClose={() => setActiveSheet(null)}
        onBookClick={() => {
          setActiveSheet(null);
          setIsBookingOpen(true);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({
  categories,
  onCategoryClick,
}: {
  categories: CategoryData[];
  onCategoryClick: (cat: CategoryData) => void;
}) {
  const scrollToFirstCategory = () => {
    const firstCat = categories[0];
    if (!firstCat) return;
    const el = document.getElementById(`cat-${firstCat.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative bg-white border-b border-[#E8E2D9] overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#C88F9A 1px, transparent 1px), linear-gradient(90deg, #C88F9A 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Main centered content — takes all available space */}
      <div className="relative w-full max-w-5xl mx-auto px-5 pt-24 pb-10 sm:pt-28 sm:pb-14 flex flex-col items-center text-center gap-6 sm:gap-8">

        {/* Badge + heading + subtext — grouped as one block */}
        <div className="flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#FBF4F5] border border-[#EDD5D9] text-[#A6626A] px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.18em] uppercase mb-5 sm:mb-7"
          >
            <Sparkles className="w-3 h-3 text-[#C88F9A]" />
            <span>Curated Menu · Precious MD Dermatology</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1817] leading-[1.12] tracking-tight"
          >
            Tailored Care for Your
            <br />
            <em className="not-italic text-[#C88F9A]">Unique Skin Journey</em>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-3 sm:mt-5 text-xs sm:text-sm text-[#706A63] font-light max-w-xs sm:max-w-md leading-relaxed"
          >
            Select a specialty below to explore our treatments.
          </motion.p>
        </div>

        {/* Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 xl:gap-4 w-full"
        >
          {categories.map((cat, i) => {
            const count = cat.subcategories.reduce(
              (acc, sub) => acc + sub.services.length,
              0
            );
            return (
              <CategoryNavButton
                key={cat.id}
                index={i}
                name={cat.name}
                count={count}
                onClick={() => onCategoryClick(cat)}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="w-full flex flex-col items-center gap-2 pb-8"
      >
        <button
          onClick={scrollToFirstCategory}
          aria-label="Scroll to procedures"
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-[10px] tracking-[0.25em] text-[#A0988E] font-medium uppercase">
            Scroll to Explore
          </span>
          <ChevronDown
            className="w-4 h-4 text-[#C88F9A] animate-bounce group-hover:text-[#A6626A] transition-colors"
            strokeWidth={2}
          />
        </button>
      </motion.div>
    </section>
  );
}

// ─── Category Nav Button ──────────────────────────────────────────────────────

function CategoryNavButton({
  index,
  name,
  count,
  onClick,
}: {
  index: number;
  name: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="group flex flex-col text-left bg-white border border-[#E8E2D9] rounded-xl sm:rounded-2xl p-3.5 md:p-6 xl:p-5 shadow-sm
                 hover:-translate-y-1 sm:hover:-translate-y-1.5 hover:border-[#C88F9A] hover:shadow-lg hover:shadow-[#C88F9A]/10
                 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F9A]"
    >
      {/* Inner body */}
      <div className="flex flex-col justify-between min-h-[110px] sm:min-h-[130px] md:min-h-[200px] lg:min-h-[150px] w-full">

        {/* Top row: number + icon badge */}
        <div className="flex items-start justify-between w-full">
          <span className="font-mono text-xs sm:text-sm font-bold text-[#C88F9A] tabular-nums">
            {zeroPad(index + 1)}
          </span>
          <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#FBF4F5] border border-[#EDD5D9] flex items-center justify-center text-[#C88F9A] group-hover:bg-[#C88F9A] group-hover:border-[#C88F9A] group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </span>
        </div>

        {/* Category name */}
        <p className="text-xs sm:text-sm md:text-base font-semibold text-[#1A1817] leading-snug group-hover:text-[#C88F9A] transition-colors duration-200 mt-3">
          {name}
        </p>

        {/* Procedure count */}
        <p className="text-[10px] sm:text-xs md:text-sm text-[#706A63] font-light mt-2">
          {count} {count === 1 ? "Proc." : "Procedures"}
        </p>

      </div>
    </motion.button>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────

const INITIAL_VISIBLE = 4;

function CategorySection({
  category,
  index,
  sectionRef,
  onCardClick,
}: {
  category: CategoryData;
  index: number;
  sectionRef: (el: HTMLElement | null) => void;
  onCardClick: (sub: SubcategoryData) => void;
}) {
  const totalCount = category.subcategories.reduce(
    (acc, sub) => acc + sub.services.length,
    0
  );
  const hasMore = category.subcategories.length > INITIAL_VISIBLE;
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      ref={sectionRef}
      id={`cat-${category.id}`}
      className="scroll-mt-24"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-[#E8E2D9]"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#C88F9A] tabular-nums shrink-0">
            {zeroPad(index + 1)}
          </span>
          <div>
            <h2 className="font-serif text-lg sm:text-xl lg:text-2xl font-normal text-[#1A1817] leading-tight">
              {category.name}
            </h2>
            <p className="text-[11px] text-[#A69E95] font-mono mt-0.5">
              {totalCount} {totalCount === 1 ? "procedure" : "procedures"} · {category.subcategories.length} {category.subcategories.length === 1 ? "subcategory" : "subcategories"}
            </p>
          </div>
        </div>

        {/* Inline toggle — only shown when there are extra cards */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[#706A63] hover:text-[#C88F9A] transition-colors duration-200 cursor-pointer"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform duration-300" />
              </>
            ) : (
              <>
                View All {category.subcategories.length}
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" />
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Animated grid wrapper */}
      <motion.div layout transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {/* Always-visible first 4 */}
          {category.subcategories.slice(0, INITIAL_VISIBLE).map((sub, subIdx) => (
            <SubcategoryCard
              key={sub.id}
              subcategory={sub}
              index={subIdx}
              onClick={() => onCardClick(sub)}
            />
          ))}

          {/* Extra cards — animate in/out */}
          <AnimatePresence initial={false}>
            {expanded && category.subcategories.slice(INITIAL_VISIBLE).map((sub, subIdx) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.3, delay: subIdx * 0.05, ease: "easeOut" }}
              >
                <SubcategoryCard
                  subcategory={sub}
                  index={INITIAL_VISIBLE + subIdx}
                  onClick={() => onCardClick(sub)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Subcategory Card ─────────────────────────────────────────────────────────

function SubcategoryCard({
  subcategory,
  index,
  onClick,
}: {
  subcategory: SubcategoryData;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      className="h-full"
    >
      <motion.button
        onClick={onClick}
        whileHover="hover"
        className="group w-full h-full text-left rounded-2xl overflow-hidden border border-[#E8E2D9] bg-white cursor-pointer shadow-sm hover:shadow-lg hover:border-[#C88F9A]/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F9A]"
      >
        {/* ── Image frame ── */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0EBE5] rounded-t-2xl">
          {subcategory.imageUrl ? (
            <motion.div
              variants={{ hover: { scale: 1.06 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={subcategory.imageUrl}
                alt={subcategory.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F7EFE9] to-[#EDE1D8]">
              <span className="font-serif text-3xl font-light text-[#C88F9A]/40 select-none">
                {subcategory.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Badge */}
          {subcategory.badgeText && (
            <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-mono tracking-wider uppercase text-[#A6626A] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#E8D7CD]">
              {subcategory.badgeText}
            </span>
          )}
        </div>

        {/* ── Content box ── */}
        <div className="bg-white p-3 sm:p-4 rounded-b-2xl flex flex-col gap-1.5">
          {/* Title row + arrow */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-[#1A1817] leading-snug group-hover:text-[#C88F9A] transition-colors duration-200">
              {subcategory.title}
            </h3>
            <motion.span
              variants={{ hover: { x: 2, y: -2 } }}
              transition={{ duration: 0.2 }}
              className="shrink-0 w-6 h-6 rounded-full bg-[#FBF4F5] border border-[#EDD5D9] flex items-center justify-center text-[#C88F9A] group-hover:bg-[#C88F9A] group-hover:border-[#C88F9A] group-hover:text-white transition-all duration-300"
            >
              <ArrowUpRight className="w-3 h-3" />
            </motion.span>
          </div>

          {/* Service count badge */}
          <span className="inline-block self-start text-[10px] font-mono tracking-wide text-[#A6626A] bg-[#FBF4F5] border border-[#EDD5D9] px-2 py-0.5 rounded-full">
            {subcategory.services.length}{" "}
            {subcategory.services.length === 1 ? "Service" : "Services"} Available
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─── Treatment Sheet (Slide-over) ─────────────────────────────────────────────

function TreatmentSheet({
  sheet,
  onClose,
  onBookClick,
}: {
  sheet: SheetState | null;
  onClose: () => void;
  onBookClick: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Trap focus inside sheet
  useEffect(() => {
    if (sheet && sheetRef.current) {
      sheetRef.current.focus();
    }
  }, [sheet]);

  return (
    <AnimatePresence>
      {sheet && (
        <>
          {/* Backdrop — covers header too */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#1A1817]/60 backdrop-blur-sm"
          />

          {/* Sheet panel */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md sm:max-w-lg bg-[#FAF8F5] flex flex-col shadow-2xl outline-none"
          >
            <SheetContent
              sheet={sheet}
              onClose={onClose}
              onBookClick={onBookClick}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sheet Content ────────────────────────────────────────────────────────────

function SheetContent({
  sheet,
  onClose,
  onBookClick,
}: {
  sheet: SheetState;
  onClose: () => void;
  onBookClick: () => void;
}) {
  const { subcategory, categoryName } = sheet;

  const allImages = [
    subcategory.imageUrl,
    ...(subcategory.imageUrls || []),
  ].filter(Boolean) as string[];

  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setImgIdx(0);
  }, [subcategory.id]);

  return (
    <div className="flex flex-col h-full">

      {/* ── Hero image with overlay header ── */}
      <div className="relative w-full aspect-[16/9] shrink-0 bg-[#1A1817]">
        {allImages.length > 0 ? (
          <>
            <Image
              src={allImages[imgIdx]}
              alt={subcategory.title}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover opacity-90"
              priority
            />
            {/* Dark gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Carousel arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer backdrop-blur-sm transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer backdrop-blur-sm transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`rounded-full transition-all cursor-pointer ${i === imgIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#C88F9A]/30 to-[#1A1817]" />
        )}

        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title overlay — bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 mb-1">
            {categoryName}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-tight">
            {subcategory.title}
          </h2>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto bg-[#FAF8F5]">

        {/* Meta row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D9] bg-white">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C88F9A]" />
            <span className="text-xs font-mono text-[#A69E95] tracking-wide">
              {subcategory.services.length} {subcategory.services.length === 1 ? "Treatment" : "Treatments"} Available
            </span>
          </div>
          {subcategory.badgeText && (
            <span className="text-[9px] font-mono tracking-wider uppercase text-[#A6626A] bg-[#FBF4F5] px-2.5 py-0.5 rounded-full border border-[#EDD5D9]">
              {subcategory.badgeText}
            </span>
          )}
        </div>

        {/* Treatments — clean list */}
        <div className="px-5 pt-4 pb-6">
          <div className="divide-y divide-[#F0EBE5]">
            {subcategory.services.map((svc, i) => (
              <TreatmentItem
                key={svc.id ?? svc.name + i}
                service={svc}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="shrink-0 px-5 py-4 bg-white border-t border-[#E8E2D9]">
        <button
          onClick={onBookClick}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#C88F9A] hover:bg-[#B87D8A] active:bg-[#A86C79] text-white text-xs font-semibold tracking-widest uppercase rounded-2xl transition-colors cursor-pointer shadow-lg shadow-[#C88F9A]/25"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book a Consultation</span>
        </button>
      </div>

    </div>
  );
}

// ─── Treatment Item ───────────────────────────────────────────────────────────

function TreatmentItem({
  service,
  index,
}: {
  service: ExtendedServiceItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.25) }}
      className="flex items-center justify-between gap-4 py-3.5"
    >
      {/* Left — index + name + note */}
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 font-mono text-[10px] text-[#C88F9A] tabular-nums pt-0.5">
          {zeroPad(index + 1)}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1A1817] leading-snug">
            {service.name}
          </p>
          {service.note && (
            <p className="text-[11px] text-[#A69E95] font-light italic mt-0.5 leading-relaxed line-clamp-1">
              {service.note}
            </p>
          )}
        </div>
      </div>

      {/* Right — price */}
      {service.priceText && (
        <span className="shrink-0 text-sm text-[#706A63] font-light whitespace-nowrap">
          ₱{service.priceText}
        </span>
      )}
    </motion.div>
  );
}

// ─── Empty Search State ───────────────────────────────────────────────────────

function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E2D9] flex items-center justify-center">
        <Search className="w-5 h-5 text-[#C88F9A] stroke-1" />
      </div>
      <div>
        <p className="font-serif text-lg text-[#1A1817]">No procedures found</p>
        <p className="text-xs text-[#A69E95] font-light mt-1 max-w-xs">
          No treatments matched &ldquo;{query}&rdquo;. Try a different keyword.
        </p>
      </div>
      <button
        onClick={onClear}
        className="text-[11px] font-mono tracking-wider uppercase text-[#C88F9A] hover:underline cursor-pointer"
      >
        Clear Search
      </button>
    </div>
  );
}
