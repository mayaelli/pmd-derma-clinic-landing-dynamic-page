"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Film,
  Plus,
  AlertTriangle,
  Info,
} from "lucide-react";
import { uploadReelVideo } from "@/app/admin/reels/actions";

export interface ReelFormData {
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: string;
}

interface ReelFormProps {
  reelForm: ReelFormData;
  setReelForm: React.Dispatch<React.SetStateAction<ReelFormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingId?: string | null;
  onCancel?: () => void;
}

const CATEGORIES = [
  "Skin Care",
  "Post-Care",
  "Derm Advice",
  "Treatment Showcase",
  "Before & After",
  "Clinic Life",
];

export function ReelForm({
  reelForm,
  setReelForm,
  handleSubmit,
  loading,
  editingId,
  onCancel,
}: ReelFormProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(
    reelForm.videoUrl || null
  );
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null);

  const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB
  const formatMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1) + " MB";

  // ── Video upload ──────────────────────────────────────────────────────────
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileSize(file.size);
    if (file.size > MAX_FILE_BYTES) {
      setFileSizeError(
        `File is ${formatMB(file.size)} — exceeds the 50 MB limit. Please compress it first (see tips below).`
      );
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }
    setFileSizeError(null);

    const localPreview = URL.createObjectURL(file);
    setVideoPreview(localPreview);
    setVideoUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const publicUrl = await uploadReelVideo(fd);
      URL.revokeObjectURL(localPreview);
      setVideoPreview(publicUrl);
      setReelForm((prev) => ({ ...prev, videoUrl: publicUrl }));
    } catch (err: unknown) {
      URL.revokeObjectURL(localPreview);
      setVideoPreview(null);
      setReelForm((prev) => ({ ...prev, videoUrl: "" }));
      if (videoInputRef.current) videoInputRef.current.value = "";
      const message = err instanceof Error ? err.message : "Upload failed";
      alert("Video upload failed: " + message);
    } finally {
      setVideoUploading(false);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview?.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    setFileSizeError(null);
    setSelectedFileSize(null);
    setReelForm((prev) => ({ ...prev, videoUrl: "" }));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const isSubmitDisabled = loading || videoUploading || !!fileSizeError;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="border-b border-[#F2ECE4] pb-3 sm:pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#333D29]">
              {editingId ? "Edit Reel" : "Upload New Reel"}
            </h2>
            <p className="text-xs text-[#738285] mt-1">
              {editingId
                ? "Update the fields below and save."
                : "Publish a short clinic video to the Reels section."}
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

        {/* ── Title + Category ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Laser Facial Walkthrough"
              value={reelForm.title}
              onChange={(e) =>
                setReelForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5">
              Category
            </label>
            <select
              value={reelForm.category}
              onChange={(e) =>
                setReelForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all cursor-pointer"
            >
              <option value="">— Select category —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Description + Duration ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the reel content…"
              value={reelForm.description}
              onChange={(e) =>
                setReelForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333D29] mb-1.5">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 0:45"
              value={reelForm.duration}
              onChange={(e) =>
                setReelForm((prev) => ({ ...prev, duration: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
            />
            <p className="text-[10px] text-[#738285] mt-1.5">
              Display label shown on the info panel (e.g. &ldquo;0:45&rdquo;).
            </p>
          </div>
        </div>

        {/* ── Video Upload ───────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-bold text-[#333D29] mb-1.5">
            Video File <span className="text-red-500">*</span>
          </label>

          {/* Compression tips */}
          <div className="mb-3 p-3 rounded-xl bg-[#FFF9F0] border border-[#F5DDB8] flex gap-2.5">
            <Info className="w-3.5 h-3.5 text-[#C87D87] shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-[10px] text-[#706A63] leading-relaxed">
              <p className="font-bold text-[#333D29]">Max file size: 50 MB per video</p>
              <p>CapCut exports are often 60–100 MB by default. Compress first using:</p>
              <ul className="space-y-1 pl-1">
                <li>
                  <span className="font-semibold text-[#333D29]">CapCut (easiest):</span>{" "}
                  Export → set Bitrate to <span className="font-semibold">Recommended</span> instead of &ldquo;Highest&rdquo;
                </li>
                <li>
                  <span className="font-semibold text-[#333D29]">FreeConvert (browser, free):</span>{" "}
                  <a
                    href="https://www.freeconvert.com/video-compressor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C87D87] underline hover:text-[#B8846F]"
                  >
                    freeconvert.com/video-compressor
                  </a>{" "}
                  — set target to 30 MB
                </li>
                <li>
                  <span className="font-semibold text-[#333D29]">Handbrake (desktop, free):</span>{" "}
                  Use the &ldquo;Fast 1080p30&rdquo; preset
                </li>
              </ul>
            </div>
          </div>

          <input
            type="file"
            ref={videoInputRef}
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={handleVideoUpload}
            className="hidden"
          />

          {fileSizeError && (
            <div className="mb-2 p-3 rounded-xl bg-red-50 border border-red-200 flex gap-2 items-start">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-600 font-medium">{fileSizeError}</p>
            </div>
          )}

          {!videoPreview ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={videoUploading}
                className="w-full h-[42px] px-3.5 rounded-xl border border-dashed border-[#E5BCA9] bg-[#FDFBF7] hover:bg-[#FAF7F2] text-xs text-[#908A94] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-[#C87D87]" />
                <span>Upload Video File</span>
              </button>
              <p className="text-[10px] text-[#738285] text-center">— or paste a URL —</p>
              <input
                type="url"
                placeholder="https://example.com/video.mp4"
                value={reelForm.videoUrl}
                onChange={(e) => {
                  setReelForm((prev) => ({ ...prev, videoUrl: e.target.value }));
                  if (e.target.value) setVideoPreview(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2ECE4] text-xs text-[#333D29] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#E48EAB] focus:ring-2 focus:ring-[#E48EAB]/20 transition-all"
              />
            </div>
          ) : (
            <div className="relative rounded-xl border border-[#F2ECE4] bg-[#FDFBF7] overflow-hidden">
              <video
                src={videoPreview}
                className="w-full max-h-40 object-contain bg-black"
                controls={false}
                muted
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-[#F2ECE4]">
                <span className="text-xs text-[#333D29] font-medium flex items-center gap-1.5">
                  {videoUploading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-[#C87D87]" />
                      Uploading video…
                    </>
                  ) : (
                    <>
                      <Film className="w-3 h-3 text-[#C87D87]" />
                      Video ready
                      {selectedFileSize && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#F2ECE4] text-[10px] text-[#706A63] font-semibold">
                          {formatMB(selectedFileSize)}
                        </span>
                      )}
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  disabled={videoUploading}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Submit ─────────────────────────────────────────────────────── */}
        <div className="pt-3 border-t border-[#F2ECE4] flex justify-end gap-2">
          {editingId && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitDisabled}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#F2ECE4] text-[#738285] hover:bg-[#F3EFEA] hover:text-[#333D29] text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-bold rounded-xl shadow-md shadow-[#CD9581]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {videoUploading
              ? "Uploading…"
              : loading
                ? editingId ? "Saving…" : "Publishing…"
                : editingId ? "Save Changes" : "Publish Reel"}
          </button>
        </div>
      </form>
    </div>
  );
}
