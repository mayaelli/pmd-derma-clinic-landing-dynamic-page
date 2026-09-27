// src/app/api/booking/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();

    const { data, error } = await supabase.from("bookings").insert([
      {
        patient_name: body.patientName,
        phone: body.phone,
        email: body.email,
        doctor: body.doctor || "Dr. Precious Imam, MD, FPDS",
        booking_date: body.date,
        time_slot: body.timeSlot,
        notes: body.notes || "",
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}