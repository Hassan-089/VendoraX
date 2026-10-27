import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { categories, cities } from "@/lib/marketplace";
import type { EventFilters as Filters } from "@/lib/public-events";
export function EventFilters({
  values = {},
  compact = false,
}: {
  values?: Filters;
  compact?: boolean;
}) {
  return (
    <form
      action="/events"
      method="get"
      className={compact ? "search-panel" : "filter-panel"}
    >
      <div className="search-field">
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="event-search">
          Search events
        </label>
        <input
          id="event-search"
          name="q"
          defaultValue={values.q}
          placeholder="Event, keyword or category"
          maxLength={100}
        />
      </div>
      <label className="select-field">
        <span className="sr-only">City</span>
        <select name="city" defaultValue={values.city || ""}>
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      {!compact && (
        <>
          <label className="select-field">
            <span className="sr-only">Category</span>
            <select name="category" defaultValue={values.category || ""}>
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
              {values.category &&
                !categories.some((c) => c.name === values.category) && (
                  <option>{values.category}</option>
                )}
            </select>
          </label>
          <label className="select-field date-field">
            <span>On or after</span>
            <input
              aria-label="On or after date"
              type="date"
              name="date"
              defaultValue={values.date}
            />
          </label>
          <label className="select-field">
            <span className="sr-only">Sort events</span>
            <select name="sort" defaultValue={values.sort || "soonest"}>
              <option value="soonest">Soonest first</option>
              <option value="latest">Latest date first</option>
            </select>
          </label>
        </>
      )}
      <button className="action action-primary" type="submit">
        {compact ? <Search size={18} /> : <SlidersHorizontal size={17} />}{" "}
        {compact ? "Find events" : "Apply filters"}
      </button>
      {!compact && (
        <Link className="filter-reset" href="/events">
          Reset
        </Link>
      )}
    </form>
  );
}
