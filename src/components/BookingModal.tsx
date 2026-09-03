"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  Info,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Google Calendar Config
const GOOGLE_CALENDAR_ID = "slcpmaya@gmail.com";
const API_KEY = "AIzaSyCsC6rg0coi9lPpflFHXaZOy_PPL6L7Kvg";

interface ProcedureBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProcedureEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string;
  type: "hair" | "surgery" | "aesthetic" | "wound";
}

export function BookingModal({ isOpen, onClose }: ProcedureBoardModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<ProcedureEvent | null>(null);
  const [events, setEvents] = useState<ProcedureEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Fetch events live from Google Calendar whenever modal opens or month changes
  useEffect(() => {
    async function fetchCalendarEvents() {
      if (!isOpen) return;
      setLoading(true);
      setApiError(null);

      // Define start and end of the currently viewed month
      const timeMin = new Date(year, month, 1).toISOString();
      const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            GOOGLE_CALENDAR_ID
          )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Failed to fetch calendar events");
        }

        if (data.items) {
          const parsedEvents: ProcedureEvent[] = data.items.map((item: any) => {
            const start = item.start.dateTime || item.start.date;
            const eventDate = new Date(start);

            // Format YYYY-MM-DD using local time
            const localYear = eventDate.getFullYear();
            const localMonth = String(eventDate.getMonth() + 1).padStart(2, "0");
            const localDay = String(eventDate.getDate()).padStart(2, "0");
            const localDateString = `${localYear}-${localMonth}-${localDay}`;

            // Automatic badge categorization based on keywords in event title
            const titleLower = (item.summary || "").toLowerCase();
            let type: ProcedureEvent["type"] = "aesthetic";

            if (titleLower.includes("hair") || titleLower.includes("fue")) {
              type = "hair";
            } else if (
              titleLower.includes("surgery") ||
              titleLower.includes("excision") ||
              titleLower.includes("derm")
            ) {
              type = "surgery";
            } else if (titleLower.includes("wound")) {
              type = "wound";
            }

            return {
              id: item.id,
              date: localDateString,
              title: item.summary || "Scheduled Procedure",
              time: item.start.dateTime
                ? eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "All Day",
              type,
            };
          });

          setEvents(parsedEvents);
        }
      } catch (error: any) {
        console.error("Error loading Google Calendar events:", error);
        setApiError(error.message || "Could not load calendar events.");
      } finally {
        setLoading(false);
      }
    }

    fetchCalendarEvents();
  }, [isOpen, year, month]);

  // Handle ESC key and scroll locking
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

  const badgeStyles = {
    hair: "bg-[#E48EAB] text-white border-[#E48EAB]",
    surgery: "bg-[#908A94] text-white border-[#908A94]",
    aesthetic: "bg-[#F8BFC5] text-[#908A94] border-[#F8BFC5]",
    wound: "bg-[#E3E4E8] text-[#333D29] border-[#E3E4E8]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#908A94]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl h-[94vh] max-h-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white/90 backdrop-blur-md border-b border-[#F0C4CB]/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FAF0F2] rounded-2xl border border-[#F0C4CB]/60">
                  <CalendarIcon className="w-5 h-5 text-[#C87D87]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#333D29]">
                      Live Surgery & Procedure Board
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md text-[10px] font-semibold">
                      <Sparkles className="w-3 h-3" /> Live Sync
                    </span>
                  </div>
                  <p className="text-xs font-sans text-[#525B44]">
                    Precious MD Dermatology & Aesthetic Center
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#333D29] hover:text-[#C87D87] hover:bg-[#FAF0F2] rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner */}
            <div className="bg-[#FAF0F2] px-5 py-2 border-b border-[#F0C4CB]/40 flex items-center gap-2 shrink-0 text-xs text-[#908A94]">
              <Info className="w-4 h-4 text-[#C87D87] shrink-0" />
              <p className="font-medium">
                <span className="font-semibold text-[#C87D87]">Notice:</span> Click
                any scheduled day below to preview procedure times, then reach out on
                Messenger or WhatsApp to inquire or book.
              </p>
            </div>

            {/* Main Interactive Calendar Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-white/80 flex flex-col gap-4 relative">
              {/* Controls Bar & Legend */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF0F2]/80 p-3 rounded-2xl border border-[#F0C4CB]/50">
                {/* Month Navigator */}
                <div className="flex items-center gap-3">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#333D29]">
                    {monthName} {year}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-full bg-white border border-[#F0C4CB] text-[#908A94] hover:bg-[#F8BFC5]/30 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-full bg-white border border-[#F0C4CB] text-[#908A94] hover:bg-[#F8BFC5]/30 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Legend Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E48EAB] text-white font-semibold">
                    Hair Restoration
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#908A94] text-white font-semibold">
                    Derm Surgery
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F8BFC5] text-[#908A94] font-semibold border border-[#F8BFC5]">
                    Laser &amp; Aesthetic
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E3E4E8] text-[#333D29] font-semibold">
                    Wound Care
                  </span>
                </div>
              </div>

              {/* API Error Alert */}
              {apiError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{apiError} (Ensure calendar permissions are set to public)</span>
                </div>
              )}

              {/* Loading State Overlay */}
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-[#908A94] gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C87D87]" />
                  <p className="text-xs font-semibold">Syncing calendar events...</p>
                </div>
              ) : (
                /* Monthly Grid View */
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Day Names */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-[11px] font-bold text-[#908A94] py-1 uppercase tracking-wider"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Blank Offset Cells */}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div
                      key={`blank-${index}`}
                      className="min-h-[75px] sm:min-h-[90px] bg-[#FAF0F2]/20 rounded-xl border border-transparent"
                    />
                  ))}

                  {/* Day Cells */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const dayNumber = index + 1;
                    const formattedDay =
                      dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
                    const formattedMonth =
                      month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
                    const dateString = `${year}-${formattedMonth}-${formattedDay}`;

                    const eventsOnDay = events.filter(
                      (p) => p.date === dateString
                    );

                    return (
                      <div
                        key={dayNumber}
                        className={`min-h-[75px] sm:min-h-[90px] p-1.5 rounded-xl border transition-all flex flex-col justify-between ${eventsOnDay.length > 0
                          ? "bg-white border-[#F0C4CB] shadow-xs hover:shadow-md cursor-pointer"
                          : "bg-white/40 border-[#F0C4CB]/30"
                          }`}
                      >
                        <span className="text-xs font-bold text-[#333D29] self-start px-1">
                          {dayNumber}
                        </span>

                        {/* Procedure Badges */}
                        <div className="space-y-1 my-auto">
                          {eventsOnDay.map((evt) => (
                            <motion.div
                              key={evt.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedSlot(evt)}
                              className={`px-1.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold border leading-tight truncate ${badgeStyles[evt.type]
                                }`}
                              title={`${evt.title} (${evt.time})`}
                            >
                              <span className="block font-bold">{evt.title}</span>
                              <span className="opacity-90 text-[8px] sm:text-[9px] font-normal flex items-center gap-0.5 mt-0.5">
                                <Clock className="w-2.5 h-2.5 inline shrink-0" />
                                {evt.time}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Inquiries & Contact Bar */}
            <div className="p-4 bg-[#FAF0F2] border-t border-[#F0C4CB]/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold text-[#333D29]">
                  {selectedSlot ? (
                    <span>
                      Interested in{" "}
                      <strong className="text-[#C87D87]">
                        {selectedSlot.title} ({selectedSlot.date})
                      </strong>
                      ?
                    </span>
                  ) : (
                    "Have a specific procedure date in mind?"
                  )}
                </p>
                <p className="text-[11px] text-[#525B44]">
                  Inquire directly on our social media or email platforms below.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="https://m.me/preciousmdclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0084FF] hover:bg-[#0073E6] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Messenger</span>
                </a>

                <a
                  href="https://wa.me/639531603724"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="mailto:preciousmdclinic@gmail.com"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer border border-[#CD9581]/30"
                >
                  <Mail className="w-3.5 h-3.5 text-white/80" />
                  <span>Email</span>
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