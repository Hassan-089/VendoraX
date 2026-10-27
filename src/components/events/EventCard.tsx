import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin, ImageIcon } from "lucide-react";
import { formatEventDate, safeExternalUrl } from "@/lib/marketplace";
interface EventCardProps {
  id: string;
  title: string;
  city: string;
  date: string;
  visitors?: string;
  imageUrl?: string;
  category?: string;
  venue?: string | null;
  demo?: boolean;
}
export function EventCard({
  id,
  title,
  city,
  date,
  imageUrl,
  category,
  venue,
  demo,
}: EventCardProps) {
  const image = safeExternalUrl(imageUrl);
  return (
    <article className="event-card">
      <Link
        href={`/events/${id}`}
        className="event-image"
        aria-label={`View ${title}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="event-image-empty">
            <ImageIcon size={34} />
            <span>Event poster not provided</span>
          </div>
        )}
        {category && <span className="category-chip">{category}</span>}
        {demo && <span className="demo-chip">Local preview</span>}
      </Link>
      <div className="event-card-body">
        <p className="event-date">
          <CalendarDays size={15} />
          {formatEventDate(date)}
        </p>
        <h3>
          <Link href={`/events/${id}`}>{title}</Link>
        </h3>
        <p className="event-location">
          <MapPin size={16} />
          {venue ? `${venue}, ${city}` : city}
        </p>
        <div className="event-card-bottom">
          <span>Explore this event</span>
          <Link href={`/events/${id}`} aria-label={`Details for ${title}`}>
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
