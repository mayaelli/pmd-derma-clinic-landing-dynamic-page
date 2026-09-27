export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { google } from "googleapis";

// SCOPE needed to write events to Google Calendar
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

// ==========================================
// 1. GET: Public Surgery Tracker (Read-Only)
// ==========================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeMin = searchParams.get("timeMin");
  const timeMax = searchParams.get("timeMax");

  const GOOGLE_CALENDAR_ID =
    process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  const API_KEY =
    process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!GOOGLE_CALENDAR_ID || !API_KEY) {
    return NextResponse.json(
      { error: "Google Calendar credentials are not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      GOOGLE_CALENDAR_ID
    )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`;

    const res = await fetch(calendarUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to fetch calendar events from Google");
    }

    const surgeryEvents = (data.items || [])
      .filter((item: any) => (item.summary || "").toUpperCase().includes("[SURGERY]"))
      .map((item: any) => {
        const rawTitle = item.summary || "";
        const cleanTitle = rawTitle.replace(/\[SURGERY\]/i, "").split("-")[0].split("—")[0].trim();

        const start = item.start.dateTime || item.start.date;
        const eventDate = new Date(start);

        const localYear = eventDate.getFullYear();
        const localMonth = String(eventDate.getMonth() + 1).padStart(2, "0");
        const localDay = String(eventDate.getDate()).padStart(2, "0");

        return {
          id: item.id,
          date: `${localYear}-${localMonth}-${localDay}`,
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

// ==========================================
// 2. POST: Silent GCal Push (Admin Approval)
// ==========================================
export async function POST(req: Request) {
  try {
    const { patientName, service, bookingDate, timeSlot, email, phone } = await req.json();

    const calendarId = process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    // Strip surrounding quotes and properly format escaped newlines
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n")
      : undefined;

    if (!clientEmail || !privateKey || !calendarId) {
      return NextResponse.json(
        { error: "Service account credentials or Calendar ID are missing in environment variables." },
        { status: 500 }
      );
    }

    // Modern Google Auth Initialization
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Parse booking slot into ISO format
    const parsedStart = new Date(`${bookingDate} ${timeSlot}`);
    if (isNaN(parsedStart.getTime())) {
      throw new Error(`Invalid Date combination: "${bookingDate} ${timeSlot}"`);
    }

    const startDateTime = parsedStart.toISOString();
    const endDateTime = new Date(parsedStart.getTime() + 60 * 60 * 1000).toISOString();

    const event = {
      summary: `[APPOINTMENT] ${patientName} - ${service || "Consultation"}`,
      description: `Patient: ${patientName}\nPhone: ${phone}\nEmail: ${email}`,
      start: { dateTime: startDateTime, timeZone: "Asia/Manila" },
      end: { dateTime: endDateTime, timeZone: "Asia/Manila" },
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    return NextResponse.json({ success: true, eventId: response.data.id });
  } catch (error: any) {
    console.error("GCal Push Error:", error.message || error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}