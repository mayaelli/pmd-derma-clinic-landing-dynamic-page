// src/lib/getFeedbacks.ts

export interface FeedbackItem {
  id: string;
  name: string;
  roleOrService: string;
  comment: string;
  rating: number;
  avatarUrl?: string;
  date?: string;
}

const GOOGLE_SHEET_FEEDBACKS_CSV_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEET_FEEDBACKS_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdOR1XwBWap_kjH3TgmQCmR2zv_Pq6PWdu20n9-QWTcPL8V-WciFcm62d5Vgksyl9CD7TLZnBL_Fbr/pub?gid=118408086&single=true&output=csv";

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (insideQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function getFeedbacks(): Promise<FeedbackItem[]> {
  if (
    !GOOGLE_SHEET_FEEDBACKS_CSV_URL ||
    GOOGLE_SHEET_FEEDBACKS_CSV_URL.includes("YOUR_FEEDBACKS_GID")
  ) {
    return [];
  }

  try {
    const res = await fetch(GOOGLE_SHEET_FEEDBACKS_CSV_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return [];
    }

    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

    const feedbacks: FeedbackItem[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVRow(lines[i]);
      if (!cols || cols.length < 3) continue;

      const id = cols[0]?.trim() || `feedback-${i}`;
      const name = cols[1]?.trim();
      const roleOrService = cols[2]?.trim() || "Verified Patient";
      const comment = cols[3]?.trim() || "";
      const rawRating = parseInt(cols[4]?.trim() || "5", 10);
      const avatarUrl = cols[5]?.trim() || "";
      const date = cols[6]?.trim() || "";

      if (!name || !comment) continue;

      feedbacks.push({
        id,
        name,
        roleOrService,
        comment,
        rating: isNaN(rawRating) ? 5 : Math.min(5, Math.max(1, rawRating)),
        avatarUrl: avatarUrl.startsWith("http") ? avatarUrl : undefined,
        date,
      });
    }

    return feedbacks;
  } catch (error) {
    console.error("Failed to fetch Google Sheets feedbacks:", error);
    return [];
  }
}