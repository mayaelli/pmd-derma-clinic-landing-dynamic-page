import { createClient } from "@/lib/supabase/client";
import { ServiceItem } from "@/config/clinicConfig";

export type ExtendedServiceItem = Omit<ServiceItem, "desc"> & {
  id?: string;
  desc?: string;
  description?: string;
  priceText?: string;
  note?: string | null;
  bentoSlot?: number | null;
  bentoTitle?: string | null;
  active?: boolean;
  /** Extra poster images (slots 2 & 3) from the parent subcategory. */
  imageUrls?: string[];
};

export type SubcategoryData = {
  id: string;
  title: string;
  description?: string | null;
  badgeText?: string | null;
  imageUrl?: string | null;
  /** Extra poster images (slots 2 & 3). Falls back gracefully when empty. */
  imageUrls?: string[];
  services: ExtendedServiceItem[];
};

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  subcategories: SubcategoryData[];
};

export type BentoCardData = {
  slot: number;
  title: string;
  category: string;
  categorySlug: string;
  subcategoryId: string;
  image?: string;
  priceText?: string;
  service: ExtendedServiceItem;
  href: string;
};

export async function getServices(): Promise<{
  categories: CategoryData[];
  bentoCards: BentoCardData[];
}> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        slug,
        subcategories (
          id,
          title,
          description,
          badge_text,
          image_url,
          image_urls,
          bento_slot,
          bento_title,
          services (
            id,
            name,
            price_text,
            note,
            active
          )
        )
      `)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("Error fetching services from Supabase:", error);
      return { categories: [], bentoCards: [] };
    }

    const categories: CategoryData[] = [];
    const bentoMap: Record<number, BentoCardData> = {};

    data.forEach((catRow) => {
      const parsedSubcategories: SubcategoryData[] = [];

      catRow.subcategories?.forEach((subRow: any) => {
        const parsedServices: ExtendedServiceItem[] = [];

        subRow.services?.forEach((svcRow: any) => {
          if (!svcRow.active) return;

          const item: ExtendedServiceItem = {
            id: svcRow.id,
            name: svcRow.name || "Untitled Service",
            desc: subRow.description || "",
            description: subRow.description || "",
            priceText: svcRow.price_text || "",
            note: svcRow.note || null,
            active: svcRow.active ?? true,
            image: subRow.image_url || undefined,
            imageUrls: Array.isArray(subRow.image_urls) ? subRow.image_urls : [],
          };

          parsedServices.push(item);
        });

        // Build Bento Cards from subcategory level (not individual services)
        if (subRow.bento_slot && subRow.bento_slot >= 1 && subRow.bento_slot <= 6) {
          if (!bentoMap[subRow.bento_slot]) {
            const firstService = parsedServices[0];
            bentoMap[subRow.bento_slot] = {
              slot: subRow.bento_slot,
              title: subRow.bento_title || subRow.title,
              category: catRow.name,
              categorySlug: catRow.slug,
              subcategoryId: subRow.id,
              image: subRow.image_url || undefined,
              priceText: firstService?.priceText || "",
              service: firstService || ({} as ExtendedServiceItem),
              href: `/services?cat=${catRow.slug}#sub-${subRow.id}`,
            };
          }
        }

        parsedSubcategories.push({
          id: subRow.id,
          title: subRow.title,
          description: subRow.description,
          badgeText: subRow.badge_text,
          imageUrl: subRow.image_url,
          imageUrls: Array.isArray(subRow.image_urls) ? subRow.image_urls : [],
          services: parsedServices,
        });
      });

      categories.push({
        id: catRow.id,
        name: catRow.name,
        slug: catRow.slug,
        subcategories: parsedSubcategories,
      });
    });

    const bentoCards = Object.values(bentoMap).sort((a, b) => a.slot - b.slot);

    return { categories, bentoCards };
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return { categories: [], bentoCards: [] };
  }
}