export const cities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
] as const;
export const categories = [
  {
    name: "Food & Beverage",
    slug: "food",
    description: "Food festivals, tasting events and local favourites.",
    icon: "Utensils",
  },
  {
    name: "Fashion & Lifestyle",
    slug: "fashion",
    description: "Fashion showcases, shopping and seasonal bazaars.",
    icon: "ShoppingBag",
  },
  {
    name: "Business & Corporate",
    slug: "business",
    description: "Trade shows, business expos and professional connections.",
    icon: "Briefcase",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Technology exhibitions, startups and new ideas.",
    icon: "Laptop",
  },
  {
    name: "Arts & Culture",
    slug: "culture",
    description: "Art, handmade crafts and cultural experiences.",
    icon: "Palette",
  },
  {
    name: "Education & Literature",
    slug: "education",
    description: "University events, learning and literary gatherings.",
    icon: "GraduationCap",
  },
  {
    name: "Weddings & Lifestyle",
    slug: "weddings",
    description: "Wedding exhibitions and lifestyle inspiration.",
    icon: "Heart",
  },
  {
    name: "Trade & Industry",
    slug: "industry",
    description: "Agriculture, manufacturing and industrial exhibitions.",
    icon: "Building2",
  },
] as const;
export function formatPKR(value: number | string) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `Rs. ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 }).format(amount)}`
    : "Price not provided";
}
export function formatEventDate(value: string) {
  const date = new Date(
    value.length === 10 ? `${value}T12:00:00+05:00` : value,
  );
  return Number.isNaN(date.getTime())
    ? "Date to be announced"
    : new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
      }).format(date);
}
export function pakistanToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function eventTiming(
  start: string,
  end?: string | null,
  today = pakistanToday(),
) {
  if (!start) return "Dates to be announced";
  if ((end || start).slice(0, 10) < today) return "Completed";
  return start.slice(0, 10) > today ? "Upcoming" : "Ongoing";
}
export function safeExternalUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
