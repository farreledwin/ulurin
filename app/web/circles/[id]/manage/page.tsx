import { notFound } from "next/navigation";
import { WebManageCampaign } from "@/components/web/WebClientPages";
import { getCircle } from "@/lib/circles/seed";

export const metadata = { title: "Kelola campaign · Ulurin Web" };

export default async function WebManageCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circle = getCircle(id);
  if (!circle) notFound();
  return <WebManageCampaign circle={circle} />;
}
