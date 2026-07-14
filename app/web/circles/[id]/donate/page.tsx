import { notFound } from "next/navigation";
import { WebDonate } from "@/components/web/WebClientPages";
import { getCircle } from "@/lib/circles/seed";

export const metadata = { title: "Donasi · Ulurin Web" };

export default async function WebDonatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circle = getCircle(id);
  if (!circle) notFound();
  return <WebDonate circle={circle} />;
}
