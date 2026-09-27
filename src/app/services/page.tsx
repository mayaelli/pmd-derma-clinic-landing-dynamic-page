import { Suspense } from "react";
import { getServicesServer } from "@/lib/getServicesServer";
import ServicesClient from "@/components/ServicesClient";

export default async function ServicesPage() {
  const { categories } = await getServicesServer();

  return (
    <Suspense fallback={null}>
      <ServicesClient categories={categories} />
    </Suspense>
  );
}
