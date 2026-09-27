"use client";

import { useState, useEffect } from "react";
import { X, Send, Calendar, AlertCircle } from "lucide-react";

interface Booking {
  id: string;
  patient_name: string;
  phone: string;
  email: string;
  booking_date: string;
  time_slot: string;
  service?: string;
}

interface ActionModalProps {
  booking: Booking;
  actionType: "confirm" | "reschedule_decline";
  onClose: () => void;
  onSubmit: (data: {
    status: "confirmed" | "cancelled";
    customMessage: string;
    suggestedDate?: string;
    suggestedTime?: string;
  }) => Promise<void>;
  loading: boolean;
}

export function BookingActionModal({
  booking,
  actionType,
  onClose,
  onSubmit,
  loading,
}: ActionModalProps) {
  const isConfirm = actionType === "confirm";
  const [suggestedDate, setSuggestedDate] = useState("");
  const [suggestedTime, setSuggestedTime] = useState("10:00 AM");

  const [customMessage, setCustomMessage] = useState(
    isConfirm
      ? `Hi ${booking.patient_name}, your consultation at Precious MD on ${booking.booking_date} at ${booking.time_slot} is CONFIRMED. Please arrive 10 mins early.`
      : `Hi ${booking.patient_name}, unfortunately Dr. Precious is fully booked on ${booking.booking_date} at ${booking.time_slot}.`
  );

  // Automatically append date recommendation to message when date changes
  useEffect(() => {
    if (!isConfirm && suggestedDate) {
      setCustomMessage(
        `Hi ${booking.patient_name}, unfortunately Dr. Precious is fully booked on ${booking.booking_date} at ${booking.time_slot}. We recommend moving your slot to ${suggestedDate} at ${suggestedTime}. Reply YES to confirm.`
      );
    }
  }, [suggestedDate, suggestedTime, isConfirm, booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      status: isConfirm ? "confirmed" : "cancelled",
      customMessage,
      suggestedDate: !isConfirm ? suggestedDate : undefined,
      suggestedTime: !isConfirm ? suggestedTime : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#F2ECE4] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-5 border-b border-[#F2ECE4] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl text-white ${isConfirm ? "bg-emerald-500" : "bg-[#CD9581]"}`}>
              {isConfirm ? <Calendar className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#333D29]">
                {isConfirm ? "Confirm Appointment" : "Decline / Suggest Alternative"}
              </h3>
              <p className="text-xs text-[#738285]">{booking.patient_name} ({booking.phone})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-[#333D29]">

          {/* Reschedule Suggestion Block */}
          {!isConfirm && (
            <div className="p-3.5 bg-[#F3EFEA] rounded-xl space-y-3 border border-[#EBE5DC]">
              <p className="font-semibold text-xs text-[#2D2B30]">Suggest New Slot (Optional):</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#738285] uppercase mb-1">New Date</label>
                  <input
                    type="date"
                    value={suggestedDate}
                    onChange={(e) => setSuggestedDate(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#F2ECE4] focus:outline-none focus:border-[#CD9581]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#738285] uppercase mb-1">New Time Slot</label>
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

          {/* Message Text Box */}
          <div>
            <label className="block text-[10px] font-semibold text-[#738285] uppercase mb-1">
              SMS Message Payload (Sent to {booking.phone})
            </label>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl focus:outline-none focus:border-[#CD9581] font-sans leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#F2ECE4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#556365] hover:bg-[#F3EFEA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-xs ${isConfirm ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#CD9581] hover:bg-[#b8806c]"
                }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Sending..." : isConfirm ? "Confirm & Send SMS" : "Decline & Send SMS"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}