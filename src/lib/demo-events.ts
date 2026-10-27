import type { EventFilters, PublicEvent, PublicPackage } from "./public-events";

export interface DemoEventRecord extends PublicEvent {
  demo: true;
  packages: (PublicPackage & { logo: string; accent: string })[];
}

const organizerId = "00000000-0000-4000-8000-000000000001";

export const demoEvents: DemoEventRecord[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    title: "Lahore Makers Weekend",
    description:
      "A warm, design-led weekend for independent makers, homegrown food brands and curious shoppers. Browse ceramics, slow fashion, coffee and small-batch treats in one beautiful space.",
    city: "Lahore",
    venue: "Pavilion End Club, Gulberg",
    start_date: "2027-01-16",
    end_date: "2027-01-17",
    expected_visitors: 3200,
    category: "Arts & Culture",
    image_url:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
    organizer_id: organizerId,
    demo: true,
    packages: [
      {
        id: "00000000-0000-4000-8000-000000001101",
        event_id: "00000000-0000-4000-8000-000000000101",
        name: "Makers Table",
        price: 18000,
        size: "6x6 ft",
        perks: ["Table and two chairs", "Event listing", "Power access"],
        logo: "MK",
        accent: "#c97756",
      },
      {
        id: "00000000-0000-4000-8000-000000001102",
        event_id: "00000000-0000-4000-8000-000000000101",
        name: "Feature Pavilion",
        price: 42000,
        size: "10x10 ft",
        perks: ["Premium corner", "Brand spotlight", "Four passes"],
        logo: "FP",
        accent: "#557c62",
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    title: "Karachi Street Food Social",
    description:
      "An open-air evening of Karachi's favourite flavours, new chefs and live music. Bring your appetite and meet the independent food businesses shaping the city.",
    city: "Karachi",
    venue: "Beach View Park, Clifton",
    start_date: "2027-02-06",
    end_date: "2027-02-07",
    expected_visitors: 8500,
    category: "Food & Beverage",
    image_url:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    organizer_id: organizerId,
    demo: true,
    packages: [
      {
        id: "00000000-0000-4000-8000-000000001201",
        event_id: "00000000-0000-4000-8000-000000000102",
        name: "Food Stall",
        price: 35000,
        size: "10x10 ft",
        perks: ["Serving counter", "Two lights", "Waste collection"],
        logo: "FS",
        accent: "#d28b3e",
      },
      {
        id: "00000000-0000-4000-8000-000000001202",
        event_id: "00000000-0000-4000-8000-000000000102",
        name: "Chef's Pavilion",
        price: 78000,
        size: "15x15 ft",
        perks: ["Front-row placement", "Back-of-house prep", "Social feature"],
        logo: "CP",
        accent: "#b9554e",
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    title: "Islamabad Future & Design Expo",
    description:
      "A forward-looking showcase for startups, climate ideas, architecture and products made for a better everyday life in Pakistan.",
    city: "Islamabad",
    venue: "Pak-China Friendship Centre",
    start_date: "2027-03-12",
    end_date: "2027-03-14",
    expected_visitors: 6200,
    category: "Technology",
    image_url:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    organizer_id: organizerId,
    demo: true,
    packages: [
      {
        id: "00000000-0000-4000-8000-000000001301",
        event_id: "00000000-0000-4000-8000-000000000103",
        name: "Startup Pod",
        price: 28000,
        size: "8x8 ft",
        perks: ["Power and Wi-Fi", "Demo counter", "Founder directory"],
        logo: "SP",
        accent: "#4e6eb5",
      },
      {
        id: "00000000-0000-4000-8000-000000001302",
        event_id: "00000000-0000-4000-8000-000000000103",
        name: "Innovation Lounge",
        price: 110000,
        size: "20x20 ft",
        perks: ["Talk slot", "Branded lounge", "Press introduction"],
        logo: "IL",
        accent: "#725ba8",
      },
    ],
  },
];

export function demoResults(filters: EventFilters = {}) {
  const keyword = filters.q?.toLowerCase().trim();
  const events = demoEvents.filter((event) => {
    if (filters.city && event.city !== filters.city) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.organizer && event.organizer_id !== filters.organizer)
      return false;
    if (filters.date && event.end_date && event.end_date < filters.date)
      return false;
    if (
      keyword &&
      ![event.title, event.city, event.category, event.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    )
      return false;
    return true;
  });
  if (filters.sort === "latest") events.reverse();
  const page = Math.max(1, Number.parseInt(filters.page || "1") || 1);
  const size = Math.min(24, Math.max(1, filters.limit || 12));
  return {
    events: events.slice((page - 1) * size, page * size),
    total: events.length,
    page,
    size,
  };
}
