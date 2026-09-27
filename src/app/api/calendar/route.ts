export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

// ── GET: Public Surgery Tracker (Read-Only) ───────────────────────────────────
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
    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to fetch calendar events");
    }

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
