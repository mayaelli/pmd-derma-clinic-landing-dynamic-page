"use client";

import Image from "next/image";
import { Stethoscope, Pencil, Trash2 } from "lucide-react";
import { ServiceRecord } from "../../app/admin/manage/actions";

interface ServiceListProps {
  serviceList: ServiceRecord[];
  listLoading: boolean;
  editingId: string | null;
  categoryLabels: Record<string, string>;
  refreshList: () => void;
  startEdit: (rec: ServiceRecord) => void;
  setDeleteTarget: (rec: ServiceRecord | null) => void;
}

export function ServiceList({
  serviceList,
  listLoading,
  editingId,
  categoryLabels,
  refreshList,
  startEdit,
  setDeleteTarget,
}: ServiceListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3 mb-4">
        <div>
          <h2 className="font-serif font-bold text-base text-[#333D29]">Current Services</h2>
          <p className="text-[11px] text-[#738285] mt-0.5">{serviceList.length} service{serviceList.length !== 1 ? "s" : ""} saved</p>
        </div>
        <button onClick={refreshList} className="text-[11px] font-semibold text-[#908A94] hover:underline transition-all cursor-pointer">Refresh</button>
      </div>

      {listLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 rounded-xl bg-[#FDFBF7]">
              <div className="w-12 h-12 rounded-xl bg-[#F2ECE4] shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-[#F2ECE4] rounded-full w-3/4" />
                <div className="h-2.5 bg-[#F2ECE4] rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : serviceList.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2 text-center">
          <Stethoscope className="w-8 h-8 text-[#E5BCA9]" />
          <p className="text-xs font-semibold text-[#738285]">No services yet</p>
          <p className="text-[11px] text-[#738285]/70">Add your first service using the form.</p>
        </div>
      ) : (
        <ul className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
          {serviceList.map((rec) => (
            <li
              key={rec.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${editingId === rec.id ? "border-[#CD9581]/40 bg-[#CD9581]/5" : "border-[#F2ECE4] bg-[#FDFBF7] hover:bg-white"
                }`}
            >
              {rec.image_url ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#F2ECE4]">
                  <Image src={rec.image_url} alt={rec.name} width={48} height={48} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#F2ECE4] shrink-0 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[#738285]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#2D2B30] truncate">{rec.name}</p>
                <span className="inline-block mt-0.5 text-[10px] font-medium text-[#908A94] bg-[#CD9581]/8 px-2 py-0.5 rounded-full">
                  {categoryLabels[rec.category] ?? rec.category}
                </span>
                <p className="text-[11px] text-[#738285] mt-1 line-clamp-2 leading-relaxed">{rec.description}</p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => startEdit(rec)}
                  className="w-8 h-8 rounded-xl bg-white border border-[#F2ECE4] text-[#908A94] hover:bg-[#CD9581] hover:text-white hover:border-[#CD9581] flex items-center justify-center transition-all cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(rec)}
                  className="w-8 h-8 rounded-xl bg-white border border-[#F2ECE4] text-[#738285] hover:bg-red-50 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}