"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Plus, Upload, Image as ImageIcon, LayoutGrid, Tag, Layers, Search, ChevronDown, X } from "lucide-react";

export interface SubcategoryOption {
  id: string;
  title: string;
  category_name?: string;
}

export interface ServiceFormData {
  // Mode selection: 'subcategory' or 'service'
  formMode: "subcategory" | "service";

  // Subcategory Fields
  subcategory_id?: string;
  category_id?: string;
  sub_title?: string;
  sub_description?: string;
  sub_badge_text?: string;

  // Extra subcategory images (slots 2 & 3 — stored in image_urls column)
  extraImageUrl2?: string;
  extraImageUrl3?: string;

  // Service Fields
  name?: string;
  price_text?: string;
  note?: string;
  bento_slot?: number | null;
  bento_title?: string;
}

interface ServiceFormProps {
  editingId: string | null;
  editingType?: "subcategory" | "service" | null;
  serviceForm: ServiceFormData;
  setServiceForm: React.Dispatch<React.SetStateAction<ServiceFormData>>;
  imagePreview: string | null;
  imageFile: File | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  loading: boolean;
  categories: { id: string; name: string }[];
  subcategories: SubcategoryOption[];
}

export function ServiceForm({
  editingId,
  editingType,
  serviceForm,
  setServiceForm,
  imagePreview,
  imageFile,
  handleImageChange,
  handleSubmit,
  resetForm,
  loading,
  categories,
  subcategories,
}: ServiceFormProps) {
  const isEditing = Boolean(editingId);
  const [subcatDropdownOpen, setSubcatDropdownOpen] = useState(false);
  const [subcatSearch, setSubcatSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Extra image slots (2 & 3) ────────────────────────────────────────────
  const [extraFile2, setExtraFile2] = useState<File | null>(null);
  const [extraPreview2, setExtraPreview2] = useState<string | null>(
    serviceForm.extraImageUrl2 || null
  );
  const [extraFile3, setExtraFile3] = useState<File | null>(null);
  const [extraPreview3, setExtraPreview3] = useState<string | null>(
    serviceForm.extraImageUrl3 || null
  );
  const extraRef2 = useRef<HTMLInputElement>(null);
  const extraRef3 = useRef<HTMLInputElement>(null);

  // Sync previews when editing an existing subcategory
  useEffect(() => {
    setExtraPreview2(serviceForm.extraImageUrl2 || null);
    setExtraPreview3(serviceForm.extraImageUrl3 || null);
  }, [serviceForm.extraImageUrl2, serviceForm.extraImageUrl3]);

  const handleExtraImageChange = (
    slot: 2 | 3,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (slot === 2) {
      setExtraFile2(file);
      setExtraPreview2(preview);
      // store a sentinel so page.tsx knows a new file was chosen
      setServiceForm((prev) => ({ ...prev, extraImageUrl2: "__new__" }));
    } else {
      setExtraFile3(file);
      setExtraPreview3(preview);
      setServiceForm((prev) => ({ ...prev, extraImageUrl3: "__new__" }));
    }
  };

  const clearExtraImage = (slot: 2 | 3) => {
    if (slot === 2) {
      if (extraPreview2?.startsWith("blob:")) URL.revokeObjectURL(extraPreview2);
      setExtraFile2(null);
      setExtraPreview2(null);
      setServiceForm((prev) => ({ ...prev, extraImageUrl2: "" }));
      if (extraRef2.current) extraRef2.current.value = "";
    } else {
      if (extraPreview3?.startsWith("blob:")) URL.revokeObjectURL(extraPreview3);
      setExtraFile3(null);
      setExtraPreview3(null);
      setServiceForm((prev) => ({ ...prev, extraImageUrl3: "" }));
      if (extraRef3.current) extraRef3.current.value = "";
    }
  };

  // Expose the extra files so page.tsx can upload them on submit
  // We attach them to the form element as a custom property via a ref trick —
  // instead, page.tsx will read them from the form's dataset via hidden inputs.
  // Simpler approach: store File objects on a ref that page.tsx can read.
  // We expose via a module-level WeakMap keyed on the form element.
  // Actually, the cleanest approach: pass the files up via a callback prop.
  // But that requires changing page.tsx props. Instead we store them on
  // window.__extraServiceImages so page.tsx can grab them on submit.
  useEffect(() => {
    (window as any).__extraServiceImages = {
      file2: extraFile2,
      file3: extraFile3,
    };
    return () => {
      (window as any).__extraServiceImages = null;
    };
  }, [extraFile2, extraFile3]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSubcatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter subcategories by search
  const filteredSubcategories = subcategories
    .filter(sub => {
      if (!subcatSearch) return true;
      const query = subcatSearch.toLowerCase();
      return sub.title.toLowerCase().includes(query) || sub.category_name?.toLowerCase().includes(query);
    })
    .reverse(); // Newest first

  // Get selected subcategory name
  const selectedSubcat = subcategories.find(s => s.id === serviceForm.subcategory_id);

  // Group by category
  const groupedSubcategories = filteredSubcategories.reduce((acc, sub) => {
    const catName = sub.category_name || "Uncategorized";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(sub);
    return acc;
  }, {} as Record<string, SubcategoryOption[]>);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-[#333D29]">
              {isEditing
                ? `Edit ${editingType === "subcategory" ? "Subcategory" : "Service"}`
                : "Add New Item"}
            </h2>
            <p className="text-[11px] text-slate-600 mt-1">
              {isEditing
                ? "Update and save your changes"
                : "Create a new subcategory or service item"}
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[11px] font-semibold text-slate-600 hover:text-[#333D29] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Mode Selector (Hidden when editing) */}
        {!isEditing && (
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setServiceForm({ ...serviceForm, formMode: "subcategory" })}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${serviceForm.formMode === "subcategory"
                ? "bg-[#333D29] text-white shadow-sm"
                : "text-slate-600 hover:text-[#333D29] hover:bg-white"
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Subcategory</span>
              <span className="sm:hidden">Subcat</span>
            </button>

            <button
              type="button"
              onClick={() => setServiceForm({ ...serviceForm, formMode: "service" })}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${serviceForm.formMode === "service"
                ? "bg-[#333D29] text-white shadow-sm"
                : "text-slate-600 hover:text-[#333D29] hover:bg-white"
                }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Service Item</span>
              <span className="sm:hidden">Service</span>
            </button>
          </div>
        )}

        {/* FORM MODE: SUBCATEGORY CARD */}
        {serviceForm.formMode === "subcategory" && (
          <div className="space-y-3">
            {/* Category & Title */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#333D29] mb-1">Main Category</label>
                <select
                  required
                  value={serviceForm.category_id || ""}
                  onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-white focus:outline-none focus:border-[#CD9581] focus:ring-1 focus:ring-[#CD9581]/20 cursor-pointer transition-all"
                >
                  <option value="">Select...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#333D29] mb-1">Subcategory Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pico Laser, HIFU"
                  value={serviceForm.sub_title || ""}
                  onChange={(e) => setServiceForm({ ...serviceForm, sub_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] focus:ring-1 focus:ring-[#CD9581]/20 transition-all"
                />
              </div>
            </div>

            {/* Image Upload - Compact */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-[#333D29]">Display Image</label>
                <span className="text-[9px] text-[#908A94] bg-[#F2ECE4] px-2 py-0.5 rounded-md">
                  2–3 images supported
                </span>
              </div>

              {/* Slot 1 — primary image (existing behaviour unchanged) */}
              <div className="border border-dashed border-[#F2ECE4] rounded-lg p-3 bg-[#FDFBF7] flex items-center gap-3 hover:border-[#CD9581] transition-colors mb-2">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-[#F2ECE4]" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#F2ECE4] flex items-center justify-center text-[#908A94]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#333D29] truncate">
                    {imageFile ? imageFile.name : imagePreview ? "Image 1 (cover)" : "Select cover image"}
                  </p>
                  <p className="text-[9px] text-[#738285]">PNG, JPG, WEBP · Cover / primary</p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F2ECE4] hover:border-[#CD9581] text-[#908A94] text-[10px] font-bold rounded-lg cursor-pointer transition-all shrink-0">
                  <Upload className="w-3 h-3" />
                  <span>Browse</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Slot 2 — extra image */}
              <div className="border border-dashed border-[#F2ECE4] rounded-lg p-3 bg-[#FDFBF7] flex items-center gap-3 hover:border-[#CD9581] transition-colors mb-2">
                {extraPreview2 ? (
                  <img src={extraPreview2} alt="Image 2" className="w-10 h-10 object-cover rounded-lg border border-[#F2ECE4]" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#F2ECE4] flex items-center justify-center text-[#C0BAC0]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#333D29] truncate">
                    {extraFile2 ? extraFile2.name : extraPreview2 ? "Image 2" : "Image 2 (optional)"}
                  </p>
                  <p className="text-[9px] text-[#738285]">PNG, JPG, WEBP · Extra poster</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {extraPreview2 && (
                    <button
                      type="button"
                      onClick={() => clearExtraImage(2)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F2ECE4] hover:border-[#CD9581] text-[#908A94] text-[10px] font-bold rounded-lg cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    <span>Browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      ref={extraRef2}
                      onChange={(e) => handleExtraImageChange(2, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Slot 3 — extra image */}
              <div className="border border-dashed border-[#F2ECE4] rounded-lg p-3 bg-[#FDFBF7] flex items-center gap-3 hover:border-[#CD9581] transition-colors">
                {extraPreview3 ? (
                  <img src={extraPreview3} alt="Image 3" className="w-10 h-10 object-cover rounded-lg border border-[#F2ECE4]" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#F2ECE4] flex items-center justify-center text-[#C0BAC0]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#333D29] truncate">
                    {extraFile3 ? extraFile3.name : extraPreview3 ? "Image 3" : "Image 3 (optional)"}
                  </p>
                  <p className="text-[9px] text-[#738285]">PNG, JPG, WEBP · Extra poster</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {extraPreview3 && (
                    <button
                      type="button"
                      onClick={() => clearExtraImage(3)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F2ECE4] hover:border-[#CD9581] text-[#908A94] text-[10px] font-bold rounded-lg cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    <span>Browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      ref={extraRef3}
                      onChange={(e) => handleExtraImageChange(3, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Badge & Description */}
            <div>
              <label className="block text-[11px] font-bold text-[#333D29] mb-1">Promo Badge (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Buy 3 Get 1 Free"
                value={serviceForm.sub_badge_text || ""}
                onChange={(e) => setServiceForm({ ...serviceForm, sub_badge_text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#333D29] mb-1">Description (Optional)</label>
              <textarea
                rows={2}
                placeholder="Brief explanation..."
                value={serviceForm.sub_description || ""}
                onChange={(e) => setServiceForm({ ...serviceForm, sub_description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] focus:ring-1 focus:ring-[#CD9581]/20 transition-all resize-none"
              />
            </div>

            {/* Bento Settings - In Subcategory */}
            <div className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-[#CD9581]" />
                <h3 className="text-[11px] font-bold text-[#333D29]">Home Page Bento (Optional)</h3>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#738285] mb-1">Bento Slot</label>
                  <select
                    value={serviceForm.bento_slot ?? ""}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        bento_slot: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#F2ECE4] text-[10px] text-[#333D29] bg-white focus:outline-none focus:border-[#CD9581] cursor-pointer"
                  >
                    <option value="">Don't show on home page</option>
                    {[1, 2, 3, 4, 5, 6].map((slot) => {
                      const slotNames = {
                        1: "Medical & Consultations",
                        2: "Facials & Glass Skin",
                        3: "Lasers & Energy",
                        4: "Peels & Resurfacing",
                        5: "Injectables & Boosters",
                        6: "Hair & Specialty"
                      };
                      const occupiedBy = subcategories.find(
                        (sub) => sub.id !== editingId && (sub as any).bento_slot === slot
                      );
                      const label = `Slot ${slot} - ${slotNames[slot as keyof typeof slotNames]}`;
                      const suffix = occupiedBy ? ` (Currently: ${(occupiedBy as any).title})` : "";
                      return (
                        <option key={slot} value={slot}>
                          {label}{suffix}
                        </option>
                      );
                    })}
                  </select>
                  {serviceForm.bento_slot && subcategories.find(
                    (sub) => sub.id !== editingId && (sub as any).bento_slot === serviceForm.bento_slot
                  ) && (
                      <p className="text-[9px] text-amber-600 mt-1 flex items-center gap-1">
                        <span>⚠️</span> This slot is already in use. Saving will replace it.
                      </p>
                    )}
                </div>

                {serviceForm.bento_slot && (
                  <div>
                    <label className="block text-[10px] font-semibold text-[#738285] mb-1">Custom Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Lasers & Energy Devices"
                      value={serviceForm.bento_title || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, bento_title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#F2ECE4] text-[10px] text-[#333D29] bg-white focus:outline-none focus:border-[#CD9581]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FORM MODE: SERVICE ITEM */}
        {serviceForm.formMode === "service" && (
          <div className="space-y-3">
            {/* Parent Subcategory - Custom Searchable Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#333D29] mb-1">
                Parent Subcategory <span className="text-red-500">*</span>
              </label>
              <div ref={dropdownRef} className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setSubcatDropdownOpen(!subcatDropdownOpen)}
                  className={`w-full px-3 py-2 rounded-lg border text-[11px] text-left bg-white hover:border-[#CD9581] focus:outline-none focus:border-[#CD9581] focus:ring-1 focus:ring-[#CD9581]/20 transition-all flex items-center justify-between ${!serviceForm.subcategory_id ? 'border-red-300' : 'border-[#F2ECE4]'
                    }`}
                >
                  <span className={selectedSubcat ? "text-[#333D29]" : "text-[#908A94]"}>
                    {selectedSubcat
                      ? `${selectedSubcat.title} ${selectedSubcat.category_name ? `(${selectedSubcat.category_name})` : ""}`
                      : "Select subcategory..."}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#908A94] transition-transform ${subcatDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {subcatDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#F2ECE4] rounded-lg shadow-lg max-h-80 flex flex-col">
                    {/* Search Box */}
                    <div className="p-2 border-b border-[#F2ECE4] sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#908A94]" />
                        <input
                          type="text"
                          placeholder="Search subcategories..."
                          value={subcatSearch}
                          onChange={(e) => setSubcatSearch(e.target.value)}
                          className="w-full pl-8 pr-8 py-1.5 text-[10px] rounded-lg border border-[#F2ECE4] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581]"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {subcatSearch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubcatSearch("");
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#908A94] hover:text-[#CD9581]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-[#738285] mt-1">
                        {filteredSubcategories.length} of {subcategories.length} subcategories
                      </p>
                    </div>

                    {/* Options List - Grouped by Category */}
                    <div className="overflow-y-auto flex-1">
                      {Object.keys(groupedSubcategories).length === 0 ? (
                        <div className="p-4 text-center text-[10px] text-[#738285]">
                          No subcategories found
                        </div>
                      ) : (
                        Object.entries(groupedSubcategories).map(([catName, subs]) => (
                          <div key={catName}>
                            {/* Category Header */}
                            <div className="px-3 py-1.5 bg-[#FDFBF7] border-b border-[#F2ECE4] sticky top-0">
                              <p className="text-[9px] font-bold text-[#908A94] uppercase tracking-wider">
                                {catName}
                              </p>
                            </div>
                            {/* Subcategory Options */}
                            {subs.map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  setServiceForm({ ...serviceForm, subcategory_id: sub.id });
                                  setSubcatDropdownOpen(false);
                                  setSubcatSearch("");
                                }}
                                className={`w-full px-3 py-2 text-left text-[11px] hover:bg-[#FAF7F2] transition-colors border-b border-[#F2ECE4] ${serviceForm.subcategory_id === sub.id
                                  ? 'bg-[#FFF5F7] text-[#CD9581] font-semibold'
                                  : 'text-[#333D29]'
                                  }`}
                              >
                                {sub.title}
                              </button>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#333D29] mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Melasma, Face & Neck"
                  value={serviceForm.name || ""}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#333D29] mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#CD9581]" /> Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#333D29] font-semibold pointer-events-none">
                    ₱
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="2,500 or 1,000 per sq. in"
                    value={serviceForm.price_text || ""}
                    onChange={(e) => setServiceForm({ ...serviceForm, price_text: e.target.value })}
                    className="w-full pl-6 pr-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[11px] font-bold text-[#333D29] mb-1">Note / Qualifier (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Free if you avail platelet rich plasma"
                value={serviceForm.note || ""}
                onChange={(e) => setServiceForm({ ...serviceForm, note: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#F2ECE4] text-[11px] text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#CD9581] transition-all"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#CD9581] hover:bg-[#B8846F] text-white text-[11px] font-bold rounded-lg shadow-md shadow-[#CD9581]/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isEditing ? (
              <><Pencil className="w-3 h-3" />{loading ? "Saving…" : "Update"}</>
            ) : (
              <><Plus className="w-3 h-3" />{loading ? "Saving…" : "Save"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
