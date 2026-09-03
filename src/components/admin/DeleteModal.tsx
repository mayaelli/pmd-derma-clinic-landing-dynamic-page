"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { ServiceRecord } from "../../app/admin/manage/actions";

interface DeleteModalProps {
  service: ServiceRecord;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ service, loading, onConfirm, onCancel }: DeleteModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative bg-white rounded-2xl shadow-2xl border border-[#F2ECE4] w-full max-w-sm p-6 space-y-5"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 border border-red-100 mx-auto">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-center space-y-1.5">
          <h3 className="font-serif font-bold text-base text-[#333D29]">Delete Service?</h3>
          <p className="font-sans text-xs text-[#738285] leading-relaxed">
            You&apos;re about to permanently delete{" "}
            <span className="font-semibold text-[#333D29]">&ldquo;{service.name}&rdquo;</span>.
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-[#F2ECE4] text-xs font-semibold text-[#738285] hover:bg-[#F3EFEA] hover:text-[#333D29] transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}