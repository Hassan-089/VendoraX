import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EventEditForm } from "@/components/events/EventEditForm";
import type { PublicEvent } from "@/lib/public-events";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await requireAccount("organizer");
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    notFound();
  const result = await account.db
    .from("events")
    .select(
      "id,title,description,city,venue,start_date,end_date,expected_visitors,category,image_url,organizer_id,status",
    )
    .eq("id", id)
    .eq("organizer_id", account.user.id)
    .maybeSingle();
  if (result.error)
    return (
      <DashboardLayout allowedRoles={["organizer"]}>
        <p className="notice">
          This event could not be loaded. Please try again.
        </p>
      </DashboardLayout>
    );
  if (!result.data) notFound();
  return (
    <DashboardLayout allowedRoles={["organizer"]}>
      <div className="page-intro">
        <p className="eyebrow">KEEP THE DETAILS CLEAR</p>
        <h1>Edit event.</h1>
      </div>
      <EventEditForm event={result.data as PublicEvent} />
    </DashboardLayout>
  );
}
