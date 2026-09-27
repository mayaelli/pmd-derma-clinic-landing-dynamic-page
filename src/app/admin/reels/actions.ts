"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { unstable_cache } from "next/cache";

// ─── RAW PUBLIC CLIENT (for cacheable list queries) ──────────────────────────
const publicSupabase = createPublicClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface ReelRecord {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  poster_image: string | null;
  category: string | null;
  duration: string | null;
  active: boolean;
  created_at: string;
}

export interface AddReelPayload {
  title: string;
  description?: string;
  videoUrl: string;
  posterImage?: string;
  category?: string;
  duration?: string;
}

// ─── LIST REELS (admin, cached 30 s) ─────────────────────────────────────────
async function fetchReelsFromDB(): Promise<ReelRecord[]> {
  const { data, error } = await publicSupabase
    .from("reels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ReelRecord[];
}

export const listReels = unstable_cache(fetchReelsFromDB, ["admin-reels"], {
  tags: ["reels", "admin-reels"],
  revalidate: 30,
});

// ─── UPLOAD REEL VIDEO ────────────────────────────────────────────────────────
export async function uploadReelVideo(formData: FormData): Promise<string> {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `reels/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("reels-videos")
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) throw new Error(`Video upload error: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage
    .from("reels-videos")
    .getPublicUrl(uploadData.path);

  return publicUrlData.publicUrl;
}

// ─── UPLOAD REEL POSTER ───────────────────────────────────────────────────────
export async function uploadReelPoster(formData: FormData): Promise<string> {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `reels/posters/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("reels-videos")
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) throw new Error(`Poster upload error: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage
    .from("reels-videos")
    .getPublicUrl(uploadData.path);

  return publicUrlData.publicUrl;
}

// ─── ADD REEL ─────────────────────────────────────────────────────────────────
export async function addReel(data: AddReelPayload) {
  const supabase = await createClient();

  const { error } = await supabase.from("reels").insert({
    title: data.title,
    description: data.description || null,
    video_url: data.videoUrl,
    poster_image: data.posterImage || null,
    category: data.category || null,
    duration: data.duration || null,
    active: true,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/reels");
  revalidatePath("/");
  updateTag("reels");
  updateTag("admin-reels");
  return { success: true };
}

// ─── UPDATE REEL ──────────────────────────────────────────────────────────────
export async function updateReel(id: string, data: AddReelPayload) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reels")
    .update({
      title: data.title,
      description: data.description || null,
      video_url: data.videoUrl,
      poster_image: data.posterImage || null,
      category: data.category || null,
      duration: data.duration || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/reels");
  revalidatePath("/");
  updateTag("reels");
  updateTag("admin-reels");
  return { success: true };
}

// ─── DELETE REEL ──────────────────────────────────────────────────────────────
export async function deleteReel(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("reels").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/reels");
  revalidatePath("/");
  updateTag("reels");
  updateTag("admin-reels");
  return { success: true };
}

// ─── TOGGLE REEL ACTIVE ───────────────────────────────────────────────────────
export async function toggleReelActive(id: string, active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reels")
    .update({ active })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/reels");
  revalidatePath("/");
  updateTag("reels");
  updateTag("admin-reels");
  return { success: true };
}
