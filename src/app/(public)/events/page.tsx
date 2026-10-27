import { Suspense } from "react";
import { EventFilters } from "@/components/marketplace/EventFilters";
import { EventResults } from "@/components/marketplace/EventResults";
import type { EventFilters as Filters } from "@/lib/public-events";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Explore events in Pakistan | VendoraX",
  description:
    "Find upcoming festivals, exhibitions and business events across Pakistan.",
};
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const raw = await searchParams;
  const values: Filters = Object.fromEntries(
    Object.entries(raw).filter(
      ([key, value]) =>
        ["q", "city", "category", "date", "sort", "page"].includes(key) &&
        typeof value === "string",
    ),
  );
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">MAKE YOUR NEXT CONNECTION</p>
        <h1>Find your next event.</h1>
        <p>Discover what’s happening. Find where your business belongs.</p>
      </div>
      <EventFilters values={values} />
      <div className="listing-heading">
        <h2>Events to explore</h2>
        <p>Published events · Pakistan Standard Time</p>
      </div>
      <Suspense
        key={JSON.stringify(values)}
        fallback={
          <div className="empty-state" role="status">
            Finding events…
          </div>
        }
      >
        <EventResults filters={values} />
      </Suspense>
    </div>
  );
}
