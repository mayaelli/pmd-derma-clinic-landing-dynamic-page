"use client";

import { useState, useEffect } from "react";
import { X, Calendar, ChevronLeft, ChevronRight, Loader2, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
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

  const [dayModal, setDayModal] = useState<{ date: string; label: string; events: any[] } | null>(null);

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

  const busyColor = (count: number) => {
    if (count >= 3) return { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-400" };
    if (count === 2) return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" };
    return { bg: "bg-[#FCE8E6]", text: "text-[#A65B66]", dot: "bg-[#C87D87]" };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-[#FAF8F5] sm:rounded-3xl shadow-2xl border border-[#E8E2D9] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-[#E8E2D9] bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FCE8E6] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#C87D87]" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-base text-[#1A1817]">
                {view === "tracker" ? "Live Surgery Schedule" : "Request a Consultation"}
              </h3>
              <p className="text-[10px] text-[#706A63] font-light">Precious MD Dermatology Center</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-[#706A63] hover:text-[#1A1817] hover:bg-[#F7F4EF] transition-colors cursor-pointer" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E2D9] bg-white px-5 sm:px-7 gap-1 shrink-0">
          {(["tracker", "form"] as const).map((tab) => (
            <button key={tab} onClick={() => setView(tab)}
              className={`pb-3 pt-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${view === tab ? "border-[#C87D87] text-[#C87D87]" : "border-transparent text-[#706A63] hover:text-[#1A1817]"}`}>
              {tab === "tracker" ? "Live Surgery Board" : "Direct Appointment Request"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-7">

            {/* TRACKER */}
            {view === "tracker" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-semibold text-[#1A1817]">{monthName} {year}</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                      className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white hover:bg-[#FCE8E6] hover:border-[#C87D87] flex items-center justify-center transition-all cursor-pointer">
                      <ChevronLeft className="w-4 h-4 text-[#706A63]" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                      className="w-8 h-8 rounded-full border border-[#E8E2D9] bg-white hover:bg-[#FCE8E6] hover:border-[#C87D87] flex items-center justify-center transition-all cursor-pointer">
                      <ChevronRight className="w-4 h-4 text-[#706A63]" />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C87D87]" />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#E8E2D9] overflow-hidden bg-white">
                    <div className="grid grid-cols-7 border-b border-[#E8E2D9]">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="py-2 text-center text-[10px] font-bold text-[#706A63] uppercase tracking-wider">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`blank-${i}`} className="min-h-[64px] sm:min-h-[72px] bg-[#FDFCFA] border-b border-r border-[#F2ECE8]" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const dayEvents = events.filter((e) => e.date === dateStr);
                        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                        const hasEvents = dayEvents.length > 0;
                        const colors = busyColor(dayEvents.length);
                        const dayLabel = new Date(year, month, day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

                        return (
                          <div
                            key={day}
                            onClick={() => hasEvents && setDayModal({ date: dateStr, label: dayLabel, events: dayEvents })}
                            className={`min-h-[64px] sm:min-h-[72px] p-1.5 border-b border-r border-[#F2ECE8] flex flex-col bg-white transition-colors ${hasEvents ? "cursor-pointer hover:bg-[#FFF5F5]" : "hover:bg-[#FDFCFA]"}`}
                          >
                            <span className={`text-[11px] font-semibold self-start mb-1 w-5 h-5 flex items-center justify-center rounded-full ${isToday ? "bg-[#C87D87] text-white" : "text-[#4A4440]"}`}>
                              {day}
                            </span>
                            {hasEvents && (
                              <div className={`mt-auto rounded-lg px-1.5 py-1 ${colors.bg} flex items-center gap-1 flex-wrap`}>
                                {dayEvents.slice(0, 3).map((_, idx) => (
                                  <div key={idx} className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                                ))}
                                {dayEvents.length > 3 && (
                                  <span className={`text-[8px] font-bold ${colors.text}`}>+{dayEvents.length - 3}</span>
                                )}
                                <span className={`text-[8px] sm:text-[9px] font-semibold leading-none ${colors.text} whitespace-nowrap`}>
                                  {dayEvents.length === 1 ? "1 surgery" : `${dayEvents.length} surgeries`}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E8E2D9]">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C87D87]" />
                      <span className="text-[11px] text-[#706A63]">1 surgery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-[11px] text-[#706A63]">2 surgeries</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="text-[11px] text-[#706A63]">3+ — very busy</span>
                    </div>
                    <span className="text-[11px] text-[#706A63] italic">Tap a day to see details</span>
                  </div>
                  <button onClick={() => setView("form")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-full transition-all shadow-sm cursor-pointer shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    Request Appointment
                  </button>
                </div>
              </div>
            )}

            {/* FORM */}
            {view === "form" && (
              submitted ? (
                <div className="flex flex-col items-center justify-center py-14 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FCE8E6] flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#C87D87]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-semibold text-[#1A1817]">Request Sent!</h4>
                    <p className="text-sm text-[#706A63] max-w-sm font-light">Our team will confirm your appointment via SMS and email shortly.</p>
                  </div>
                  <button onClick={() => { setSubmitted(false); setView("tracker"); }}
                    className="mt-2 px-5 py-2.5 border border-[#E8E2D9] text-[#706A63] hover:bg-[#F7F4EF] text-xs font-medium rounded-full transition-colors cursor-pointer">
                    ← Back to Schedule
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FCE8E6]/50 border border-[#E5BCA9]/40">
                    <Sparkles className="w-3.5 h-3.5 text-[#C87D87] shrink-0" />
                    <div>
                      <p className="text-[10px] font-medium text-[#C87D87] tracking-wide uppercase">Attending Physician</p>
                      <p className="text-sm font-serif font-semibold text-[#1A1817] leading-tight">Dr. Precious Imam, MD, FPDS</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">Full Name <span className="text-[#C87D87]">*</span></label>
                      <input required type="text" placeholder="e.g. Maria Santos"
                        className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC]"
                        value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">Phone Number <span className="text-[#C87D87]">*</span></label>
                      <input required type="tel" placeholder="0917XXXXXXX"
                        className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC]"
                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">Email Address <span className="text-[#C87D87]">*</span></label>
                    <input required type="email" placeholder="maria@example.com"
                      className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC]"
                      value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">Preferred Date & Time <span className="text-[#C87D87]">*</span></label>
                    <div className="rounded-xl border border-[#E8E2D9] bg-white overflow-hidden">
                      <AppointmentPicker
                        selectedDate={formData.date ? new Date(formData.date) : undefined}
                        selectedTime={formData.timeSlot}
                        onSelect={(date, time) => setFormData({ ...formData, date: format(date, "yyyy-MM-dd"), timeSlot: time })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                      Notes / Clinical Concerns <span className="text-[#B0AAA4] font-normal ml-1">(Optional)</span>
                    </label>
                    <textarea rows={3} placeholder="Describe any specific skin, hair, or nail concerns…"
                      className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all resize-none placeholder:text-[#C8C3BC]"
                      value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E8E2D9]">
                    <button type="button" onClick={() => setView("tracker")}
                      className="text-[11px] font-medium text-[#706A63] hover:text-[#1A1817] transition-colors cursor-pointer">
                      ← View Schedule
                    </button>
                    <button type="submit" disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-full shadow-sm shadow-[#C87D87]/20 transition-all cursor-pointer disabled:opacity-60">
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

      {/* Day detail modal */}
      {dayModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setDayModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E8E2D9] w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dayModal.events.length >= 3 ? "bg-red-100" : dayModal.events.length === 2 ? "bg-amber-100" : "bg-[#FCE8E6]"}`}>
                  <AlertCircle className={`w-4 h-4 ${dayModal.events.length >= 3 ? "text-red-500" : dayModal.events.length === 2 ? "text-amber-500" : "text-[#C87D87]"}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1A1817]">{dayModal.label}</p>
                  <p className="text-[10px] text-[#706A63]">
                    {dayModal.events.length === 1 ? "1 surgery scheduled" : `${dayModal.events.length} surgeries scheduled`}
                    {dayModal.events.length >= 3 && " — Very Busy"}
                  </p>
                </div>
              </div>
              <button onClick={() => setDayModal(null)} className="w-7 h-7 rounded-full flex items-center justify-center text-[#706A63] hover:bg-[#F7F4EF] cursor-pointer transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {dayModal.events.map((ev, idx) => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#FFF5F5] border border-[#FCE8E6]">
                  <span className="w-5 h-5 rounded-full bg-[#C87D87] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#1A1817] leading-snug">{ev.title}</p>
                    {ev.time && <p className="text-[10px] text-[#706A63] mt-0.5">{ev.time}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 pt-2">
              <p className="text-[11px] text-[#706A63] text-center mb-3">
                {dayModal.events.length <= 2
                  ? "This day has some surgeries but slots may still be available. Feel free to book!"
                  : "This day is quite packed. We recommend choosing a different date for a smoother experience."}
              </p>
              <button
                onClick={() => { setDayModal(null); setView("form"); }}
                className="w-full py-2.5 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
                Book a Different Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingModal;
