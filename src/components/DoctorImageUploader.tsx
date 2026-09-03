"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Upload, Sparkles, Download, RefreshCw, AlertCircle } from "lucide-react";

export function DoctorImageUploader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);
    setProgress("Initializing vision AI model...");

    try {
      // Process background removal directly in browser canvas via WebAssembly
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          // Convert key to string to prevent method execution errors
          const keyStr = String(key);
          const percent = total > 0 ? Math.round((current / total) * 100) : 0;

          if (keyStr.includes("fetch")) {
            setProgress(`Downloading AI model weights: ${percent}%`);
          } else if (keyStr.includes("compute")) {
            setProgress(`Extracting sharp subject cutout: ${percent}%`);
          } else {
            setProgress(`Processing image: ${percent}%`);
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (error) {
      console.error("Failed to remove background:", error);
      setErrorMessage("Could not process image. Please try a higher-resolution PNG or JPG file.");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-[#E5BCA9]/40 shadow-xs text-center space-y-4">
      {/* Header Title */}
      <h3 className="font-serif text-lg font-bold text-[#333D29] flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-[#C87D87]" />
        <span>Auto Remove Background</span>
      </h3>

      {/* Error Message Notification */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {!processedUrl ? (
        <label className="border-2 border-dashed border-[#E5BCA9]/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-all group relative overflow-hidden">
          <Upload className="w-8 h-8 text-[#C87D87] group-hover:scale-110 transition-transform mb-2" />
          <span className="text-xs font-semibold text-[#333D29]">
            {loading ? "Processing Cutout..." : "Upload Dr. Precious Portrait"}
          </span>
          <span className="text-[10px] text-[#908A94] mt-1">PNG or JPG (High Quality Recommended)</span>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            className="hidden"
          />
        </label>
      ) : (
        /* Preview & Download State */
        <div className="space-y-4">
          <div className="relative h-80 w-full bg-[#FAF7F2] rounded-2xl overflow-hidden flex items-center justify-center border border-[#E5BCA9]/30">
            {/* Checkerboard Pattern indicating transparent background */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "radial-gradient(#333D29 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />

            {/* Clean Transparent Cutout */}
            <img
              src={processedUrl}
              alt="Processed Doctor Cutout"
              className="h-full object-contain drop-shadow-xl relative z-10 p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <a
              href={processedUrl}
              download="precious-md-doctor.png"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E48EAB] hover:bg-[#D4778E] text-white text-xs font-semibold py-3 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-white/80" />
              <span>Download High-Res Cutout PNG</span>
            </a>

            <button
              onClick={() => {
                setProcessedUrl(null);
                setErrorMessage(null);
              }}
              className="p-3 rounded-full border border-[#E5BCA9]/50 text-[#333D29] hover:bg-[#FAF7F2] transition-colors"
              title="Upload New Image"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Progress Loading Bar */}
      {loading && (
        <div className="space-y-2 pt-2">
          <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E5BCA9]/30">
            <div className="bg-[#C87D87] h-full w-2/3 animate-pulse rounded-full" />
          </div>
          <p className="text-[11px] font-sans text-[#908A94] font-medium">{progress}</p>
        </div>
      )}
    </div>
  );
}