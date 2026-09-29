export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

// ── GET: Read surgery events for the booking modal calendar display ───────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeMin = searchParams.get("timeMin");
  const timeMax = searchParams.get("timeMax");

  const GOOGLE_CALENDAR_ID =
    process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  const API_KEY =
    process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!GOOGLE_CALENDAR_ID || !API_KEY) {
    return NextResponse.json({ events: [] });
  }

  try {
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      GOOGLE_CALENDAR_ID
    )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`;

    const res = await fetch(calendarUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Failed to fetch calendar events");

    const surgeryEvents = (data.items || [])
      .filter((item: any) => (item.summary || "").toUpperCase().includes("[SURGERY]"))
      .map((item: any) => {
        const rawTitle = item.summary || "";
        const cleanTitle = rawTitle
          .replace(/\[SURGERY\]/i, "")
          .split("-")[0]
          .split("—")[0]
          .trim();

        const start = item.start.dateTime || item.start.date;
        const eventDate = new Date(start);

        return {
          id: item.id,
          date: `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`,
          title: cleanTitle || "Major Surgical Procedure",
          time: item.start.dateTime
            ? eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Scheduled Today",
          type: "surgery",
        };
      });

    return NextResponse.json({ events: surgeryEvents });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST: Push confirmed appointment to Google Calendar ───────────────────────
export async function POST(req: Request) {
  try {
    const { patientName, service, bookingDate, timeSlot, email, phone } = await req.json();

    const calendarId =
      process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n")
      : undefined;

    if (!clientEmail || !privateKey || !calendarId) {
      console.warn("Google Calendar write credentials missing — skipping calendar push");
      return NextResponse.json({ success: false, reason: "credentials_missing" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    const parsedStart = new Date(`${bookingDate} ${timeSlot}`);
    if (isNaN(parsedStart.getTime())) {
      throw new Error(`Invalid date/time: "${bookingDate} ${timeSlot}"`);
    }

    const event = {
      summary: `[APPOINTMENT] ${patientName} - ${service || "Consultation"}`,
      description: `Patient: ${patientName}\nPhone: ${phone}\nEmail: ${email}`,
      start: { dateTime: parsedStart.toISOString(), timeZone: "Asia/Manila" },
      end: { dateTime: new Date(parsedStart.getTime() + 60 * 60 * 1000).toISOString(), timeZone: "Asia/Manila" },
    };

    const response = await calendar.events.insert({ calendarId, requestBody: event });
    return NextResponse.json({ success: true, eventId: response.data.id });
  } catch (error: any) {
    console.error("GCal Push Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
