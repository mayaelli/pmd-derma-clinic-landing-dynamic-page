// src/lib/getServices.ts
import { createClient } from "@/lib/supabase/client";
import { ServiceItem } from "@/config/clinicConfig";

// Clean, lightweight extended type containing only basic fields
export type ExtendedServiceItem = ServiceItem & {
  description?: string;
  warning?: string;
};

export async function getServices(): Promise<Record<string, ExtendedServiceItem[]>> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*");

    if (error || !data || data.length === 0) {
      if (error) console.error("Error fetching services from Supabase:", error);
      return {};
    }

    const dynamicServices: Record<string, ExtendedServiceItem[]> = {};

    data.forEach((row) => {
      // 1. Standardize category key for matching UI tabs
      const categoryKey = (row.category?.trim() || "General").toLowerCase();

      if (!dynamicServices[categoryKey]) {
        dynamicServices[categoryKey] = [];
      }

      // 2. Map only essential fields
      const item: ExtendedServiceItem = {
        name: row.name || "Untitled Service",
        desc: row.description || row.desc || "",
        description: row.description || row.desc || "",
        image: row.image_url || row.image || undefined,
        warning: row.warning || undefined,
        recovery: row.recovery || undefined,
      };

      dynamicServices[categoryKey].push(item);
    });

    return dynamicServices;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return {};
  }
}