"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── SERVICE RECORD TYPE ─────────────────────────────────────────────────────
export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
}

// ─── PROMO PAYLOAD TYPE ──────────────────────────────────────────────────────
export interface AddPromoPayload {
  title: string;
  subtitle?: string;
  badge: string;
  validity: string;
  validUntil?: string | null;
  pubmatImage?: string;
  items: string;
}

// ─── 1. LIST SERVICES ────────────────────────────────────────────────────────
export async function listServices(): Promise<ServiceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, category, description, image_url")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ServiceRecord[];
}

// ─── 2. ADD SERVICE ──────────────────────────────────────────────────────────
export async function addService(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(fileName, file);

    if (uploadError) throw new Error(`Image Upload Error: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(uploadData.path);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("services").insert({
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    image_url: imageUrl,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/manage");
  return { success: true };
}

// ─── 3. UPDATE SERVICE ───────────────────────────────────────────────────────
export async function updateService(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const file = formData.get("image") as File | null;
  let imageUrl: string | null = (formData.get("existingImageUrl") as string) || null;

  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(fileName, file);

    if (uploadError) throw new Error(`Image Upload Error: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(uploadData.path);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("services")
    .update({
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/manage");
  return { success: true };
}

// ─── 4. DELETE SERVICE ───────────────────────────────────────────────────────
export async function deleteService(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/manage");
  revalidatePath("/");
  return { success: true };
}

// ─── 5. ADD PROMO ────────────────────────────────────────────────────────────
export async function addPromo(data: AddPromoPayload) {
  const supabase = await createClient();

  // Safely ensure date is null instead of "" to prevent PostgreSQL syntax errors
  const cleanValidUntil =
    data.validUntil && data.validUntil.trim() !== "" ? data.validUntil.trim() : null;

  const { error } = await supabase.from("promos").insert({
    title: data.title,
    subtitle: data.subtitle || null,
    badge: data.badge,
    validity: data.validity,
    valid_until: cleanValidUntil,
    pubmat_image: data.pubmatImage || null,
    items: data.items,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/manage");
  revalidatePath("/");
  return { success: true };
}

// ─── 6. ADD PATIENT FEEDBACK ─────────────────────────────────────────────────
export async function addFeedback(data: {
  patientName: string;
  treatmentTaken: string;
  rating: number;
  comment: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("patient_feedback").insert({
    patient_name: data.patientName,
    treatment_taken: data.treatmentTaken,
    rating: data.rating,
    comment: data.comment,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/manage");
  return { success: true };
}


// Add these types to src/app/admin/manage/actions.ts

export interface PromoRecord {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string;
  validity: string;
  valid_until: string | null;
  pubmat_image: string | null;
  items: string;
}

// ─── LIST PROMOS ─────────────────────────────────────────────────────────────
export async function listPromos(): Promise<PromoRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PromoRecord[];
}

// ─── UPDATE PROMO ────────────────────────────────────────────────────────────
export async function updatePromo(id: string, data: AddPromoPayload) {
  const supabase = await createClient();

  const cleanValidUntil =
    data.validUntil && data.validUntil.trim() !== "" ? data.validUntil.trim() : null;

  const { error } = await supabase
    .from("promos")
    .update({
      title: data.title,
      subtitle: data.subtitle || null,
      badge: data.badge,
      validity: data.validity,
      valid_until: cleanValidUntil,
      pubmat_image: data.pubmatImage || null,
      items: data.items,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/manage");
  revalidatePath("/");
  return { success: true };
}

// ─── DELETE PROMO ────────────────────────────────────────────────────────────
export async function deletePromo(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("promos")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/manage");
  revalidatePath("/");
  return { success: true };
}

// ─── TOGGLE PROMO EXPIRY ─────────────────────────────────────────────────────
// expire = true  → sets valid_until to yesterday (hides from public)
// expire = false → clears valid_until (makes it active again)
export async function togglePromoExpiry(id: string, expire: boolean) {
  const supabase = await createClient();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const { error } = await supabase
    .from("promos")
    .update({ valid_until: expire ? yesterdayStr : null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/manage");
  revalidatePath("/");
  return { success: true };
}