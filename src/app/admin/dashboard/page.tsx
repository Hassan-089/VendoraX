import { requireAccount } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ModerateEvent } from "@/components/events/ModerateEvent";
import { formatEventDate } from "@/lib/marketplace";
export default async function Page() {
  const account = await requireAccount("admin");
  const result = await account.db
    .from("events")
    .select("id,title,description,city,venue,start_date,end_date,category")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="page-intro">
        <p className="eyebrow">PLATFORM REVIEW</p>
        <h1>Event moderation.</h1>
        <p>Review pending submissions before making them public.</p>
      </div>
      {result.error ? (
        <p className="notice" role="alert">
          Event submissions could not be loaded.
        </p>
      ) : !result.data?.length ? (
        <div className="empty-state">
          <h2>No pending events</h2>
          <p>New organizer submissions will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {result.data.map((event) => (
            <article
              key={event.id}
              className="border border-border bg-white rounded-lg p-6"
            >
              <p className="eyebrow">
                {event.category || "EVENT"} · PENDING REVIEW
              </p>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-xs text-muted-foreground mt-3">
                {event.venue}, {event.city} ·{" "}
                {formatEventDate(event.start_date)} –{" "}
                {formatEventDate(event.end_date)}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-7 my-5">
                {event.description}
              </p>
              <ModerateEvent id={event.id} />
            </article>
          ))}
        </div>
      )}
      <p className="notice mt-6">
        Verification reviews, rejection reasons, report management and
        administrative audit logs need the verified database extensions before
        they can be enabled.
      </p>
    </DashboardLayout>
  );
}
