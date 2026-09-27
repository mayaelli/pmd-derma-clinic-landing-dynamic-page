"use client";

import { useState, useEffect } from "react";
import { X, Calendar, ChevronLeft, ChevronRight, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { AppointmentPicker } from "./AppointmentPicker";
import { format } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [view, setView] = useState<"tracker" | "form">("tracker");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    doctor: "Dr. Precious Imam, MD, FPDS",
    service: "General Consultation",
    date: "",
    timeSlot: "10:00 AM",
    notes: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    if (!isOpen) return;
    async function loadSurgeries() {
      setLoading(true);
      const timeMin = new Date(year, month, 1).toISOString();
      const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const timestamp = Date.now();
      try {
        const res = await fetch(
          `/api/calendar?timeMin=${timeMin}&timeMax=${timeMax}&t=${timestamp}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data.events) setEvents(data.events);
      } catch (err) {
        console.error("Failed to load surgeries", err);
      } finally {
        setLoading(false);
      }
    }
    loadSurgeries();
  }, [isOpen, year, month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-[#FAF8F5] sm:rounded-3xl shadow-2xl border border-[#E8E2D9] flex flex-col overflow-hidden">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-[#E8E2D9] bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FCE8E6] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#C87D87]" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-base text-[#1A1817]">
                {view === "tracker" ? "Live Surgery Schedule" : "Request a Consultation"}
              </h3>
              <p className="text-[10px] text-[#706A63] font-light">
                Precious MD Dermatology Center
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#706A63] hover:text-[#1A1817] hover:bg-[#F7F4EF] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Tab switcher ────────────────────────────────────────────────── */}
        <div className="flex border-b border-[#E8E2D9] bg-white px-5 sm:px-7 gap-1 shrink-0">
          {(["tracker", "form"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`pb-3 pt-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${view === tab
                ? "border-[#C87D87] text-[#C87D87]"
                : "border-transparent text-[#706A63] hover:text-[#1A1817]"
                }`}
            >
              {tab === "tracker" ? "Live Surgery Board" : "Direct Appointment Request"}
            </button>
          ))}
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-7">

            {/* ── TRACKER VIEW ──────────────────────────────────────────── */}
            {view === "tracker" && (
              <div className="space-y-5">

                {/* Month navigation */}
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-semibold text-[#1A1817]">
                    {monthName} {year}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                      className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white hover:bg-[#FCE8E6] hover:border-[#C87D87] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#706A63]" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                      className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white hover:bg-[#FCE8E6] hover:border-[#C87D87] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-[#706A63]" />
                    </button>
                  </div>
                </div>

                {/* Calendar grid */}
                {loading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C87D87]" />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#E8E2D9] overflow-hidden bg-white">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b border-[#E8E2D9]">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="py-2 text-center text-[10px] font-bold text-[#706A63] uppercase tracking-wider">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`blank-${i}`} className="min-h-[64px] sm:min-h-[72px] bg-[#FDFCFA] border-b border-r border-[#F2ECE8]" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const dayEvents = events.filter((e) => e.date === dateStr);
                        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                        return (
                          <div
                            key={day}
                            className="min-h-[64px] sm:min-h-[72px] p-1.5 border-b border-r border-[#F2ECE8] flex flex-col bg-white hover:bg-[#FDFCFA] transition-colors"
                          >
                            <span className={`text-[11px] font-semibold self-start mb-1 w-5 h-5 flex items-center justify-center rounded-full ${isToday
                              ? "bg-[#C87D87] text-white"
                              : "text-[#4A4440]"
                              }`}>
                              {day}
                            </span>
                            <div className="space-y-0.5 flex-1">
                              {dayEvents.map((e) => (
                                <div
                                  key={e.id}
                                  title={e.title}
                                  className="group relative bg-[#FCE8E6] text-[#A65B66] text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-md font-semibold truncate cursor-pointer hover:bg-[#C87D87] hover:text-white transition-colors leading-tight"
                                >
                                  {e.title}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 w-max max-w-[160px] bg-[#1A1817] text-white text-[10px] px-2 py-1.5 rounded-lg shadow-xl z-30 whitespace-normal break-words">
                                    {e.title}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1817]" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legend + CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E8E2D9]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#FCE8E6]" />
                    <span className="text-xs text-[#706A63]">Surgery / blocked — book early to secure your slot</span>
                  </div>
                  <button
                    onClick={() => setView("form")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Request Appointment
                  </button>
                </div>
              </div>
            )}

            {/* ── FORM VIEW ─────────────────────────────────────────────── */}
            {view === "form" && (
              submitted ? (
                <div className="flex flex-col items-center justify-center py-14 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FCE8E6] flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#C87D87]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-semibold text-[#1A1817]">Request Sent!</h4>
                    <p className="text-sm text-[#706A63] max-w-sm font-light">
                      Our team will confirm your appointment via SMS and email shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setView("tracker"); }}
                    className="mt-2 px-5 py-2.5 border border-[#E8E2D9] text-[#706A63] hover:bg-[#F7F4EF] text-xs font-medium rounded-full transition-colors cursor-pointer"
                  >
                    ← Back to Schedule
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Attending physician — read-only highlight */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FCE8E6]/50 border border-[#E5BCA9]/40">
                    <Sparkles className="w-3.5 h-3.5 text-[#C87D87] shrink-0" />
                    <div>
                      <p className="text-[10px] font-medium text-[#C87D87] tracking-wide uppercase">Attending Physician</p>
                      <p className="text-sm font-serif font-semibold text-[#1A1817] leading-tight">Dr. Precious Imam, MD, FPDS</p>
                    </div>
                  </div>

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                        Full Name <span className="text-[#C87D87]">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Maria Santos"
                        className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC]"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                        Phone Number <span className="text-[#C87D87]">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="0917XXXXXXX"
                        className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC]"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                      Email Address <span className="text-[#C87D87]">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="maria@example.com"
                      className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC]"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                      Preferred Date & Time <span className="text-[#C87D87]">*</span>
                    </label>
                    <div className="rounded-xl border border-[#E8E2D9] bg-white overflow-hidden">
                      <AppointmentPicker
                        selectedDate={formData.date ? new Date(formData.date) : undefined}
                        selectedTime={formData.timeSlot}
                        onSelect={(date, time) => {
                          setFormData({
                            ...formData,
                            date: format(date, "yyyy-MM-dd"),
                            timeSlot: time,
                          });
                        }}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                      Notes / Clinical Concerns
                      <span className="text-[#B0AAA4] font-normal ml-1">(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe any specific skin, hair, or nail concerns…"
                      className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all resize-none placeholder:text-[#C8C3BC]"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E8E2D9]">
                    <button
                      type="button"
                      onClick={() => setView("tracker")}
                      className="text-[11px] font-medium text-[#706A63] hover:text-[#1A1817] transition-colors cursor-pointer"
                    >
                      ← View Schedule
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-full shadow-sm shadow-[#C87D87]/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {submitting ? "Sending…" : "Submit Request"}
                    </button>
                  </div>
                </form>
              )
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
