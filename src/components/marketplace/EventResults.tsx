import Link from "next/link";
import {
  CalendarSearch,
  WifiOff,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { getPublicEvents, type EventFilters } from "@/lib/public-events";
export async function EventResults({
  filters = {},
  featured = false,
}: {
  filters?: EventFilters;
  featured?: boolean;
}) {
  const result = await getPublicEvents(filters);
  if (result.error)
    return (
      <div className="empty-state">
        <WifiOff size={30} />
        <h3>We couldn’t load the events</h3>
        <p>
          Event listings are temporarily unavailable. Please try again shortly.
        </p>
        <Link className="action action-outline" href="/events">
          Try again <ArrowRight size={16} />
        </Link>
      </div>
    );
  if (!result.events.length)
    return (
      <div className="empty-state">
        <CalendarSearch size={32} />
        <h3>
          {featured
            ? "The next great event is on its way"
            : "No events match these filters"}
        </h3>
        <p>
          {featured
            ? "Upcoming, approved events will appear here when organizers publish them."
            : "Try another city, category or date. Only upcoming and ongoing approved events appear here."}
        </p>
        <Link
          className="action action-outline"
          href={featured ? "/signup?role=organizer" : "/events"}
        >
          {featured ? "List your event" : "Clear filters"}
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  const pages = Math.ceil(result.total / result.size);
  function pageUrl(page: number) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "string" && value && key !== "page")
        params.set(key, value);
    });
    params.set("page", String(page));
    return `/events?${params}`;
  }
  return (
    <>
      <div className={featured ? "event-grid featured-grid" : "event-grid"}>
        {result.events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            city={event.city}
            date={event.start_date}
            venue={event.venue}
            category={event.category || undefined}
            imageUrl={event.image_url || undefined}
            demo={event.demo}
          />
        ))}
      </div>
      {!featured && (
        <div className="results-pagination">
          <span>
            {result.total} {result.total === 1 ? "event" : "events"} · Page{" "}
            {result.page} of {pages}
          </span>
          <div>
            {result.page > 1 && (
              <Link href={pageUrl(result.page - 1)}>
                <ChevronLeft size={16} />
                Previous
              </Link>
            )}
            {result.page < pages && (
              <Link href={pageUrl(result.page + 1)}>
                Next
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
