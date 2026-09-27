// src/lib/reels.ts
// Client-side Reel type definition and browser fetcher
import { createClient } from "@/lib/supabase/client";

export interface Reel {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;       // Local file path or public media URL
  posterImage?: string;    // Cover/thumbnail URL or path
  category?: string;       // e.g. "Skin Care", "Post-Care", "Derm Advice"
  duration?: string;       // e.g. "0:45"
  createdAt?: string;
}

export async function getReels(): Promise<Reel[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("reels")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("Error fetching reels:", error);
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
    console.error("Failed to fetch reels:", err);
    return [];
  }
}
