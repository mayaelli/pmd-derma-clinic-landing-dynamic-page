"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Star, Send, CheckCircle2 } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TREATMENT_TAGS = [
  "General Consultation",
  "Aesthetics & Botox",
  "Hair Restoration",
  "Dermatologic Surgery",
  "Acne & Skin Care",
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [patientName, setPatientName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [treatmentTag, setTreatmentTag] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert([
      {
        patient_name: isAnonymous ? "Anonymous Patient" : patientName.trim() || "Valued Patient",
        is_anonymous: isAnonymous,
        rating,
        treatment_tag: treatmentTag || null,
        comment: comment.trim(),
        is_published: false, // Default to false until admin approves
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setPatientName("");
        setIsAnonymous(false);
        setRating(5);
        setTreatmentTag("");
        setComment("");
        onClose();
      }, 2000);
    } else {
      alert("Error submitting review. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#F2ECE4] w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#FDFBF7] border-b border-[#F2ECE4]">
          <h3 className="font-serif font-bold text-base text-[#333D29]">Share Your Feedback</h3>
          <button
            onClick={onClose}
            className="text-[#908A94] hover:text-[#333D29] p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif font-bold text-lg text-[#333D29]">Thank You!</h4>
            <p className="text-xs text-[#556365] leading-relaxed">
              Your feedback has been submitted successfully and sent to our team for approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Star Rating */}
            <div className="text-center space-y-1">
              <label className="text-xs font-medium text-[#738285] uppercase tracking-wide">
                Your Overall Experience
              </label>
              <div className="flex justify-center items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-hidden transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-slate-100"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Identity section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#333D29]">Your Name</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#738285]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded-xs border-[#CBD5E1] text-[#C88482] focus:ring-[#C88482]"
                  />
                  <span>Submit anonymously</span>
                </label>
              </div>
              {!isAnonymous && (
                <input
                  type="text"
                  required={!isAnonymous}
                  placeholder="e.g. Maria Santos"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#F2ECE4] rounded-xl focus:outline-hidden focus:border-[#C88482] bg-[#FDFBF7]"
                />
              )}
            </div>

            {/* Optional Treatment Tag */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#333D29]">Treatment Received (Optional)</label>
              <div className="flex flex-wrap gap-1.5">
                {TREATMENT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTreatmentTag(treatmentTag === tag ? "" : tag)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${treatmentTag === tag
                      ? "bg-[#C88482] text-white"
                      : "bg-[#FDFBF7] text-[#556365] border border-[#F2ECE4] hover:bg-[#F3EFEA]"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#333D29]">Your Feedback</label>
              <textarea
                required
                rows={4}
                maxLength={300}
                placeholder="Share your experience with Dr. Precious and the staff..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 text-xs border border-[#F2ECE4] rounded-xl focus:outline-hidden focus:border-[#C88482] bg-[#FDFBF7] leading-relaxed resize-none"
              />
              <div className="text-right text-[10px] text-[#908A94]">
                {comment.length}/300
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#C88482] hover:bg-[#b57371] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}