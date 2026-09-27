"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { CategoryData, ExtendedServiceItem } from "@/lib/getServicesServer";
import {
  Search,
  X,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Layers,
  Calendar,
  ChevronLeft,
  Maximize2
} from "lucide-react";

interface ServicesClientProps {
  categories: CategoryData[];
}

export default function ServicesClient({ categories }: ServicesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || ""
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("all");

  const [activeServiceModal, setActiveServiceModal] = useState<{
    service: ExtendedServiceItem;
    categoryName: string;
    subcategoryTitle: string;
  } | null>(null);

  const [activeImagePreview, setActiveImagePreview] = useState<{
    urls: string[];
    activeIdx: number;
    title: string;
    subtitle?: string;
  } | null>(null);

  // Update URL when category or subcategory changes
  const updateURL = (categorySlug: string, subcategoryId?: string) => {
    const params = new URLSearchParams();
    params.set("category", categorySlug);

    if (subcategoryId && subcategoryId !== "all") {
      params.set("subcategory", subcategoryId);
    }

    const newURL = `${pathname}?${params.toString()}`;
    router.push(newURL, { scroll: false });
  };

  // Handle URL parameters for category selection on mount and URL changes
  useEffect(() => {
    const catParam = searchParams.get("category") || searchParams.get("cat");
    const subParam = searchParams.get("subcategory");

    if (catParam) {
      const matchingCategory = categories.find((c) => c.slug === catParam);
      if (matchingCategory && matchingCategory.id !== selectedCategoryId) {
        setSelectedCategoryId(matchingCategory.id);

        if (subParam) {
          setSelectedSubcategoryId(subParam);
        }
      }
    }
  }, [searchParams, categories]);

  // Handle hash anchor for subcategory scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#sub-")) {
        const subcategoryId = hash.substring(5); // Remove "#sub-"
        const element = document.getElementById(`sub-${subcategoryId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add brief highlight effect
          element.classList.add("ring-2", "ring-[#C87D87]", "ring-offset-2");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-[#C87D87]", "ring-offset-2");
          }, 2000);
        }
      }
    }, 500); // Delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [selectedCategoryId]);

  // Sync browser back/forward with state
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category") || params.get("cat");
      const subParam = params.get("subcategory");

      if (catParam) {
        const matchingCategory = categories.find((c) => c.slug === catParam);
        if (matchingCategory) {
          setSelectedCategoryId(matchingCategory.id);
          setSelectedSubcategoryId(subParam || "all");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [categories]);

  const totalServices = useMemo(() => {
    return categories.reduce(
      (acc, cat) =>
        acc + cat.subcategories.reduce((subAcc, sub) => subAcc + sub.services.length, 0),
      0
    );
  }, [categories]);

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const availableSubcategories = useMemo(() => {
    return currentCategory?.subcategories || [];
  }, [currentCategory]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      return categories
        .map((cat) => ({
          ...cat,
          subcategories: cat.subcategories
            .map((sub) => ({
              ...sub,
              services: sub.services.filter(
                (svc) =>
                  svc.name.toLowerCase().includes(query) ||
                  sub.title.toLowerCase().includes(query) ||
                  sub.description?.toLowerCase().includes(query) ||
                  cat.name.toLowerCase().includes(query)
              ),
            }))
            .filter((sub) => sub.services.length > 0),
        }))
        .filter((cat) => cat.subcategories.length > 0);
    }

    return [
      {
        ...currentCategory,
        subcategories: (currentCategory?.subcategories ?? []).filter(
          (sub) => selectedSubcategoryId === "all" || sub.id === selectedSubcategoryId
        ),
      },
    ];
  }, [categories, currentCategory, selectedCategoryId, selectedSubcategoryId, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#2D2A26] font-sans antialiased flex flex-col justify-between">
      <Header onBookClick={() => setIsBookingOpen(true)} />

      <main className="flex-1">
        {/* Editorial Header Section */}
        <section className="pt-16 sm:pt-20 pb-6 sm:pb-8 border-b border-[#E3DCD3] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#F7EFE9] border border-[#E8D7CD] text-[#A6626A] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-2">
                  <Sparkles className="w-3 h-3 text-[#C87D87]" />
                  <span>Clinical & Aesthetic Index</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1817] tracking-tight">
                  Services & Procedures
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#706A63] font-light max-w-xl">
                  Select a category or browse procedures below.
                </p>
              </div>

              {/* Total Stats Pill */}
              <div className="flex items-center gap-2.5 sm:gap-3 bg-[#F4EFEA] border border-[#E3DCD3] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono shrink-0 self-start md:self-auto">
                <div className="flex items-center gap-1.5 text-[#706A63]">
                  <Layers className="w-3.5 h-3.5 text-[#C87D87]" />
                  <span>{categories.length} CATEGORIES</span>
                </div>
                <span className="text-[#D3C9BE]">|</span>
                <span className="text-[#1A1817] font-semibold">{totalServices} PROCEDURES</span>
              </div>
            </div>

            {/* Compact Search Input */}
            <div className="mt-4 sm:mt-6 relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69E95]" />
              <input
                type="text"
                placeholder="Search procedures, concerns..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSubcategoryId("all");
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#E3DCD3] text-xs bg-[#F4EFEA] text-[#1A1817] placeholder:text-[#A69E95] focus:bg-white focus:outline-none focus:border-[#C87D87] transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A69E95] hover:text-[#1A1817] p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Workspace */}
        <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-[#E3DCD3]">
              <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[#A69E95] mx-auto mb-2 stroke-1" />
              <p className="font-serif text-base text-[#1A1817]">No procedures found</p>
              <p className="text-xs text-[#706A63] mt-1">
                No services matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-[11px] font-mono tracking-wider uppercase text-[#C87D87] hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">

              {/* MOBILE & TABLET CATEGORY HORIZONTAL SCROLLBAR (Visible < lg) */}
              {!searchQuery && (
                <div className="block lg:hidden overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex items-center gap-2 min-w-max">
                    {categories.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setSelectedSubcategoryId("all");
                            updateURL(cat.slug);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${isSelected
                            ? "bg-[#C87D87] text-white shadow-xs"
                            : "bg-white border border-[#E3DCD3] text-[#423D38] hover:bg-[#F8F4F0]"
                            }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DESKTOP SIDEBAR CATEGORIES (Visible lg+) */}
              {!searchQuery && (
                <aside className="hidden lg:block lg:col-span-3 sticky top-20 z-10 space-y-2">
                  <div className="bg-white border border-[#E3DCD3] rounded-2xl p-2.5 space-y-1 shadow-sm">
                    <div className="px-3 py-2 border-b border-[#F0ECE7] mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6626A]">
                        Categories
                      </span>
                      <span className="text-[10px] text-[#A69E95] font-mono">{categories.length}</span>
                    </div>

                    {categories.map((cat) => {
                      const count = cat.subcategories.reduce(
                        (acc, sub) => acc + sub.services.length,
                        0
                      );
                      const isSelected = selectedCategoryId === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setSelectedSubcategoryId("all");
                            updateURL(cat.slug);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${isSelected
                            ? "bg-[#C87D87] text-white shadow-xs"
                            : "hover:bg-[#F8F4F0] text-[#423D38]"
                            }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className={`text-xs font-medium truncate ${isSelected ? "text-white" : "text-[#1A1817]"}`}>
                              {cat.name}
                            </p>
                            <p className={`text-[10px] font-mono ${isSelected ? "text-white/80" : "text-[#A69E95]"}`}>
                              {count} {count === 1 ? "service" : "services"}
                            </p>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? "text-white translate-x-0.5" : "text-[#D3C9BE]"
                              }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </aside>
              )}

              {/* MAIN CONTENT AREA */}
              <div className={searchQuery ? "lg:col-span-12 space-y-5 sm:space-y-6" : "lg:col-span-9 space-y-5 sm:space-y-6"}>

                {/* Subcategory Pill Filters */}
                {!searchQuery && availableSubcategories.length > 1 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    <button
                      onClick={() => {
                        setSelectedSubcategoryId("all");
                        updateURL(currentCategory.slug);
                      }}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono transition-all shrink-0 cursor-pointer ${selectedSubcategoryId === "all"
                        ? "bg-[#C87D87] text-white font-medium shadow-xs"
                        : "bg-white border border-[#E3DCD3] text-[#706A63] hover:border-[#C87D87]/50"
                        }`}
                    >
                      All ({currentCategory.subcategories.reduce((a, b) => a + b.services.length, 0)})
                    </button>

                    {availableSubcategories.map((sub) => {
                      const isSubSelected = selectedSubcategoryId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubcategoryId(sub.id);
                            updateURL(currentCategory.slug, sub.id);
                          }}
                          className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono transition-all shrink-0 cursor-pointer ${isSubSelected
                            ? "bg-[#C87D87] text-white font-medium shadow-xs"
                            : "bg-white border border-[#E3DCD3] text-[#706A63] hover:border-[#C87D87]/50"
                            }`}
                        >
                          {sub.title} ({sub.services.length})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Subcategory Cards */}
                {filteredData.map((category) => (
                  <div key={category.id} className="space-y-5 sm:space-y-6">
                    {searchQuery && (
                      <div className="border-b border-[#E3DCD3] pb-2">
                        <h2 className="font-serif text-lg sm:text-xl font-normal text-[#1A1817]">
                          {category.name}
                        </h2>
                      </div>
                    )}

                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        id={`sub-${subcategory.id}`}
                        className="bg-white rounded-2xl border border-[#E3DCD3] shadow-xs overflow-hidden scroll-mt-24 transition-all"
                      >
                        {/* Subcategory Header */}
                        <div className="flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 bg-white border-b border-[#F0ECE7]">
                          {subcategory.imageUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                const allImgs = [
                                  subcategory.imageUrl!,
                                  ...(subcategory.imageUrls || []),
                                ].filter(Boolean) as string[];
                                setActiveImagePreview({
                                  urls: allImgs,
                                  activeIdx: 0,
                                  title: subcategory.title,
                                  subtitle: subcategory.description ?? undefined,
                                });
                              }}
                              className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-[#E3DCD3] bg-[#F7EFE9] group cursor-pointer"
                            >
                              <Image
                                src={subcategory.imageUrl}
                                alt={subcategory.title}
                                fill
                                sizes="(max-width: 640px) 44px, 56px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-3.5 h-3.5 text-white" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F7EFE9] border border-[#E8D7CD] shrink-0 flex items-center justify-center text-[#A6626A] font-serif font-semibold text-xs">
                              {subcategory.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif text-base sm:text-lg font-normal text-[#1A1817]">
                                {subcategory.title}
                              </h3>
                              {subcategory.badgeText && (
                                <span className="text-[9px] font-mono tracking-wider uppercase text-[#A6626A] bg-[#F7EFE9] px-2 py-0.5 rounded-full border border-[#E8D7CD]">
                                  {subcategory.badgeText}
                                </span>
                              )}
                            </div>
                            {subcategory.description && (
                              <p className="text-[11px] sm:text-xs text-[#706A63] font-light leading-relaxed mt-0.5 sm:mt-1">
                                {subcategory.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Mobile Responsive Service Rows */}
                        <div className="divide-y divide-[#F0ECE7]">
                          {subcategory.services.map((service) => (
                            <div
                              key={service.id}
                              onClick={() =>
                                setActiveServiceModal({
                                  service,
                                  categoryName: category.name,
                                  subcategoryTitle: subcategory.title,
                                })
                              }
                              className="px-4 sm:px-6 py-3.5 hover:bg-[#FAF6F2] transition-colors cursor-pointer flex items-center justify-between gap-3 sm:gap-4 group"
                            >
                              <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                                <span className="font-normal text-[#2D2A26] text-xs sm:text-sm group-hover:text-[#C87D87] transition-colors truncate">
                                  {service.name}
                                </span>
                                {service.note && (
                                  <span className="text-[10px] sm:text-[11px] text-[#8C847C] font-light italic truncate max-w-xs">
                                    — {service.note}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <span className="text-xs sm:text-xs font-mono font-medium text-[#1A1817] tracking-tight">
                                  ₱{service.priceText}
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#C2B7AC] group-hover:text-[#C87D87] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

              </div>

            </div>
          )}
        </section>
      </main>

      {/* Image Preview Modal — carousel with dot indicators */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-[#1A1817]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveImagePreview(null)}
          />

          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E3DCD3] shadow-2xl relative z-10 overflow-hidden">
            <button
              onClick={() => setActiveImagePreview(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Prev / Next arrows */}
            {activeImagePreview.urls.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImagePreview((p) =>
                      p ? { ...p, activeIdx: (p.activeIdx - 1 + p.urls.length) % p.urls.length } : p
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer backdrop-blur-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImagePreview((p) =>
                      p ? { ...p, activeIdx: (p.activeIdx + 1) % p.urls.length } : p
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer backdrop-blur-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <div className="relative w-full h-64 sm:h-96 bg-[#1A1817]">
              <Image
                src={activeImagePreview.urls[activeImagePreview.activeIdx]}
                alt={activeImagePreview.title}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>

            {/* Dot indicators */}
            {activeImagePreview.urls.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 py-2.5 bg-[#1A1817]">
                {activeImagePreview.urls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setActiveImagePreview((p) => p ? { ...p, activeIdx: i } : p)
                    }
                    className={`rounded-full transition-all cursor-pointer ${i === activeImagePreview.activeIdx
                        ? "w-4 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E3DCD3] space-y-1">
              <h3 className="font-serif text-base sm:text-lg font-medium text-[#1A1817]">
                {activeImagePreview.title}
              </h3>
              {activeImagePreview.subtitle && (
                <p className="text-xs text-[#706A63] font-light leading-relaxed">
                  {activeImagePreview.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-[#1A1817]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveServiceModal(null)}
          />

          <div className="bg-[#FAF8F5] rounded-2xl max-w-lg w-full border border-[#E3DCD3] shadow-2xl relative z-10 overflow-hidden">
            <button
              onClick={() => setActiveServiceModal(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1 rounded-full bg-white text-[#706A63] hover:text-[#1A1817] border border-[#E3DCD3] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6626A]">
                  {activeServiceModal.categoryName} — {activeServiceModal.subcategoryTitle}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1A1817]">
                  {activeServiceModal.service.name}
                </h3>
              </div>

              {activeServiceModal.service.note && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E3DCD3] text-xs text-[#706A63] font-light leading-relaxed">
                  <span className="font-mono text-[10px] uppercase text-[#A6626A] block mb-1">
                    Treatment Guidance:
                  </span>
                  {activeServiceModal.service.note}
                </div>
              )}

              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-[#E3DCD3]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#A69E95] block">
                    Investment
                  </span>
                  <span className="font-mono text-base sm:text-lg font-semibold text-[#1A1817]">
                    ₱{activeServiceModal.service.priceText}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActiveServiceModal(null);
                    setIsBookingOpen(true);
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#C87D87] hover:bg-[#B8846F] text-white text-[11px] sm:text-xs font-mono tracking-wider uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}