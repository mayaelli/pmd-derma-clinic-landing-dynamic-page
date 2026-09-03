// Server component — data is fetched on the server on every request,
// so revalidatePath("/") in server actions immediately reflects changes.
import { getServicesServer } from "@/lib/getServicesServer";
import { getPromosServer } from "@/lib/getPromosServer";
import { getFeedbacksServer } from "@/lib/getFeedbacksServer";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [servicesData, promosData, feedbacksData] = await Promise.all([
    getServicesServer(),
    getPromosServer(),
    getFeedbacksServer(),
  ]);

  return (
    <HomeClient
      servicesData={servicesData}
      promosData={promosData}
      feedbacksData={feedbacksData}
    />
  );
}
