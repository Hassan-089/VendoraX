import Link from "next/link";
import { notFound } from "next/navigation";
import { Store } from "lucide-react";
import { getPublicEvents, publicDatabase } from "@/lib/public-events";
import { EventCard } from "@/components/events/EventCard";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    notFound();
  const result = await getPublicEvents({ organizer: id });
  let name = "Event organizer";
  const db = publicDatabase();
  if (db && !result.error && result.events.length) {
    try {
      const profile = await db
        .from("profiles")
        .select("name")
        .eq("id", id)
        .maybeSingle();
      if (profile.data?.name) name = profile.data.name;
    } catch {}
  }
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">
          <Store size={17} />
          ORGANIZER PROFILE
        </p>
        <h1>{name}</h1>
        <p>
          Explore this organizer’s upcoming, approved events. Verification has
          not been confirmed.
        </p>
      </div>
      {result.error ? (
        <div className="empty-state">
          <h2>Organizer listings are temporarily unavailable</h2>
          <p>Please try again later.</p>
        </div>
      ) : result.events.length ? (
        <div className="event-grid">
          {result.events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              city={event.city}
              venue={event.venue}
              date={event.start_date}
              category={event.category || undefined}
              imageUrl={event.image_url || undefined}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No upcoming public events</h2>
          <p>This organizer has no upcoming approved events listed.</p>
          <Link href="/events" className="action action-outline">
            Explore events
          </Link>
        </div>
      )}
    </div>
  );
}
