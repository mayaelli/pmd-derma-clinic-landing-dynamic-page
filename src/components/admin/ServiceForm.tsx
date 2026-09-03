"use client";

import { Pencil, Plus, Upload, Image as ImageIcon } from "lucide-react";

interface ServiceFormProps {
  editingId: string | null;
  serviceForm: { name: string; category: string; description: string };
  setServiceForm: React.Dispatch<React.SetStateAction<{ name: string; category: string; description: string }>>;
  imagePreview: string | null;
  imageFile: File | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  loading: boolean;
  categories: readonly { key: string; label: string }[];
}

export function ServiceForm({
  editingId,
  serviceForm,
  setServiceForm,
  imagePreview,
  imageFile,
  handleImageChange,
  handleSubmit,
  resetForm,
  loading,
  categories,
}: ServiceFormProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-[#333D29]">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="text-[11px] text-[#738285] mt-0.5">
              {editingId ? "Update the fields below and save." : "Fill in the details to add a new card."}
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[11px] font-semibold text-[#738285] hover:text-[#333D29] transition-colors px-2 py-1 rounded-lg hover:bg-[#F3EFEA] cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5">Service Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Hair & Scalp PRP Therapy"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5">Category</label>
            <select
              value={serviceForm.category}
              onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 cursor-pointer transition-all"
            >
              {categories.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#333D29] mb-1.5">Procedure Image</label>
          <div className="border-2 border-dashed border-[#F2ECE4] rounded-2xl p-4 bg-[#FDFBF7] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#E48EAB] transition-colors">
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-[#F2ECE4] shadow-xs" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white border border-[#F2ECE4] flex items-center justify-center text-[#908A94]">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-[#333D29]">{imageFile ? imageFile.name : editingId ? "Replace image (optional)" : "Select procedure image"}</p>
                <p className="text-[10px] text-[#738285]">PNG, JPG, WEBP · max 5MB</p>
              </div>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#F2ECE4] hover:border-[#E48EAB] text-[#908A94] text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>{imageFile ? "Change" : "Browse"}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#333D29] mb-1.5">Description</label>
          <textarea
            rows={3}
            required
            placeholder="Brief description of this procedure..."
            value={serviceForm.description}
            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-bold rounded-xl shadow-md shadow-[#CD9581]/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {editingId ? (
              <><Pencil className="w-3.5 h-3.5" />{loading ? "Saving…" : "Update Service"}</>
            ) : (
              <><Plus className="w-3.5 h-3.5" />{loading ? "Saving…" : "Save Service"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}