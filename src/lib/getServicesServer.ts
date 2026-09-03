// src/lib/getServicesServer.ts
// Server-side version of getServices — uses the server Supabase client
// so that revalidatePath() in server actions actually invalidates this data.
import { createClient } from "@/lib/supabase/server";
import { ServiceItem } from "@/config/clinicConfig";

export type ExtendedServiceItem = ServiceItem & {
  description?: string;
  warning?: string;
};

export async function getServicesServer(): Promise<Record<string, ExtendedServiceItem[]>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("Error fetching services from Supabase:", error);
      return {};
    }

    const result: Record<string, ExtendedServiceItem[]> = {};

    data.forEach((row) => {
      const categoryKey = (row.category?.trim() || "general").toLowerCase();
      if (!result[categoryKey]) result[categoryKey] = [];

      result[categoryKey].push({
        name: row.name || "Untitled Service",
        desc: row.description || row.desc || "",
        description: row.description || row.desc || "",
        image: row.image_url || row.image || undefined,
        warning: row.warning || undefined,
        recovery: row.recovery || undefined,
      });
    });

    return result;
  } catch (err) {
    console.error("Failed to fetch services (server):", err);
    return {};
  }
}
