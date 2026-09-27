import { createClient } from "@supabase/supabase-js";
import { ServiceItem } from "@/config/clinicConfig";
import { unstable_cache } from "next/cache";

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
  /** Extra poster images (slots 2 & 3). */
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

// Create a standalone public Supabase client for caching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchServicesData(): Promise<{
  categories: CategoryData[];
  bentoCards: BentoCardData[];
}> {
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
      if (error) console.error("Error fetching categories server:", error.message || error.code || JSON.stringify(error));
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

        // Build Bento Cards from subcategory
        if (subRow.bento_slot && subRow.bento_slot >= 1 && subRow.bento_slot <= 6) {
          if (!bentoMap[subRow.bento_slot]) {
            bentoMap[subRow.bento_slot] = {
              slot: subRow.bento_slot,
              title: subRow.bento_title || subRow.title,
              category: catRow.name,
              categorySlug: catRow.slug,
              subcategoryId: subRow.id,
              image: subRow.image_url || undefined,
              priceText: parsedServices[0]?.priceText || "",
              service: parsedServices[0] || {} as ExtendedServiceItem,
              href: `/services?category=${catRow.slug}#sub-${subRow.id}`,
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
    console.error("Failed to fetch services server:", error);
    return { categories: [], bentoCards: [] };
  }
}

// Wrap the fetch function with unstable_cache for 60-second revalidation
export const getServicesServer = unstable_cache(
  fetchServicesData,
  ['services'],
  {
    revalidate: 60,
    tags: ['services']
  }
);