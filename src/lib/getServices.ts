// src/lib/getServices.ts
import { clinicConfig, ServicesConfig, ServiceItem } from "@/config/clinicConfig";

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1EGctLCAd8zUKB3E0LOYVScIpYdgUQGtBRLuSh3B6Mlo/export?format=csv";

// Regex to properly parse CSV lines with quoted commas
function parseCSVLine(text: string): string[] {
  const regex = /(?:,|\n|^)("(?:(?:"")*|[^"]*)*"|[^,\n\r]*)/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    let val = match[1];
    if (val) {
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
    } else {
      matches.push("");
    }
  }
  return matches;
}

export async function getServices(): Promise<ServicesConfig> {
  if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes("YOUR_PUBLISHED")) {
    return clinicConfig.services;
  }

  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, { next: { revalidate: 3600 } });
    const csvText = await res.text();

    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

    const services: ServicesConfig = {
      medical: [],
      aesthetic: [],
      specialty: [],
    };

    // Header expected: Category(0), Name(1), Description(2), ImageURL(3), Symptoms(4), Includes(5), Recovery(6), Warning(7)
    for (let i = 1; i < lines.length; i++) {
      const columns = parseCSVLine(lines[i]);
      const category = columns[0]?.toLowerCase() as keyof ServicesConfig;

      if (category && services[category]) {
        // Validate ImageURL: must start with http://, https://, or /
        let rawImage = columns[3]?.trim();
        const isValidImage = rawImage && (rawImage.startsWith("http://") || rawImage.startsWith("https://") || rawImage.startsWith("/"));

        const item: ServiceItem = {
          name: columns[1] || "",
          desc: columns[2] || "",
          image: isValidImage ? rawImage : undefined,
          symptoms: columns[4] ? columns[4].split(",").map((s) => s.trim()).filter(Boolean) : undefined,
          includes: columns[5] ? columns[5].split(",").map((s) => s.trim()).filter(Boolean) : undefined,
          recovery: columns[6] || undefined,
          warning: columns[7] || undefined,
        };

        services[category].push(item);
      }
    }

    return services;
  } catch (error) {
    console.error("Failed to fetch Google Sheets services, using fallback:", error);
    return clinicConfig.services;
  }
}