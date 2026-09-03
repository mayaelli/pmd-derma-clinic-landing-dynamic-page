"use client";

import React, { useState, useRef } from "react";
import { Plus, Trash2, Upload, Calendar, Tag, X } from "lucide-react";

export interface PromoItemInput {
  name: string;
  sessions: string;
  price: string;
  originalPrice: string;
}

export interface PromoFormData {
  title: string;
  subtitle: string;
  badge: string;
  validity: string;
  validUntil: string;
  pubmatImage: string;
  items: PromoItemInput[];
}

interface PromoFormProps {
  promoForm: PromoFormData;
  setPromoForm: React.Dispatch<React.SetStateAction<PromoFormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingId?: string | null;
  onCancel?: () => void;
}

export function PromoForm({
  promoForm,
  setPromoForm,
  handleSubmit,
  loading,
  editingId,
  onCancel,
}: PromoFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    promoForm.pubmatImage || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safely guard items array against undefined
  const currentItems = promoForm?.items || [];

  // File Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setPromoForm((prev: PromoFormData) => ({
          ...prev,
          pubmatImage: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPromoForm((prev: PromoFormData) => ({
      ...prev,
      pubmatImage: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Itemized Pricing Handlers
  const handleAddItem = () => {
    setPromoForm({
      ...promoForm,
      items: [
        ...currentItems,
        { name: "", sessions: "1 session", price: "", originalPrice: "" },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index);
    setPromoForm({ ...promoForm, items: updated });
  };

  const handleItemChange = (
    index: number,
    field: keyof PromoItemInput,
    value: string
  ) => {
    const updated = [...currentItems];
    updated[index] = { ...updated[index], [field]: value };
    setPromoForm({ ...promoForm, items: updated });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="border-b border-[#F2ECE4] pb-3 sm:pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#333D29]">
              {editingId ? "Edit Promo" : "Create Special Offer / Promo"}
            </h2>
            <p className="text-xs text-[#738285] mt-1">
              {editingId ? "Update the fields below and save." : "Publish seasonal promotions and clinical treatment packages."}
            </p>
          </div>
          {editingId && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] font-semibold text-[#738285] hover:text-[#333D29] transition-colors px-2 py-1 rounded-lg hover:bg-[#F3EFEA] cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Basic Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">
              Promo Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sclerotherapy Treatment Package"
              value={promoForm.title || ""}
              onChange={(e) =>
                setPromoForm({ ...promoForm, title: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">
              Discount / Badge Tag *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. 20% OFF or LIMITED DEAL"
                value={promoForm.badge || ""}
                onChange={(e) =>
                  setPromoForm({ ...promoForm, badge: e.target.value })
                }
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
              />
              <Tag className="w-4 h-4 text-[#C87D87] absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Subtitle & Image Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">
              Subtitle / Highlight Note
            </label>
            <input
              type="text"
              placeholder="e.g. Includes board-certified dermatologist assessment"
              value={promoForm.subtitle || ""}
              onChange={(e) =>
                setPromoForm({ ...promoForm, subtitle: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">
              Poster Image Upload
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[42px] px-3.5 rounded-xl border border-dashed border-[#E5BCA9] bg-[#FDFBF7] hover:bg-[#FAF7F2] text-xs text-[#908A94] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#C87D87]" />
                <span>Upload Poster Image</span>
              </button>
            ) : (
              <div className="relative flex items-center justify-between p-2 rounded-xl border border-[#F2ECE4] bg-[#FDFBF7]">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-[#E5BCA9]/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-[#333D29] truncate font-medium">
                    Poster Uploaded
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date & Validity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">
              Display Validity Text *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Until Oct 31, 2026"
              value={promoForm.validity || ""}
              onChange={(e) =>
                setPromoForm({ ...promoForm, validity: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">
              Auto-Expire Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={promoForm.validUntil || ""}
                onChange={(e) =>
                  setPromoForm({ ...promoForm, validUntil: e.target.value })
                }
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 cursor-pointer transition-all"
              />
              <Calendar className="w-4 h-4 text-[#908A94] absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Itemized Pricing Section */}
        <div className="pt-2 border-t border-[#F2ECE4]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-xs font-bold text-[#333D29]">
                Package Items & Pricing Rates *
              </label>
              <p className="text-[11px] text-[#738285]">
                List treatments included in this promo package.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E5BCA9]/50 text-[#2D2B30] text-xs font-semibold hover:bg-[#CD9581] hover:text-white transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentItems.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[#F2ECE4] text-center text-xs text-[#738285]">
                No items added yet. Click &quot;Add Item&quot; to add rates.
              </div>
            ) : (
              currentItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-3 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl items-center"
                >
                  <div className="col-span-5 sm:col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Treatment Name"
                      value={item.name || ""}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#F2ECE4] bg-white focus:outline-none focus:border-[#E48EAB]"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Sessions (e.g. 3 sessions)"
                      value={item.sessions || ""}
                      onChange={(e) =>
                        handleItemChange(index, "sessions", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#F2ECE4] bg-white focus:outline-none focus:border-[#E48EAB]"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Promo Price"
                      value={item.price || ""}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#F2ECE4] bg-white focus:outline-none focus:border-[#E48EAB]"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Orig. Price"
                      value={item.originalPrice || ""}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "originalPrice",
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#F2ECE4] bg-white focus:outline-none focus:border-[#E48EAB]"
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-[#F2ECE4] flex justify-end gap-2">
          {editingId && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#F2ECE4] text-[#738285] hover:bg-[#F3EFEA] hover:text-[#333D29] text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-bold rounded-xl shadow-md shadow-[#CD9581]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {loading ? (editingId ? "Saving…" : "Publishing…") : (editingId ? "Save Changes" : "Publish Promo")}
          </button>
        </div>
      </form>
    </div>
  );
}