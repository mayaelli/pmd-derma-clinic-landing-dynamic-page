"use client";

import { useRef, useState, useEffect } from "react";
import {
  Film,
  Edit2,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Play,
  X,
  Volume2,
  VolumeX,
  Pause,
} from "lucide-react";
import { ReelRecord, toggleReelActive } from "@/app/admin/reels/actions";

// ── Video thumbnail that seeks to 0.5s so the first frame is visible ─────────
function VideoThumb({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;
    const seek = () => { vid.currentTime = 0.5; };
    vid.addEventListener("loadedmetadata", seek);
    return () => vid.removeEventListener("loadedmetadata", seek);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className="w-full h-full object-cover"
      muted
      playsInline
      preload="metadata"
    />
  );
}

interface ReelListProps {
  reelList: ReelRecord[];
  listLoading: boolean;
  editingId: string | null;
  startEdit: (reel: ReelRecord) => void;
  setDeleteTarget: (reel: ReelRecord) => void;
  onRefresh: () => void;
}

export function ReelList({
  reelList,
  listLoading,
  editingId,
  startEdit,
  setDeleteTarget,
  onRefresh,
}: ReelListProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [previewReel, setPreviewReel] = useState<ReelRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // ── Toggle active state ───────────────────────────────────────────────────
  const handleToggleActive = async (reel: ReelRecord) => {
    setTogglingId(reel.id);
    try {
      await toggleReelActive(reel.id, !reel.active);
      onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Toggle failed";
      alert("Failed to toggle: " + message);
    } finally {
      setTogglingId(null);
    }
  };

  // ── Preview modal ─────────────────────────────────────────────────────────
  const openPreview = (reel: ReelRecord) => {
    setPreviewReel(reel);
    setIsPlaying(true);
    setIsMuted(false);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setPreviewReel(null);
    setIsPlaying(false);
    document.body.style.overflow = "";
  };

  if (listLoading) {
    return (
      <div className="bg-white border border-[#F2ECE4] rounded-2xl p-8 flex items-center justify-center text-[#738285]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs font-semibold">Loading reels…</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm max-w-4xl space-y-4">
        <div className="border-b border-[#F2ECE4] pb-3">
          <h3 className="font-serif font-bold text-base text-[#2D2B30]">
            Published Reels
          </h3>
          <p className="text-xs text-[#738285]">
            Manage clinic video reels. Toggle visibility or delete entries.
          </p>
        </div>

        {reelList.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#738285] border border-dashed border-[#F2ECE4] rounded-xl">
            No reels published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {reelList.map((reel) => {
              const isEditing = editingId === reel.id;
              const toggling = togglingId === reel.id;

              return (
                <div
                  key={reel.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${!reel.active
                    ? "border-[#F2ECE4] bg-white opacity-60"
                    : isEditing
                      ? "border-[#E48EAB] bg-[#FFF5F7]"
                      : "border-[#F2ECE4] bg-[#FDFBF7] hover:border-[#E5BCA9]"
                    }`}
                >
                  {/* Thumbnail + info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#F7F4EF] border border-[#E8E2D9] shrink-0 relative">
                      {reel.poster_image ? (
                        <img
                          src={reel.poster_image}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <VideoThumb src={reel.video_url} />
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-[#2D2B30] truncate">
                          {reel.title}
                        </h4>
                        {reel.category && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FCE8E6] text-[10px] font-bold text-[#C87D87] shrink-0">
                            {reel.category}
                          </span>
                        )}
                        {!reel.active && (
                          <span className="px-2 py-0.5 rounded-md bg-[#F2ECE4] text-[10px] font-semibold text-[#738285] shrink-0">
                            Hidden
                          </span>
                        )}
                      </div>
                      {reel.description && (
                        <p className="text-[11px] text-[#738285] truncate mt-0.5 max-w-xs">
                          {reel.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-[#908A94]">
                        {reel.duration && <span>{reel.duration}</span>}
                        <span>
                          {new Date(reel.created_at).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() => openPreview(reel)}
                      className="p-2 rounded-lg transition-colors cursor-pointer border border-transparent text-[#738285] hover:bg-[#F3EFEA] hover:border-[#F2ECE4]"
                      title="Preview reel"
                    >
                      <Play className="w-4 h-4" />
                    </button>

                    {/* Hide / Show toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(reel)}
                      disabled={toggling}
                      className={`p-2 rounded-lg transition-colors cursor-pointer border border-transparent disabled:opacity-50 ${!reel.active
                        ? "text-[#E48EAB] hover:bg-[#FFF0F4] hover:border-[#F8BFC5]"
                        : "text-[#738285] hover:bg-[#F3EFEA] hover:border-[#F2ECE4]"
                        }`}
                      title={reel.active ? "Hide reel" : "Show reel"}
                    >
                      {toggling ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : reel.active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => startEdit(reel)}
                      className="p-2 text-[#E48EAB] hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#F2ECE4]"
                      title="Edit reel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(reel)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete reel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── In-admin Preview Modal ─────────────────────────────────────────── */}
      {previewReel && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative flex flex-col max-h-[90vh] w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoPreview
              reel={previewReel}
              isPlaying={isPlaying}
              isMuted={isMuted}
              setIsPlaying={setIsPlaying}
              setIsMuted={setIsMuted}
              onClose={closePreview}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ── Isolated video preview sub-component ────────────────────────────────────
function VideoPreview({
  reel,
  isPlaying,
  isMuted,
  setIsPlaying,
  setIsMuted,
  onClose,
}: {
  reel: ReelRecord;
  isPlaying: boolean;
  isMuted: boolean;
  setIsPlaying: (v: boolean) => void;
  setIsMuted: (v: boolean) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleRef = (el: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
    if (el && isPlaying) {
      el.play().catch(() => setIsPlaying(false));
    }
  };

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setIsPlaying(true); }
    else { el.pause(); setIsPlaying(false); }
  };

  const mute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  return (
    <>
      <video
        ref={handleRef}
        src={reel.video_url}
        poster={reel.poster_image ?? undefined}
        className="max-h-[75vh] w-auto rounded-2xl object-contain bg-black"
        playsInline
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="mt-3 flex items-center justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{reel.title}</p>
          {reel.category && (
            <p className="text-[#C87D87] text-xs">{reel.category}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggle}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={mute}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-red-500/70 text-white transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
