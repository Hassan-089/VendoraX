import { Suspense } from "react";
import { ClipboardList } from "lucide-react";
import { requireAccount } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApplicationDecision } from "@/components/events/ApplicationDecision";
import { formatPKR, formatEventDate } from "@/lib/marketplace";
interface Application {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  events: { title: string } | null;
  stall_packages: { name: string; price: number; size: string } | null;
  profiles: { name: string | null } | null;
}
async function Inbox({ eventId }: { eventId?: string }) {
  const account = await requireAccount("organizer");
  const events = await account.db
    .from("events")
    .select("id,title")
    .eq("organizer_id", account.user.id)
    .order("created_at", { ascending: false });
  if (events.error)
    return (
      <p className="notice" role="alert">
        Your event list is temporarily unavailable.
      </p>
    );
  const ids = (events.data || []).map((event) => event.id as string);
  if (!ids.length)
    return (
      <div className="empty-state">
        <ClipboardList size={30} />
        <h2>Your application inbox starts here</h2>
        <p>Create an event with stall packages to receive applications.</p>
      </div>
    );
  let query = account.db
    .from("stall_applications")
    .select(
      "id,status,message,created_at,events(title),stall_packages(name,price,size),profiles(name)",
    )
    .in("event_id", ids)
    .order("created_at", { ascending: false })
    .limit(100);
  if (eventId) query = query.eq("event_id", eventId);
  const result = await query;
  const applications = (result.data as unknown as Application[]) || [];
  return (
    <>
      <form
        action="/organizer/applications"
        className="flex flex-wrap gap-3 mb-8"
      >
        <label className="sr-only" htmlFor="event-filter">
          Event
        </label>
        <select
          id="event-filter"
          name="eventId"
          defaultValue={eventId || ""}
          className="border border-border rounded px-3 py-2 text-sm max-w-full"
        >
          <option value="">All my events</option>
          {events.data?.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
        <button className="action action-outline">Filter</button>
      </form>
      {result.error ? (
        <p className="notice" role="alert">
          Applications are temporarily unavailable. Please try again.
        </p>
      ) : !applications.length ? (
        <div className="empty-state">
          <ClipboardList size={30} />
          <h2>No applications here yet</h2>
          <p>
            New business applications for your selected events will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((app) => (
            <article
              key={app.id}
              className="border border-border rounded-lg p-6 bg-white"
            >
              <p className="eyebrow">
                {formatEventDate(app.created_at)} · {app.status.toUpperCase()}
              </p>
              <h2 className="text-xl font-semibold">
                {app.profiles?.name || "Business applicant"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {app.events?.title || "Event unavailable"} ·{" "}
                {app.stall_packages?.name || "Package unavailable"}
                {app.stall_packages
                  ? ` · ${formatPKR(app.stall_packages.price)}`
                  : ""}
              </p>
              {app.message && (
                <p className="text-sm whitespace-pre-line leading-7 mt-5 mb-6">
                  {app.message}
                </p>
              )}
              {app.status === "pending" && <ApplicationDecision id={app.id} />}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string }>;
}) {
  const params = await searchParams;
  const eventId =
    typeof params.eventId === "string" ? params.eventId : undefined;
  return (
    <DashboardLayout allowedRoles={["organizer"]}>
      <div className="page-intro">
        <p className="eyebrow">BRING THE RIGHT BUSINESSES TOGETHER</p>
        <h1>Application inbox.</h1>
        <p>Review introductions from businesses interested in your event.</p>
      </div>
      <Suspense fallback={<p role="status">Loading applications…</p>}>
        <Inbox eventId={eventId} />
      </Suspense>
    </DashboardLayout>
  );
}
