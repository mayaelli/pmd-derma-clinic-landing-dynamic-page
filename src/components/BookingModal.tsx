"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, MessageCircle, Mail } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Paste your full appointment schedule URL here
  scheduleUrl?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  scheduleUrl = "https://calendar.app.google/Dx3kqgCveUnEREUd7", // Replace with your exact link
}: BookingModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Ensure iframe renders the embed-friendly layout
  const cleanUrl = scheduleUrl.includes("?") 
    ? `${scheduleUrl}&gv=true` 
    : `${scheduleUrl}?gv=true`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[850px] bg-[#FAF7F2] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#E5DFD5]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DFD5] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FBEAD6] rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-[#6B7556]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C302E]">
                    Select an Appointment Time
                  </h3>
                  <p className="text-xs font-sans text-gray-500">
                    Precious MD Dermatology & Aesthetic Clinic
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Appointment Schedule Embed */}
            <div className="flex-1 w-full bg-white relative overflow-hidden">
              <iframe
                src={cleanUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                className="w-full h-full border-none"
                title="Google Calendar Appointment Scheduling"
              />
            </div>

            {/* Footer Inquiries Bar */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <p className="text-xs text-stone-600 font-medium">
                Need to ask a question before booking?
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href="https://m.me/preciousmdclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#0084FF] text-white text-xs font-semibold rounded-lg hover:bg-[#0073E6] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messenger</span>
                </a>
                <a
                  href="mailto:preciousmdclinic@gmail.com"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#EA4335] text-white text-xs font-semibold rounded-lg hover:bg-[#D33828] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Gmail</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BookingModal;