"use client";

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  useTransition,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  X,
  CheckCircle2,
  Activity,
  ClipboardList,
  LayoutGrid,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
} from "lucide-react";
import { ExtendedServiceItem } from "@/lib/getServices";
import { SERVICE_CATEGORIES } from "@/config/clinicConfig";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.map(({ key, label }) => [key, label])
);

const CATEGORY_COLORS: Record<string, string> = {
  hair: "bg-[#FFF0E8] text-[#C87D87] border-[#F0C4CB]",
  facials: "bg-[#FAF0F2] text-[#C87D87] border-[#F4D3D8]",
  lasers: "bg-[#F7EBEF] text-[#B55B67] border-[#EDC5CD]",
  injectables: "bg-[#FFF5F7] text-[#C87D87] border-[#F4D3D8]",
  specialized: "bg-[#F5F0FA] text-[#8A5BB5] border-[#E2D5F2]",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServicesProps {
  services?: Record<string, ExtendedServiceItem[]>;
  loading?: boolean;
  onBookClick?: () => void;
}

type ServiceWithCat = ExtendedServiceItem & { _cat: string };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Services({ services, loading = false, onBookClick }: ServicesProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  // Data processing
  const activeServices = useMemo(
    () => (services || {}) as Record<string, ExtendedServiceItem[]>,
    [services]
  );
  const categories = useMemo(() => Object.keys(activeServices), [activeServices]);
  const hasData = categories.length > 0;

  const allServices = useMemo<ServiceWithCat[]>(
    () =>
      categories.flatMap((cat) =>
        (activeServices[cat] || []).map((s) => ({ ...s, _cat: cat }))
      ),
    [activeServices, categories]
  );

  // UI state
  const [activeTab, setActiveTab] = useState<string>("");
  const [viewMode, setViewMode] = useState<"categorized" | "all">("categorized");
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ExtendedServiceItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-select the first category as default when data loads
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      // Check if there's a category in URL params
      const catParam = searchParams.get("cat");
      const matchingCat = categories.find(cat => cat === catParam);
      setActiveTab(matchingCat || categories[0]);
    }
  }, [categories, activeTab, searchParams]);

  // Handle hash scroll to specific subcategory
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#sub-")) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Optional: highlight the element briefly
          element.classList.add("ring-2", "ring-[#C87D87]", "rounded-xl");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-[#C87D87]", "rounded-xl");
          }, 2000);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, services]);

  // Modal accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedService) {
        setSelectedService(null);
      }
    };

    if (selectedService) {
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      const savedTop = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      if (savedTop) {
        window.scrollTo({ top: parseInt(savedTop) * -1, behavior: "instant" });
      }
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedService]);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setSearch(rawSearch), 150);
    return () => clearTimeout(id);
  }, [rawSearch]);

  const query = search.trim().toLowerCase();

  const filteredAll = useMemo(() => {
    if (!query) return allServices;
    return allServices.filter((s) => {
      const catLabel = (CATEGORY_LABELS[s._cat] || s._cat).toLowerCase();
      const name = s.name.toLowerCase();
      const desc = (s.description || s.desc || "").toLowerCase();
      return name.includes(query) || desc.includes(query) || catLabel.includes(query);
    });
  }, [allServices, query]);

  const categorizedResults = useMemo(() => {
    const selectedCat = activeTab || categories[0];
    const catsToRender = selectedCat ? [selectedCat] : [];

    return catsToRender
      .map((catKey) => {
        const catServices = (activeServices[catKey] || []).map((s) => ({ ...s, _cat: catKey }));
        const filtered = !query
          ? catServices
          : catServices.filter((s) => {
            const catLabel = (CATEGORY_LABELS[catKey] || catKey).toLowerCase();
            const name = s.name.toLowerCase();
            const desc = (s.description || s.desc || "").toLowerCase();
            return name.includes(query) || desc.includes(query) || catLabel.includes(query);
          });

        return {
          key: catKey,
          label: CATEGORY_LABELS[catKey] || catKey,
          items: filtered,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [activeServices, activeTab, categories, query]);

  const handleTabChange = useCallback((cat: string) => {
    startTransition(() => {
      setActiveTab(cat);
    });
  }, []);

  const handleViewChange = useCallback((mode: "categorized" | "all") => {
    startTransition(() => setViewMode(mode));
  }, []);

  const clearSearch = useCallback(() => {
    setRawSearch("");
    setActiveFilter(null);
    searchRef.current?.focus();
  }, []);

  return (
    <section id="services" className="scroll-mt-20 bg-white py-12 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FFF5F7] border border-[#F4D3D8] text-[#C87D87] px-4 py-2 rounded-full text-xs font-sans font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Tailored Skin Treatments</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2B30] tracking-tight leading-tight">
              Clinical & Aesthetic Menu
            </h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Discover our comprehensive range of medical and aesthetic dermatology services
            </p>
          </div>

          {/* Search & View Switcher */}
          {hasData && !loading && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-auto w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">

                {/* Search Bar */}
                <div className="relative">
                  <div
                    className="flex items-center bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ width: searchOpen ? "min(260px, 50vw)" : "40px" }}
                  >
                    <button
                      onClick={() => {
                        if (!searchOpen) {
                          setSearchOpen(true);
                          setTimeout(() => searchRef.current?.focus(), 60);
                        }
                      }}
                      className="w-[40px] h-[40px] flex items-center justify-center shrink-0 text-[#C87D87] hover:text-[#B55B67] transition-colors cursor-pointer"
                      aria-label="Search services"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    {searchOpen && (
                      <>
                        <input
                          ref={searchRef}
                          type="text"
                          value={rawSearch}
                          onChange={(e) => {
                            setRawSearch(e.target.value);
                            setActiveFilter(null);
                          }}
                          placeholder="Search treatments, categories…"
                          className="flex-1 py-2 text-xs text-[#333D29] placeholder:text-[#C87D87]/50 bg-transparent focus:outline-none font-sans min-w-0"
                        />
                        <button
                          onClick={() => {
                            setSearchOpen(false);
                            clearSearch();
                          }}
                          className="w-[32px] h-[40px] flex items-center justify-center shrink-0 text-[#C87D87]/70 hover:text-[#C87D87] transition-colors cursor-pointer"
                          aria-label="Close search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs shrink-0">
                  <button
                    onClick={() => handleViewChange("categorized")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${viewMode === "categorized"
                      ? "bg-[#C87D87] text-white shadow-xs"
                      : "text-[#525B44] hover:text-[#C87D87]"
                      }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>By Category</span>
                  </button>
                  <button
                    onClick={() => handleViewChange("all")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${viewMode === "all"
                      ? "bg-[#C87D87] text-white shadow-xs"
                      : "text-[#525B44] hover:text-[#C87D87]"
                      }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>All Services</span>
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        {hasData && !loading && categories.length > 0 && viewMode === "categorized" && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {categories.map((cat) => {
              const count = (activeServices[cat] || []).length;
              const isActive = (activeTab || categories[0]) === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleTabChange(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all shrink-0 cursor-pointer border ${isActive
                    ? "bg-[#C87D87] text-white border-[#C87D87] shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-[#C87D87]/50 hover:text-[#C87D87]"
                    }`}
                >
                  {CATEGORY_LABELS[cat] ?? cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Main Service Content */}
        {!loading && hasData && (
          <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>

            {viewMode === "categorized" && (
              <>
                {categorizedResults.length === 0 ? (
                  <NoResults query={query} onClear={clearSearch} />
                ) : (
                  <div className="space-y-8">
                    {categorizedResults.map((group) => (
                      <HorizontalCategoryRow
                        key={group.key}
                        title={group.label}
                        categoryKey={group.key}
                        services={group.items}
                        onSelect={setSelectedService}
                        onBookClick={onBookClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {viewMode === "all" && (
              <>
                {filteredAll.length === 0 ? (
                  <NoResults query={query} onClear={clearSearch} />
                ) : (
                  <CollapsibleContainer expanded={expanded}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
                      {filteredAll.map((service, index) => (
                        <ServiceCard
                          key={service.name + index}
                          service={service}
                          showCategoryBadge={true}
                          compact={true}
                          onSelect={setSelectedService}
                          onBookClick={onBookClick}
                        />
                      ))}
                    </div>
                  </CollapsibleContainer>
                )}
              </>
            )}

            {viewMode === "all" && filteredAll.length > 6 && (
              <div className="flex flex-col items-center mt-6 gap-2">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  aria-label={expanded ? "Collapse services" : "See all services"}
                >
                  <span className="text-[11px] font-semibold text-[#525B44] group-hover:text-[#C87D87] transition-colors">
                    {expanded ? "Collapse View" : "Expand All Services"}
                  </span>
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full bg-white border border-[#F4D3D8] shadow-xs flex items-center justify-center text-[#C87D87] group-hover:border-[#C87D87]/40 group-hover:shadow-xs transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Detail Modal with Price Tag */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-[#333D29]/40 backdrop-blur-xs"
            />
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[88vh] overflow-y-auto shadow-2xl relative border border-slate-200 z-10"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-[#FFF0F2] text-[#333D29] flex items-center justify-center transition-colors z-20 cursor-pointer border border-[#F4D3D8] shadow-xs"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <ModalImageGallery service={selectedService} />

              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  {"_cat" in selectedService && (selectedService as ServiceWithCat)._cat && (
                    <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[(selectedService as ServiceWithCat)._cat] ?? "bg-[#FFF0F2] text-[#C87D87] border-[#F4D3D8]"}`}>
                      {CATEGORY_LABELS[(selectedService as ServiceWithCat)._cat] ?? (selectedService as ServiceWithCat)._cat}
                    </span>
                  )}
                  {selectedService.priceText && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#CD9581] bg-[#CD9581]/10 px-2.5 py-1 rounded-lg">
                      <Tag className="w-3 h-3" />
                      {selectedService.priceText}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2D2B30] leading-snug">
                    {selectedService.name}
                  </h3>
                  <p className="font-sans text-sm text-slate-700 mt-2 leading-relaxed">
                    {selectedService.description || selectedService.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedService(null);
                    onBookClick?.();
                  }}
                  className="w-full py-3 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book a Consultation</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Horizontal Row Carousel Component ──────────────────────────────────────

function HorizontalCategoryRow({
  title,
  categoryKey,
  services,
  onSelect,
  onBookClick,
}: {
  title: string;
  categoryKey: string;
  services: ServiceWithCat[];
  onSelect: (s: ServiceWithCat) => void;
  onBookClick?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 className="font-serif text-lg font-bold text-[#2D2B30] flex items-center gap-2">
          <span>{title}</span>
          <span className="font-sans text-xs font-normal text-[#C87D87]">({services.length})</span>
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-full bg-white border border-[#F4D3D8] flex items-center justify-center text-[#C87D87] hover:text-[#B55B67] hover:border-[#C87D87]/50 transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-full bg-white border border-[#F4D3D8] flex items-center justify-center text-[#C87D87] hover:text-[#B55B67] hover:border-[#C87D87]/50 transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#F4D3D8] scrollbar-track-transparent"
      >
        {services.map((service, index) => (
          <div
            key={service.name + index}
            className="snap-start shrink-0 w-[280px] sm:w-[320px]"
          >
            <ServiceCard
              service={service}
              showCategoryBadge={false}
              onSelect={onSelect}
              onBookClick={onBookClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Service Card Component ──────────────────────────────────────────────────

function ServiceCard({
  service,
  showCategoryBadge,
  compact = false,
  onSelect,
  onBookClick,
}: {
  service: ServiceWithCat;
  showCategoryBadge: boolean;
  compact?: boolean;
  onSelect: (s: ServiceWithCat) => void;
  onBookClick?: () => void;
}) {
  return (
    <div
      onClick={() => onSelect(service)}
      className="group bg-white rounded-2xl border border-slate-200 flex flex-col hover:shadow-lg hover:border-[#C87D87]/40 transition-all duration-300 cursor-pointer h-full overflow-hidden"
    >
      {service.image ? (
        <div className={`relative w-full bg-[#FFF0F2] overflow-hidden ${compact ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-1.5 bg-[#C87D87] w-full" />
      )}

      <div className={`flex flex-col flex-1 justify-between gap-2 ${compact ? "p-3" : "p-4 gap-3"}`}>
        <div className="space-y-1">
          {showCategoryBadge && service._cat && (
            <span
              className={`inline-block font-semibold px-2 py-0.5 rounded-md border ${compact ? "text-[9px]" : "text-[10px]"} ${CATEGORY_COLORS[service._cat] ?? "bg-[#FFF0F2] text-[#C87D87] border-[#F4D3D8]"}`}
            >
              {CATEGORY_LABELS[service._cat] ?? service._cat}
            </span>
          )}
          <h3 className={`font-serif font-bold text-[#2D2B30] leading-snug group-hover:text-[#C87D87] transition-colors ${compact ? "text-sm" : "text-base"}`}>
            {service.name}
          </h3>
          {!compact && (
            <p className="font-sans text-sm text-slate-700 leading-relaxed line-clamp-2">
              {service.description || service.desc}
            </p>
          )}
        </div>

        <div className={`border-t border-slate-200 flex items-center justify-between gap-2 ${compact ? "pt-2" : "pt-3"}`}>
          {service.priceText ? (
            <span className="font-semibold text-[11px] text-[#CD9581] flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {service.priceText}
            </span>
          ) : (
            <span className={`font-semibold text-[#C87D87] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 ${compact ? "text-[10px] ml-auto" : "text-[11px]"}`}>
              Learn More →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Collapsible Vertical Container ─────────────────────────────────────────

function CollapsibleContainer({
  expanded,
  children,
}: {
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <motion.div
        animate={{ height: expanded ? "auto" : 520 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#FAF7F5] to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── No Results State ────────────────────────────────────────────────────────

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="py-14 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-2xl border border-slate-200">
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        <Search className="w-5 h-5 text-[#C87D87]" />
      </div>
      <p className="font-serif text-sm font-bold text-[#333D29]">No results found</p>
      <p className="font-sans text-sm text-slate-700 max-w-xs">
        {query ? (
          <>No treatments matched &ldquo;{query}&rdquo;.</>
        ) : (
          <>No services available for this selection.</>
        )}
      </p>
      <button
        onClick={onClear}
        className="mt-1 text-xs font-semibold text-[#C87D87] hover:underline transition-all cursor-pointer"
      >
        Clear filters &amp; search
      </button>
    </div>
  );
}

// ─── Modal Image Gallery ─────────────────────────────────────────────────────
// Shows the cover image + a thumbnail strip when extra images exist.

function ModalImageGallery({ service }: { service: ExtendedServiceItem }) {
  const allImages = [
    service.image,
    ...(service.imageUrls || []),
  ].filter(Boolean) as string[];

  const [activeIdx, setActiveIdx] = useState(0);

  // Reset to cover whenever a different service is opened
  useEffect(() => {
    setActiveIdx(0);
  }, [service]);

  if (allImages.length === 0) return null;

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full rounded-t-2xl overflow-hidden bg-[#FFF0F2]">
        <Image
          src={allImages[activeIdx]}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnail strip — only rendered when there are extra images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 px-4 py-3 border-b border-slate-100">
          {allImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${activeIdx === idx
                  ? "border-[#C87D87] shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-[#F4D3D8]"
                }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${service.name} image ${idx + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}