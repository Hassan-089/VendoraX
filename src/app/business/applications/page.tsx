import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { requireAccount } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatPKR, formatEventDate } from "@/lib/marketplace";
interface Application {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  event_id: string;
  events: {
    title: string;
    city: string;
    venue: string;
    start_date: string;
  } | null;
  stall_packages: { name: string; price: number; size: string } | null;
}
export default async function Page() {
  const account = await requireAccount("business");
  const result = await account.db
    .from("stall_applications")
    .select(
      "id,status,message,created_at,event_id,events(title,city,venue,start_date),stall_packages(name,price,size)",
    )
    .eq("business_id", account.user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  const apps = (result.data as unknown as Application[]) || [];
  return (
    <DashboardLayout allowedRoles={["business"]}>
      <div className="page-intro">
        <p className="eyebrow">YOUR BUSINESS CONNECTIONS</p>
        <h1>My applications.</h1>
        <p>
          Follow the organizer’s decision. Applications are separate from
          bookings and payments.
        </p>
      </div>
      <Link className="action action-outline mb-8" href="/events">
        Discover more events
      </Link>
      {result.error ? (
        <p className="notice" role="alert">
          Applications are temporarily unavailable. Please reload to try again.
        </p>
      ) : !apps.length ? (
        <div className="empty-state">
          <ClipboardList size={30} />
          <h2>No applications yet</h2>
          <p>Find an event and introduce your business to the organizer.</p>
          <Link className="action action-primary" href="/events">
            Find your first event
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {apps.map((app) => (
            <article
              key={app.id}
              className="rounded-lg border border-border bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{formatEventDate(app.created_at)}</p>
                  <h2 className="text-xl font-semibold">
                    {app.events?.title || "Event no longer available"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {app.events
                      ? [
                          app.events.venue,
                          app.events.city,
                          formatEventDate(app.events.start_date),
                        ]
                          .filter(Boolean)
                          .join(" · ")
                      : ""}
                  </p>
                </div>
                <span className="bg-muted text-primary rounded px-3 py-2 text-xs font-medium">
                  {app.status === "pending"
                    ? "Awaiting review"
                    : app.status === "approved"
                      ? "Application approved"
                      : app.status === "rejected"
                        ? "Not approved"
                        : "Status unavailable"}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-5 border-y border-border py-5 my-5">
                {[
                  ["Package", app.stall_packages?.name || "Not available"],
                  ["Dimensions", app.stall_packages?.size || "Not provided"],
                  [
                    "Package price",
                    app.stall_packages
                      ? formatPKR(app.stall_packages.price)
                      : "Not available",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground mb-2">
                      {label}
                    </p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              {app.message && (
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-7">
                  {app.message}
                </p>
              )}
              {app.status === "approved" && (
                <p className="notice mt-4">
                  Approval does not confirm payment or reserve inventory. Online
                  payments are not enabled. Confirm booking arrangements with
                  the organizer.
                </p>
              )}
              {app.events && (
                <Link
                  className="text-link mt-5"
                  href={`/events/${app.event_id}`}
                >
                  View event details
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
