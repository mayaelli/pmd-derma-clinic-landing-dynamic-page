// src/lib/getFeedbacksServer.ts
// Server-side version of getFeedbacks — uses the server Supabase client.
import { createClient } from "@/lib/supabase/server";
import { FeedbackItem } from "@/lib/getFeedbacks";

export async function getFeedbacksServer(): Promise<FeedbackItem[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("patient_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.error("Error fetching feedbacks from Supabase:", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      name: row.patient_name || "Anonymous",
      roleOrService: row.treatment_taken || "Verified Patient",
      comment: row.comment || "",
      rating: typeof row.rating === "number" ? Math.min(5, Math.max(1, row.rating)) : 5,
      date: row.created_at
        ? new Date(row.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        : undefined,
    }));
  } catch (err) {
    console.error("Failed to fetch feedbacks (server):", err);
    return [];
  }
}
