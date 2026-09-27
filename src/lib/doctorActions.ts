"use client";

import { createClient } from "@/lib/supabase/client";

// Create a single shared client instance
const supabase = createClient();

export interface ClinicInfo {
  id?: string;
  mission_statement: string;
  clinic_description: string;
  image_url?: string;
}

export interface DoctorScheduleDay {
  day: string;
  active: boolean;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  title_role: string;
  quote?: string;
  bio?: string;
  image_url?: string;
  credentials: string[];
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

// -------------------------------------------------------------
// Clinic Info Functions
// -------------------------------------------------------------
export async function fetchClinicInfo(): Promise<ClinicInfo | null> {
  const { data, error } = await supabase
    .from("clinic_info")
    .select("id, mission_statement, clinic_description, image_url")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching clinic info:", error.message);
    return null;
  }
  return data;
}

export async function updateClinicInfo(id: string, info: Partial<ClinicInfo>) {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (info.mission_statement !== undefined) payload.mission_statement = info.mission_statement;
  if (info.clinic_description !== undefined) payload.clinic_description = info.clinic_description;
  if (info.image_url !== undefined) payload.image_url = info.image_url;

  const { data, error } = await supabase
    .from("clinic_info")
    .update(payload)
    .eq("id", id)
    .select("id, mission_statement, clinic_description, image_url")
    .single();

  if (error) {
    console.error("Error updating clinic info:", error);
    throw new Error(error.message);
  }
  return data;
}

// -------------------------------------------------------------
// Doctor Management Functions
// -------------------------------------------------------------
export async function fetchDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select("id, name, title_role, quote, bio, image_url, credentials, is_featured, display_order, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching doctors:", error.message);
    return [];
  }

  // Parse credentials safely if returned as JSON string or raw array
  return (data || []).map((doc) => ({
    ...doc,
    credentials: Array.isArray(doc.credentials)
      ? doc.credentials
      : typeof doc.credentials === "string"
        ? JSON.parse(doc.credentials)
        : [],
  }));
}

export async function saveDoctor(doctor: Partial<Doctor>) {
  // Only include fields that exist in the database
  const payload = {
    name: doctor.name,
    title_role: doctor.title_role,
    quote: doctor.quote || "",
    bio: doctor.bio || "",
    image_url: doctor.image_url || "",
    credentials: doctor.credentials || [],
    is_featured: doctor.is_featured ?? false,
    display_order: doctor.display_order ?? 0,
  };

  if (doctor.id) {
    // Update existing doctor
    const { data, error } = await supabase
      .from("doctors")
      .update(payload)
      .eq("id", doctor.id)
      .select("id, name, title_role, quote, bio, image_url, credentials, is_featured, display_order, created_at")
      .single();

    if (error) {
      console.error("Error updating doctor:", error);
      throw new Error(error.message);
    }
    return data;
  } else {
    // Create new doctor
    const { data, error } = await supabase
      .from("doctors")
      .insert([payload])
      .select("id, name, title_role, quote, bio, image_url, credentials, is_featured, display_order, created_at")
      .single();

    if (error) {
      console.error("Error creating doctor:", error);
      throw new Error(error.message);
    }
    return data;
  }
}

export async function deleteDoctor(id: string) {
  const { error } = await supabase.from("doctors").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// -------------------------------------------------------------
// Image Upload Helper
// -------------------------------------------------------------
export async function uploadDoctorImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `doctors/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("doctor-images")
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Upload error details:", uploadError);

    // Provide more helpful error messages
    if (uploadError.message.includes("row-level security") || uploadError.message.includes("RLS")) {
      throw new Error(
        "Storage access denied. Make sure:\n" +
        "1. You're logged in to the admin panel\n" +
        "2. Storage bucket 'doctor-images' has INSERT policy for your role\n" +
        "3. Check Supabase Storage → doctor-images → Policies"
      );
    }

    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("doctor-images").getPublicUrl(filePath);
  return data.publicUrl;
}