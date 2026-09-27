// src/lib/getPromosServer.ts
// Server-side version with unstable_cache for cross-request caching
import { createClient } from "@supabase/supabase-js";
import type { PromoCampaign, PromoItem } from "@/lib/getPromos";
import { unstable_cache } from "next/cache";

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

// Create a standalone public Supabase client for caching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchPromosData(): Promise<PromoCampaign[]> {
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
    console.error("Failed to fetch promos (server):", err);
    return [];
  }
}

// Wrap the fetch function with unstable_cache for 60-second revalidation
export const getPromosServer = unstable_cache(
  fetchPromosData,
  ['promos'],
  {
    revalidate: 60,
    tags: ['promos']
  }
);
