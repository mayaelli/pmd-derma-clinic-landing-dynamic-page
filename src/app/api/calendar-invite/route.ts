import { NextResponse } from "next/server";
import { Resend } from "resend";

// Generates a valid ICS calendar invite string
function generateICS({
  patientName,
  bookingDate,
  timeSlot,
  phone,
  email,
  notes,
}: {
  patientName: string;
  bookingDate: string;
  timeSlot: string;
  phone: string;
  email: string;
  notes?: string;
}): string {
  // Parse date + time into a Date object (Asia/Manila = UTC+8)
  const dateTimeStr = `${bookingDate} ${timeSlot}`;
  const start = new Date(dateTimeStr);
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid date/time: "${dateTimeStr}"`);
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const uid = `${Date.now()}-pmd@preciousmd.com`;
  const now = fmt(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Precious MD Dermatology//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Manila:${fmt(start)}`,
    `DTEND;TZID=Asia/Manila:${fmt(end)}`,
    `SUMMARY:Consultation - ${patientName}`,
    `DESCRIPTION:Patient: ${patientName}\\nPhone: ${phone}\\nEmail: ${email}${notes ? `\\nNotes: ${notes}` : ""}`,
    "LOCATION:Precious MD Dermatology Center\\, Ground Floor\\, JGC Building\\, Badelles St\\, Iligan City",
    `ORGANIZER;CN=Precious MD:mailto:preciousmdclinic@gmail.com`,
    `ATTENDEE;CN=${patientName};RSVP=FALSE:mailto:${email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, bookingDate, timeSlot, phone, email, notes } = body;

    if (!process.env.RESEND_API_KEY) {
      console.log("[DEV] Calendar invite simulation for:", patientName, bookingDate, timeSlot);
      return NextResponse.json({ success: true, simulated: true });
    }

    const icsContent = generateICS({ patientName, bookingDate, timeSlot, phone, email, notes });
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Precious MD Clinic <onboarding@resend.dev>",
      to: ["slcpmaya@gmail.com"],
      subject: `📅 New Appointment: ${patientName} — ${bookingDate} ${timeSlot}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333D29; max-width: 520px; border: 1px solid #F2ECE4; border-radius: 12px;">
          <h2 style="color: #C87D87; margin-top: 0;">New Confirmed Appointment</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #706A63;">Patient</td><td style="padding: 6px 0; font-weight: 600;">${patientName}</td></tr>
            <tr><td style="padding: 6px 0; color: #706A63;">Date</td><td style="padding: 6px 0; font-weight: 600;">${bookingDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #706A63;">Time</td><td style="padding: 6px 0; font-weight: 600;">${timeSlot}</td></tr>
            <tr><td style="padding: 6px 0; color: #706A63;">Phone</td><td style="padding: 6px 0;">${phone}</td></tr>
            <tr><td style="padding: 6px 0; color: #706A63;">Email</td><td style="padding: 6px 0;">${email}</td></tr>
            ${notes ? `<tr><td style="padding: 6px 0; color: #706A63;">Notes</td><td style="padding: 6px 0;">${notes}</td></tr>` : ""}
          </table>
          <p style="font-size: 12px; color: #908A84; margin-top: 20px;">
            A calendar invite (.ics) is attached. Open it to add directly to your Google Calendar.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `appointment-${patientName.replace(/\s+/g, "-")}.ics`,
          content: Buffer.from(icsContent, "utf-8"),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Calendar invite error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
