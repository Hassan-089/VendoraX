import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/marketplace";
export const metadata = { title: "Event categories | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">FOLLOW YOUR INTERESTS</p>
        <h1>What brings you out?</h1>
        <p>
          Find a community, a new experience or the right audience for your
          business.
        </p>
      </div>
      <div className="event-grid">
        {categories.map((category) => (
          <Link
            className="category-tile"
            key={category.slug}
            href={`/events?category=${encodeURIComponent(category.name)}`}
          >
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p className="my-4 text-sm text-muted-foreground leading-7">
              {category.description}
            </p>
            <span className="text-link">
              Explore events
              <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
