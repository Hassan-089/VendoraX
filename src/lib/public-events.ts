import "server-only";
import { createClient } from "@supabase/supabase-js";
import { pakistanToday } from "./marketplace";
import { demoEvents, demoResults } from "./demo-events";
export interface PublicEvent {
  id: string;
  title: string;
  description: string | null;
  city: string;
  venue: string | null;
  start_date: string;
  end_date: string | null;
  expected_visitors: number | null;
  category: string | null;
  image_url: string | null;
  organizer_id: string;
  demo?: boolean;
}
export interface PublicPackage {
  id: string;
  event_id: string;
  name: string;
  price: number;
  size: string;
  perks: string[] | null;
  logo?: string;
  accent?: string;
}
export interface EventFilters {
  q?: string;
  city?: string;
  category?: string;
  date?: string;
  sort?: string;
  page?: string;
  limit?: number;
  organizer?: string;
}
export function publicDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        }),
    },
  });
}
export async function getPublicEvents(filters: EventFilters = {}) {
  const db = publicDatabase();
  const page = Math.min(
    1000,
    Math.max(1, Number.parseInt(filters.page || "1") || 1),
  );
  const size = Math.min(24, Math.max(1, filters.limit || 12));
  if (!db)
    return { events: [] as PublicEvent[], total: 0, page, size, error: true };
  try {
    let query = db
      .from("events")
      .select(
        "id,title,description,city,venue,start_date,end_date,expected_visitors,category,image_url,organizer_id",
        { count: "exact" },
      )
      .eq("status", "approved")
      .gte(
        "end_date",
        filters.date && /^\d{4}-\d{2}-\d{2}$/.test(filters.date)
          ? filters.date
          : pakistanToday(),
      );
    if (filters.city) query = query.eq("city", filters.city.slice(0, 100));
    if (filters.category)
      query = query.eq("category", filters.category.slice(0, 100));
    if (filters.organizer) query = query.eq("organizer_id", filters.organizer);
    const keyword = filters.q
      ?.replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .trim()
      .slice(0, 100);
    if (keyword)
      query = query.or(
        `title.ilike.%${keyword}%,city.ilike.%${keyword}%,category.ilike.%${keyword}%,description.ilike.%${keyword}%`,
      );
    const { data, error, count } = await query
      .order("start_date", { ascending: filters.sort !== "latest" })
      .range((page - 1) * size, page * size - 1);
    if (!error && !data?.length && process.env.VENDORAX_DEMO_DATA === "true") {
      return { ...demoResults(filters), error: false };
    }
    return {
      events: error ? [] : (data as PublicEvent[]) || [],
      total: count || 0,
      page,
      size,
      error: !!error,
    };
  } catch {
    return { events: [] as PublicEvent[], total: 0, page, size, error: true };
  }
}
export async function getPublicEvent(id: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return { event: null, packages: [] as PublicPackage[], error: false };
  const db = publicDatabase();
  if (!db) return { event: null, packages: [] as PublicPackage[], error: true };
  try {
    const { data, error } = await db
      .from("events")
      .select(
        "id,title,description,city,venue,start_date,end_date,expected_visitors,category,image_url,organizer_id",
      )
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();
    if (error || !data) {
      const demo =
        process.env.VENDORAX_DEMO_DATA === "true"
          ? demoEvents.find((item) => item.id === id)
          : null;
      if (demo)
        return {
          event: demo,
          packages: demo.packages,
          error: false,
          packageError: false,
        };
      return { event: null, packages: [] as PublicPackage[], error: !!error };
    }
    const result = await db
      .from("stall_packages")
      .select("id,event_id,name,price,size,perks")
      .eq("event_id", id)
      .order("price");
    return {
      event: data as PublicEvent,
      packages: (result.data as PublicPackage[]) || [],
      error: false,
      packageError: !!result.error,
    };
  } catch {
    return { event: null, packages: [] as PublicPackage[], error: true };
  }
}
