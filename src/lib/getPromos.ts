// src/lib/getPromos.ts
import { createClient } from "@/lib/supabase/client";

export interface PromoItem {
  name: string;
  sessions: string;
  price: string;
  originalPrice?: string;
}

export interface PromoCampaign {
  id: string;
  title: string;
  subtitle?: string;
  validity: string;
  validUntil?: string;
  pubmatImage: string;
  badge: string;
  items: PromoItem[];
}

// Parse the pipe-delimited items string stored in DB back into PromoItem[]
// Format per item: "Name|sessions|price|originalPrice(optional)"
// Items are separated by ";"
function parseItems(raw: string | null): PromoItem[] {
  if (!raw || raw.trim() === "") return [];

  return raw
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const parts = chunk.split("|").map((p) => p.trim());
      return {
        name: parts[0] || "",
        sessions: parts[1] || "1 session",
        price: parts[2] || "",
        originalPrice: parts[3] || undefined,
      };
    })
    .filter((item) => item.name.length > 0);
}

export async function getPromos(): Promise<PromoCampaign[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("promos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("Error fetching promos:", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title || "",
      subtitle: row.subtitle || undefined,
      validity: row.validity || "",
      validUntil: row.valid_until || row.expiry_date || undefined,
      pubmatImage: row.pubmat_image || "/precious-md-promo.jpg",
      badge: row.badge || row.discount_tag || "",
      items: parseItems(row.items),
    }));
  } catch (err) {
    console.error("Failed to fetch promos:", err);
    return [];
  }
}
