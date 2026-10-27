import Link from "next/link";
import { requireAccount } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatEventDate, pakistanToday } from "@/lib/marketplace";
export default async function Page() {
  const account = await requireAccount("organizer");
  const result = await account.db
    .from("events")
    .select("id,title,city,start_date,status")
    .eq("organizer_id", account.user.id)
    .order("created_at", { ascending: false })
    .limit(500);
  const events = result.data || [];
  const ids = events.map((event) => event.id);
  const applications = ids.length
    ? await account.db
        .from("stall_applications")
        .select("id", { count: "exact", head: true })
        .in("event_id", ids)
        .eq("status", "pending")
    : null;
  return (
    <DashboardLayout allowedRoles={["organizer"]}>
      <div className="page-intro">
        <p className="eyebrow">MAKE SOMETHING HAPPEN</p>
        <h1>Your organizer workspace.</h1>
        <p>Keep your events and applications in view.</p>
      </div>
      <div className="flex gap-3 flex-wrap mb-8">
        <Link href="/organizer/create-event" className="action action-primary">
          Create an event
        </Link>
        <Link href="/organizer/applications" className="action action-outline">
          Review applications
        </Link>
      </div>
      {result.error ? (
        <p role="alert" className="notice">
          Your event activity is unavailable. Please try again.
        </p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-9">
            {[
              ["Events listed", events.length],
              [
                "Published",
                events.filter((event) => event.status === "approved").length,
              ],
              [
                "Upcoming",
                events.filter(
                  (event) =>
                    event.status === "approved" &&
                    event.start_date >= pakistanToday(),
                ).length,
              ],
              [
                "Awaiting your review",
                applications?.error ? "Unavailable" : applications?.count || 0,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="p-5 bg-white border border-border rounded-lg"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-3xl font-semibold mt-4">{value}</p>
              </div>
            ))}
          </div>
          <div className="listing-heading">
            <h2>Recent events</h2>
            <Link className="text-link" href="/organizer/my-events">
              View all
            </Link>
          </div>
          {!events.length ? (
            <div className="empty-state">
              <h2>Your first event starts with an idea</h2>
              <p>
                Create an event and add the details businesses and visitors
                need.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border border border-border bg-white rounded-lg">
              {events.slice(0, 5).map((event) => (
                <div
                  className="p-5 flex flex-wrap justify-between gap-4"
                  key={event.id}
                >
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      {event.city} · {formatEventDate(event.start_date)} ·{" "}
                      {event.status === "approved"
                        ? "Published"
                        : event.status === "pending"
                          ? "Awaiting platform review"
                          : event.status}
                    </p>
                  </div>
                  <Link
                    className="text-link"
                    href={`/organizer/applications?eventId=${event.id}`}
                  >
                    Applications
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
