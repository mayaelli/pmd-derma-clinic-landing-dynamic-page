// src/lib/getReelsServer.ts
// Server-side version with unstable_cache for cross-request caching
import { createClient } from "@supabase/supabase-js";
import type { Reel } from "@/lib/reels";
import { unstable_cache } from "next/cache";

// Module-level raw Supabase client (no cookies needed for public reads)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchReelsData(): Promise<Reel[]> {
  try {
    const { data, error } = await supabase
      .from("reels")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("Error fetching reels (server):", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title || "",
      description: row.description || undefined,
      videoUrl: row.video_url || "",
      posterImage: row.poster_image || undefined,
      category: row.category || undefined,
      duration: row.duration || undefined,
      createdAt: row.created_at || undefined,
    }));
  } catch (err) {
    console.error("Failed to fetch reels (server):", err);
    return [];
  }
}

// Wrap with unstable_cache for 60-second revalidation
export const getReelsServer = unstable_cache(fetchReelsData, ["reels"], {
  revalidate: 60,
  tags: ["reels"],
});
