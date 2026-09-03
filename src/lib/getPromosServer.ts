// src/lib/getPromosServer.ts
// Server-side version — uses the server Supabase client so revalidatePath works.
import { createClient } from "@/lib/supabase/server";
import type { PromoCampaign, PromoItem } from "@/lib/getPromos";

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

export async function getPromosServer(): Promise<PromoCampaign[]> {
  const supabase = await createClient();

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
      validity: row.validity || row.discount_tag || "Limited Time",
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
