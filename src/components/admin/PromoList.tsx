"use client";

import { useState } from "react";
import { Tag, Edit2, Trash2, Calendar, Loader2, EyeOff, Eye } from "lucide-react";
import { PromoRecord, togglePromoExpiry } from "@/app/admin/manage/actions";

interface PromoListProps {
  promoList: PromoRecord[];
  listLoading: boolean;
  editingId: string | null;
  startEdit: (promo: PromoRecord) => void;
  setDeleteTarget: (promo: PromoRecord) => void;
  onRefresh: () => void;
}

export function PromoList({
  promoList,
  listLoading,
  editingId,
  startEdit,
  setDeleteTarget,
  onRefresh,
}: PromoListProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleExpiry = async (promo: PromoRecord) => {
    const isCurrentlyExpired = isExpired(promo.valid_until);
    setTogglingId(promo.id);
    try {
      await togglePromoExpiry(promo.id, !isCurrentlyExpired);
      onRefresh();
    } catch (err: any) {
      alert("Failed to toggle: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  if (listLoading) {
    return (
      <div className="bg-white border border-[#F2ECE4] rounded-2xl p-8 flex items-center justify-center text-[#738285]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs font-semibold">Loading promotions...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm max-w-4xl space-y-4">
      <div className="border-b border-[#F2ECE4] pb-3">
        <h3 className="font-serif font-bold text-base text-[#2D2B30]">Active Promos & Offers</h3>
        <p className="text-xs text-[#738285]">Manage existing marketing deals and rates.</p>
      </div>

      {promoList.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#738285] border border-dashed border-[#F2ECE4] rounded-xl">
          No promotions published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {promoList.map((promo) => {
            const isEditing = editingId === promo.id;
            const expired = isExpired(promo.valid_until);
            const toggling = togglingId === promo.id;

            return (
              <div
                key={promo.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${expired
                  ? "border-[#F2ECE4] bg-white opacity-60"
                  : isEditing
                    ? "border-[#E48EAB] bg-[#FFF5F7]"
                    : "border-[#F2ECE4] bg-[#FDFBF7] hover:border-[#E5BCA9]"
                  }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {promo.pubmat_image ? (
                    <img
                      src={promo.pubmat_image}
                      alt={promo.title}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E5BCA9]/50 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#E5BCA9]/30 flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5 text-[#C87D87]" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-xs text-[#2D2B30] truncate">{promo.title}</h4>
                      {promo.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FCE8E6] text-[10px] font-bold text-[#C87D87] shrink-0">
                          {promo.badge}
                        </span>
                      )}
                      {expired && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F2ECE4] text-[10px] font-semibold text-[#738285] shrink-0">
                          Expired
                        </span>
                      )}
                    </div>
                    {promo.subtitle && (
                      <p className="text-[11px] text-[#738285] truncate mt-0.5">{promo.subtitle}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#908A94]">
                      <Calendar className="w-3 h-3 text-[#C87D87]" />
                      <span>{promo.validity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                  {/* Expire / Restore toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleExpiry(promo)}
                    disabled={toggling}
                    className={`p-2 rounded-lg transition-colors cursor-pointer border border-transparent ${expired
                      ? "text-[#E48EAB] hover:bg-[#FFF0F4] hover:border-[#F8BFC5]"
                      : "text-[#738285] hover:bg-[#F3EFEA] hover:border-[#F2ECE4]"
                      } disabled:opacity-50`}
                    title={expired ? "Restore promo" : "Expire promo"}
                  >
                    {toggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : expired ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => startEdit(promo)}
                    className="p-2 text-[#E48EAB] hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#F2ECE4]"
                    title="Edit Promo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(promo)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Promo"
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
  );
}

// ── helper ────────────────────────────────────────────────────────────────────
function isExpired(validUntil: string | null): boolean {
  if (!validUntil) return false;
  return new Date(validUntil) < new Date();
}
