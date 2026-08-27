// src/lib/getPromos.ts

export interface PromoItem {
  name: string;
  sessions: string;
  price: string;
  originalPrice?: string;
}

export interface PromoCampaign {
  id: string;
  title: string;
  subtitle: string;
  validity: string;
  pubmatImage: string;
  badge: string;
  items: PromoItem[];
}

const GOOGLE_SHEET_PROMOS_CSV_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEET_PROMOS_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdOR1XwBWap_kjH3TgmQCmR2zv_Pq6PWdu20n9-QWTcPL8V-WciFcm62d5Vgksyl9CD7TLZnBL_Fbr/pub?gid=1151382265&single=true&output=csv";

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

export async function getPromos(): Promise<PromoCampaign[]> {
  if (
    !GOOGLE_SHEET_PROMOS_CSV_URL ||
    GOOGLE_SHEET_PROMOS_CSV_URL.includes("YOUR_PUBLISHED")
  ) {
    return [];
  }

  try {
    const res = await fetch(GOOGLE_SHEET_PROMOS_CSV_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return [];
    }

    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

    const promos: PromoCampaign[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVRow(lines[i]);
      if (!cols || cols.length < 2) continue;

      // Extract raw values
      const id = cols[0]?.trim() || `promo-${i}`;
      const title = cols[1]?.trim();
      const subtitle = cols[2]?.trim() || "";
      let validity = cols[3]?.trim() || "Limited Time";
      let pubmatRaw = cols[4]?.trim() || "";
      const badge = cols[5]?.trim() || "Special Offer";
      const itemsRaw = cols[6]?.trim() || "";

      if (!title) continue;

      // Defensive fallback if column shift puts a URL in the validity field
      if (validity.startsWith("http") || validity.startsWith("/")) {
        pubmatRaw = validity;
        validity = "Limited Time";
      }

      // Validate Pubmat URL format
      const validPubmat =
        pubmatRaw && (pubmatRaw.startsWith("http") || pubmatRaw.startsWith("/"))
          ? pubmatRaw
          : "/precious-md-promo.jpg";

      // Parse itemized packages safely
      const parsedItems: PromoItem[] = itemsRaw
        .split(";")
        .map((raw) => raw.trim())
        .filter((raw) => raw.length > 0)
        .map((raw) => {
          const parts = raw.split("|").map((p) => p.trim());
          return {
            name: parts[0] || "Treatment",
            sessions: parts[1] || "1 session",
            price: parts[2] || "",
            originalPrice: parts[3] || undefined,
          };
        });

      promos.push({
        id,
        title,
        subtitle,
        validity,
        pubmatImage: validPubmat,
        badge,
        items: parsedItems,
      });
    }

    return promos;
  } catch (error) {
    console.error("Failed to fetch Google Sheets promos:", error);
    return [];
  }
}