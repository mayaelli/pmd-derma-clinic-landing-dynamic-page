import { getServicesServer } from "@/lib/getServicesServer";
import { getPromosServer } from "@/lib/getPromosServer";
import { getReelsServer } from "@/lib/getReelsServer";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const [servicesData, promosData, reelsData] = await Promise.all([
    getServicesServer(),
    getPromosServer(),
    getReelsServer(),
  ]);

  return (
    <HomeClient
      bentoCards={servicesData.bentoCards || []}
      promosData={promosData}
      reelsData={reelsData}
    />
  );
}