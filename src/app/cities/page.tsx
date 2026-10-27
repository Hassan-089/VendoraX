import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cities } from "@/lib/marketplace";
export const metadata = { title: "Events by city | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">ACROSS PAKISTAN</p>
        <h1>Find what’s happening near you.</h1>
        <p>
          Discover published events by city. Your next connection might be
          closer than you think.
        </p>
      </div>
      <div className="city-grid">
        {cities.map((city) => (
          <Link href={`/events?city=${encodeURIComponent(city)}`} key={city}>
            <span>{city}</span>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
    </div>
  );
}
