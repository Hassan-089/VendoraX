import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAccount } from "@/lib/server-auth";
import { formatEventDate } from "@/lib/marketplace";
export default async function Page() {
  const account = await requireAccount("organizer");
  const result = await account.db
    .from("events")
    .select("id,title,city,start_date,status,category")
    .eq("organizer_id", account.user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <DashboardLayout allowedRoles={["organizer"]}>
      <div className="page-intro">
        <p className="eyebrow">YOUR EVENTS, IN ONE PLACE</p>
        <h1>My events.</h1>
        <p>Manage the details and review applications for your events.</p>
      </div>
      <Link
        href="/organizer/create-event"
        className="action action-primary mb-8"
      >
        <CalendarPlus size={17} />
        Create an event
      </Link>
      {result.error ? (
        <p role="alert" className="notice">
          Your events are temporarily unavailable.
        </p>
      ) : !result.data?.length ? (
        <div className="empty-state">
          <CalendarPlus size={30} />
          <h2>Let’s bring your first event to life</h2>
          <p>
            Add your details and stall packages to submit an event for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {result.data.map((event) => (
            <article
              key={event.id}
              className="bg-white border border-border rounded-lg p-6"
            >
              <p className="eyebrow">
                {event.category || "EVENT"} ·{" "}
                {event.status === "approved"
                  ? "PUBLISHED"
                  : event.status === "pending"
                    ? "AWAITING REVIEW"
                    : event.status.toUpperCase()}
              </p>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {event.city} · {formatEventDate(event.start_date)}
              </p>
              <div className="flex flex-wrap gap-4 mt-5">
                {event.status === "approved" && (
                  <Link className="text-link" href={`/events/${event.id}`}>
                    View public event
                  </Link>
                )}
                <Link
                  className="text-link"
                  href={`/organizer/my-events/${event.id}/edit`}
                >
                  Edit details
                </Link>
                <Link
                  className="text-link"
                  href={`/organizer/applications?eventId=${event.id}`}
                >
                  Review applications
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
