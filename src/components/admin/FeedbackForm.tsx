"use client";

import { Plus } from "lucide-react";

interface FeedbackFormProps {
  feedbackForm: { patientName: string; treatmentTaken: string; rating: string; comment: string };
  setFeedbackForm: React.Dispatch<React.SetStateAction<{ patientName: string; treatmentTaken: string; rating: string; comment: string }>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function FeedbackForm({ feedbackForm, setFeedbackForm, handleSubmit, loading }: FeedbackFormProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="border-b border-[#F2ECE4] pb-3 sm:pb-4">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-[#333D29]">Add Patient Testimonial</h2>
          <p className="text-xs text-[#738285] mt-1">Publish verified client outcomes and reviews.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">Patient Identifier</label>
            <input
              type="text"
              required
              placeholder="e.g. Patient A.M."
              value={feedbackForm.patientName}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, patientName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">Procedure Received</label>
            <input
              type="text"
              required
              placeholder="e.g. Hair & Scalp PRP"
              value={feedbackForm.treatmentTaken}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, treatmentTaken: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">Rating</label>
            <select
              value={feedbackForm.rating}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 cursor-pointer transition-all"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#333D29] mb-1.5 sm:mb-2">Testimonial</label>
          <textarea
            rows={3}
            required
            placeholder="Paste the patient's verified feedback..."
            value={feedbackForm.comment}
            onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
          />
        </div>
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-bold rounded-xl shadow-md shadow-[#CD9581]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Saving…" : "Save Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}