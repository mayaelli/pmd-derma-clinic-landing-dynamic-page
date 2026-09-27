"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Stethoscope, Pencil, Trash2, LayoutGrid, Tag, Layers, Filter, ChevronDown, ChevronRight, Search, X } from "lucide-react";

export interface SubcategoryRecord {
  id: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  title: string;
  description?: string | null;
  badge_text?: string | null;
  image_url?: string | null;
  image_urls?: string[];
  bento_slot?: number | null;
  bento_title?: string | null;
  services?: ServiceItemRecord[];
}

export interface ServiceItemRecord {
  id: string;
  subcategory_id: string;
  name: string;
  price_text: string;
  note?: string | null;
  bento_slot?: number | null;
  bento_title?: string | null;
  active?: boolean;
}

interface ServiceListProps {
  categories: { id: string; name: string; slug: string }[];
  subcategoriesList: SubcategoryRecord[];
  listLoading: boolean;
  editingId: string | null;
  refreshList: () => void;
  startEditSubcategory: (sub: SubcategoryRecord) => void;
  startEditService: (svc: ServiceItemRecord) => void;
  setDeleteTarget: (target: { id: string; type: "subcategory" | "service"; name: string } | null) => void;
}

export function ServiceList({
  categories,
  subcategoriesList,
  listLoading,
  editingId,
  refreshList,
  startEditSubcategory,
  startEditService,
  setDeleteTarget,
}: ServiceListProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  // Filter and sort subcategories (newest first + search)
  const filteredSubcategories = useMemo(() => {
    let filtered = subcategoriesList.filter((sub) => {
      if (selectedCategoryFilter === "all") return true;
      return sub.category_id === selectedCategoryFilter || sub.category_slug === selectedCategoryFilter;
    });

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.title.toLowerCase().includes(query) ||
        sub.category_name?.toLowerCase().includes(query) ||
        sub.services?.some(svc => svc.name.toLowerCase().includes(query))
      );
    }

    // Reverse to show newest first
    return [...filtered].reverse();
  }, [subcategoriesList, selectedCategoryFilter, searchQuery]);

  const totalServicesCount = subcategoriesList.reduce(
    (acc, sub) => acc + (sub.services?.length || 0),
    0
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="font-serif font-bold text-base text-[#333D29]">Current Menu & Services</h2>
          <p className="text-[11px] text-slate-600 mt-0.5">
            {subcategoriesList.length} cards · {totalServicesCount} active prices
          </p>
        </div>
        <button
          onClick={refreshList}
          className="text-[11px] font-semibold text-[#908A94] hover:text-[#CD9581] hover:underline transition-all cursor-pointer self-start sm:self-auto"
        >
          Refresh List
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908A94]" />
        <input
          type="text"
          placeholder="Search subcategories or services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] focus:ring-2 focus:ring-[#CD9581]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908A94] hover:text-[#CD9581] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Dropdown */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#908A94]" />
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#333D29] bg-white hover:border-[#CD9581]/30 focus:outline-none focus:border-[#CD9581] focus:ring-2 focus:ring-[#CD9581]/20 transition-all cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {(searchQuery || selectedCategoryFilter !== "all") && (
          <span className="text-[10px] text-[#908A94] whitespace-nowrap">
            Showing {filteredSubcategories.length} of {subcategoriesList.length}
          </span>
        )}
      </div>

      {/* Content List */}
      {
        listLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse p-3 rounded-xl bg-[#FDFBF7] border border-[#F2ECE4] space-y-2">
                <div className="h-3 bg-[#F2ECE4] rounded-full w-1/3" />
                <div className="h-2.5 bg-[#F2ECE4] rounded-full w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <Stethoscope className="w-7 h-7 text-[#E5BCA9]" />
            <p className="text-xs font-semibold text-[#738285]">No items found</p>
            <p className="text-[11px] text-[#738285]/70">No subcategories match this filter.</p>
          </div>
        ) : (
          <div className="space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            {filteredSubcategories.map((sub: SubcategoryRecord) => (
              <div
                key={sub.id}
                className={`rounded-xl border transition-all overflow-hidden shadow-sm ${editingId === sub.id
                  ? "border-[#CD9581] bg-[#CD9581]/5 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
              >
                {/* Subcategory Card Header - Clickable */}
                <div
                  onClick={() => toggleSubcategory(sub.id)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubcategory(sub.id);
                      }}
                      className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200/50 transition-all"
                    >
                      {expandedSubcategories.has(sub.id) ? (
                        <ChevronDown className="w-4 h-4 text-[#908A94]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#908A94]" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-bold text-[#333D29] truncate">{sub.title}</h3>

                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8B6F47] bg-[#F2ECE4] px-2 py-0.5 rounded-md shrink-0">
                          <Layers className="w-2.5 h-2.5" /> {sub.category_name || "Uncategorized"}
                        </span>

                        {sub.bento_slot && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white bg-[#CD9581] px-2 py-0.5 rounded-md shrink-0">
                            <LayoutGrid className="w-2.5 h-2.5" /> Bento #{sub.bento_slot}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {sub.description || "No description"}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-[#CD9581]" />
                          {sub.services?.length || 0} prices
                        </span>
                        {sub.badge_text && (
                          <span className="inline-flex items-center gap-1 text-[#CD9581] font-semibold">
                            • {sub.badge_text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditSubcategory(sub);
                      }}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#333D29] hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                      title="Edit Subcategory"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ id: sub.id, type: "subcategory", name: sub.title });
                      }}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
                      title="Delete Subcategory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nested Individual Price Items - Collapsible */}
                {expandedSubcategories.has(sub.id) && (
                  <div className="p-2 space-y-1.5 bg-slate-50/50">
                    {sub.services && sub.services.length > 0 ? (
                      sub.services.map((svc) => (
                        <div
                          key={svc.id}
                          className={`flex items-center justify-between p-2 rounded-lg bg-white border transition-all ${editingId === svc.id ? "border-[#CD9581] shadow-sm" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                            }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <p className="text-[11px] font-semibold text-[#333D29]">{svc.name}</p>

                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#CD9581] bg-[#CD9581]/5 px-2 py-0.5 rounded-md border border-[#CD9581]/20 shrink-0">
                              <Tag className="w-2.5 h-2.5" /> ₱{(() => {
                                const cleaned = svc.price_text.replace(/,/g, '');
                                const num = Number(cleaned);
                                return !isNaN(num) && cleaned.match(/^\d+$/) ? num.toLocaleString('en-US') : svc.price_text;
                              })()}
                            </span>

                            {svc.bento_slot && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#8B6F47] bg-[#CD9581]/10 border border-[#CD9581]/20 px-1.5 py-0.5 rounded-md shrink-0">
                                <LayoutGrid className="w-2.5 h-2.5" /> Bento #{svc.bento_slot}
                              </span>
                            )}

                            {svc.note && (
                              <span className="text-[10px] text-slate-500 italic hidden sm:inline">
                                ({svc.note})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              onClick={() => startEditService(svc)}
                              className="w-6 h-6 rounded-lg text-slate-400 hover:text-[#333D29] hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Service"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: svc.id, type: "service", name: svc.name })}
                              className="w-6 h-6 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500 italic p-2 text-center bg-white rounded-lg border border-slate-200">
                        No service items attached to this subcategory card yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
}
