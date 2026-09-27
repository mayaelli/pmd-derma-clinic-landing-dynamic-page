"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle, RefreshCw, X, Send, Calendar, AlertCircle, Eye, Copy, Check, Archive } from "lucide-react";

interface Booking {
  id: string;
  created_at: string;
  patient_name: string;
  phone: string;
  email: string;
  doctor: string;
  booking_date: string;
  time_slot: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
}

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "archive">("all");
  const supabase = createClient();

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<"confirm" | "reschedule_decline">("confirm");
  const [suggestedDate, setSuggestedDate] = useState("");
  const [suggestedTime, setSuggestedTime] = useState("10:00 AM");
  const [customMessage, setCustomMessage] = useState("");
  const [submittingModal, setSubmittingModal] = useState(false);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookings(data as Booking[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openActionModal = (booking: Booking, type: "confirm" | "reschedule_decline") => {
    setSelectedBooking(booking);
    setActionType(type);
    setSuggestedDate("");
    setSuggestedTime("10:00 AM");

    if (type === "confirm") {
      setCustomMessage(
        `Hi ${booking.patient_name}, your consultation at Precious MD on ${booking.booking_date} at ${booking.time_slot} is CONFIRMED. See you then!`
      );
    } else {
      setCustomMessage(
        `Hi ${booking.patient_name}, regarding your consultation request at Precious MD for ${booking.booking_date}: Dr. Precious is unavailable at that slot.`
      );
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setSubmittingModal(true);
    const newStatus = actionType === "confirm" ? "confirmed" : "cancelled";

    let finalMessage = customMessage;
    if (actionType === "reschedule_decline" && suggestedDate) {
      finalMessage += ` We suggest rescheduling to ${suggestedDate} at ${suggestedTime}. Please reply to this email to lock this slot.`;
    }

    try {
      // 1. Update status in Supabase
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      // 2. Dispatch Email payload to API endpoint
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedBooking.email,
          patientName: selectedBooking.patient_name,
          subject:
            actionType === "confirm"
              ? "Appointment Confirmed - Precious MD Clinic"
              : "Appointment Update - Precious MD Clinic",
          message: finalMessage,
        }),
      });

      // 3. Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: newStatus } : b))
      );

      setSelectedBooking(null);
    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setSubmittingModal(false);
    }
  };

  const filtered = bookings.filter((b) => {
    // Helper function to check if a booking is archived
    const isArchived = (booking: Booking) => {
      if (booking.status !== "confirmed") return false;
      const bookingDate = new Date(booking.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return bookingDate < today;
    };

    if (filter === "all") {
      // "All" shows only active bookings (exclude archived)
      return !isArchived(b);
    }

    if (filter === "archive") {
      // Show confirmed bookings where the booking date has passed
      return isArchived(b);
    }

    return b.status === filter;
  });

  // Calculate archive count
  const archiveCount = bookings.filter((b) => {
    if (b.status !== "confirmed") return false;
    const bookingDate = new Date(b.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#F2ECE4] shadow-xs">
        <div className="flex gap-2">
          {(["all", "pending", "confirmed", "cancelled", "archive"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors flex items-center gap-1.5 ${filter === tab
                ? "bg-[#C88482] text-white shadow-xs"
                : "bg-[#FDFBF7] text-[#333D29] border border-[#F2ECE4] hover:bg-[#F3EFEA]"
                }`}
            >
              {tab === "archive" && <Archive className="w-3.5 h-3.5" />}
              <span>{tab}</span>
              {tab === "archive" && archiveCount > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === tab
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
                  }`}>
                  {archiveCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 text-xs font-medium text-[#333D29] bg-[#FDFBF7] border border-[#F2ECE4] px-3 py-1.5 rounded-lg hover:bg-[#F3EFEA]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C88482]" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#F2ECE4] shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-[#333D29]">
          <thead className="bg-[#FDFBF7] border-b border-[#F2ECE4] text-[10px] uppercase font-semibold text-[#908A94]">
            <tr>
              <th className="p-3.5">Patient</th>
              <th className="p-3.5">Phone</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Doctor</th>
              <th className="p-3.5">Requested Date</th>
              <th className="p-3.5">Time Slot</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2ECE4]">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-[#FDFBF7]">
                <td className="p-3.5 font-medium">{b.patient_name}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">{b.phone}</span>
                    <button
                      onClick={() => copyToClipboard(b.phone)}
                      className="p-1 text-slate-400 hover:text-[#CD9581] hover:bg-[#F3EFEA] rounded transition-colors"
                      title="Copy phone number"
                    >
                      {copySuccess ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="p-3.5 text-slate-600 text-xs max-w-[200px] truncate">{b.email}</td>
                <td className="p-3.5 text-slate-700">{b.doctor}</td>
                <td className="p-3.5">{b.booking_date}</td>
                <td className="p-3.5 text-slate-600">{b.time_slot}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${b.status === "confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : b.status === "cancelled"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                      }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setDetailsBooking(b);
                        setDetailsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Full Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={() => openActionModal(b, "confirm")}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Confirm & Email Patient"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openActionModal(b, "reschedule_decline")}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Decline / Suggest Alternative"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Email Action Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#F2ECE4] shadow-xl overflow-hidden">
            <div className="p-4 border-b border-[#F2ECE4] flex items-center justify-between bg-[#FDFBF7]">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl text-white ${actionType === "confirm" ? "bg-emerald-500" : "bg-[#CD9581]"
                    }`}
                >
                  {actionType === "confirm" ? (
                    <Calendar className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#333D29]">
                    {actionType === "confirm"
                      ? "Confirm Appointment"
                      : "Decline / Suggest Alternative"}
                  </h3>
                  <p className="text-[11px] text-[#738285]">
                    {selectedBooking.patient_name} ({selectedBooking.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-4 space-y-4 text-xs text-[#333D29]">
              {actionType === "reschedule_decline" && (
                <div className="p-3 bg-[#F3EFEA] rounded-xl space-y-2 border border-[#EBE5DC]">
                  <p className="font-semibold text-xs text-[#2D2B30]">Suggest Alternative Slot:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#738285] uppercase mb-0.5">
                        New Date
                      </label>
                      <input
                        type="date"
                        value={suggestedDate}
                        onChange={(e) => setSuggestedDate(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-[#F2ECE4] focus:outline-none focus:border-[#CD9581]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#738285] uppercase mb-0.5">
                        New Time Slot
                      </label>
                      <select
                        value={suggestedTime}
                        onChange={(e) => setSuggestedTime(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-[#F2ECE4] focus:outline-none focus:border-[#CD9581]"
                      >
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                        <option>01:00 PM</option>
                        <option>03:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-[#738285] uppercase mb-1">
                  Email Message Body
                </label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl focus:outline-none focus:border-[#CD9581] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F2ECE4]">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#556365] hover:bg-[#F3EFEA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all ${actionType === "confirm"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-[#CD9581] hover:bg-[#b8806c]"
                    }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submittingModal
                      ? "Sending..."
                      : actionType === "confirm"
                        ? "Confirm & Send Email"
                        : "Send Email & Cancel"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {detailsModalOpen && detailsBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            {/* Compact Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${detailsBooking.status === "confirmed" ? "bg-emerald-500" :
                  detailsBooking.status === "cancelled" ? "bg-rose-500" : "bg-amber-500"
                  }`} />
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    {detailsBooking.patient_name}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {new Date(detailsBooking.created_at).toLocaleDateString()} at {new Date(detailsBooking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailsModalOpen(false);
                  setDetailsBooking(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compact Content */}
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Status & Doctor Row */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Doctor</p>
                  <p className="text-sm font-medium text-slate-900">{detailsBooking.doctor}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${detailsBooking.status === "confirmed"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : detailsBooking.status === "cancelled"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                >
                  {detailsBooking.status}
                </span>
              </div>

              {/* Contact Grid */}
              <div className="space-y-2">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{detailsBooking.phone}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(detailsBooking.phone)}
                      className="flex-shrink-0 p-2 text-white bg-[#CD9581] hover:bg-[#B8846F] rounded-lg transition-all shadow-sm"
                      title="Copy phone"
                    >
                      {copySuccess ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-xs text-slate-900 break-all">{detailsBooking.email}</p>
                </div>
              </div>

              {/* Appointment Details Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-slate-900">{detailsBooking.booking_date}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">Time</p>
                  <p className="text-sm font-semibold text-slate-900">{detailsBooking.time_slot}</p>
                </div>
              </div>

              {/* Notes Section */}
              {detailsBooking.notes && (
                <div className="bg-[#FDFBF7] rounded-lg p-3 border border-[#F2ECE4]">
                  <p className="text-[10px] font-semibold text-[#8C6253] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#C88482]" />
                    Patient Notes
                  </p>
                  <p className="text-xs text-[#333D29] leading-relaxed whitespace-pre-wrap">
                    {detailsBooking.notes}
                  </p>
                </div>
              )}

              {/* Booking ID */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Booking ID</p>
                <code className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">{detailsBooking.id}</code>
              </div>
            </div>

            {/* Compact Footer */}
            {detailsBooking.status === "pending" && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    openActionModal(detailsBooking, "confirm");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    openActionModal(detailsBooking, "reschedule_decline");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 rounded-lg transition-all border border-rose-200"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Decline
                </button>
              </div>
            )}
            {detailsBooking.status !== "pending" && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    setDetailsBooking(null);
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg transition-all border border-slate-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}