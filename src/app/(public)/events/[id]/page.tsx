import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowUpRight,
  ArrowLeft,
  Store,
} from "lucide-react";
import { getPublicEvent } from "@/lib/public-events";
import {
  formatEventDate,
  eventTiming,
  safeExternalUrl,
} from "@/lib/marketplace";
import { ApplicationPackages } from "@/components/events/ApplicationPackages";
import { ShareEvent } from "@/components/marketplace/ShareEvent";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPublicEvent(id);
  if (result.error)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h1>Event details are temporarily unavailable</h1>
          <p>
            We couldn’t connect to the event listings. Please try again shortly.
          </p>
          <Link href={`/events/${id}`} className="action action-outline">
            Try again
          </Link>
        </div>
      </div>
    );
  if (!result.event) notFound();
  const event = result.event;
  const status = eventTiming(event.start_date, event.end_date);
  const image = safeExternalUrl(event.image_url);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([event.venue, event.city, "Pakistan"].filter(Boolean).join(", "))}`;
  return (
    <div className="page-shell">
      <Link className="text-link mb-8" href="/events">
        <ArrowLeft size={16} />
        Back to events
      </Link>
      <div className="page-intro">
        <p className="eyebrow">
          {event.category || "EVENT"} · {status.toUpperCase()}
        </p>
        <h1>{event.title}</h1>
        <p>
          {event.venue ? `${event.venue}, ` : ""}
          {event.city}
        </p>
      </div>
      <div className="detail-grid">
        <div>
          {image && (
            <div className="detail-poster">
              <Image
                src={image}
                alt={`${event.title} event poster`}
                fill
                unoptimized
                sizes="(max-width:800px) 100vw, 65vw"
                priority
              />
            </div>
          )}
          <section className="detail-section">
            <h2>About the event</h2>
            <p className="whitespace-pre-line">
              {event.description ||
                "The organizer has not provided a description."}
            </p>
          </section>
          <section className="detail-section" id="stall-packages">
            <h2>Find your stall package</h2>
            <p className="mb-6">
              Review the package, price and included facilities before you
              apply.
            </p>
            {result.packageError ? (
              <p className="notice">
                Stall package details are unavailable. Please try again later.
              </p>
            ) : result.packages.length ? (
              <ApplicationPackages
                packages={result.packages}
                eventId={event.id}
                closed={status === "Completed"}
                demo={event.demo}
              />
            ) : (
              <p className="notice">
                No stall packages have been published for this event.
              </p>
            )}
          </section>
        </div>
        <aside className="detail-panel">
          <h2 className="font-semibold text-lg">The details that matter</h2>
          <div className="detail-fact">
            <CalendarDays size={20} />
            <div>
              <strong>{formatEventDate(event.start_date)}</strong>
              {event.end_date && event.end_date !== event.start_date && (
                <p>Until {formatEventDate(event.end_date)}</p>
              )}
              <p>{status} · Pakistan Standard Time</p>
            </div>
          </div>
          <div className="detail-fact">
            <MapPin size={20} />
            <div>
              <strong>{event.venue || "Venue not provided"}</strong>
              <p>{event.city}, Pakistan</p>
              <a
                className="text-link mt-3"
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open directions
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          {event.expected_visitors !== null && (
            <div className="detail-fact">
              <Users size={20} />
              <div>
                <strong>
                  {event.expected_visitors.toLocaleString("en-PK")} expected
                  attendees
                </strong>
                <p>Organizer estimate, not guaranteed</p>
              </div>
            </div>
          )}
          <div className="detail-fact">
            <Store size={20} />
            <div>
              <strong>The event organizer</strong>
              <Link
                className="text-link mt-2"
                href={`/organizers/${event.organizer_id}`}
              >
                View organizer
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <ShareEvent title={event.title} />
          </div>
          <p className="text-xs text-muted-foreground leading-6 mt-5">
            Confirm event requirements before travelling or making a booking.
            Online attendee tickets and payments are not available.
          </p>
        </aside>
      </div>
    </div>
  );
}
