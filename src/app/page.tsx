import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Utensils,
  ShoppingBag,
  Briefcase,
  Laptop,
  Palette,
  GraduationCap,
  MapPin,
  Search,
  ClipboardCheck,
  Store,
  Check,
  CalendarDays,
} from "lucide-react";
import { EventFilters } from "@/components/marketplace/EventFilters";
import { EventResults } from "@/components/marketplace/EventResults";
import { categories, cities } from "@/lib/marketplace";
import { BrandLogo } from "@/components/marketplace/BrandLogo";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "VendoraX | Discover events. Find your stall.",
  description:
    "Explore events across Pakistan, discover stall opportunities and connect your business with event organizers.",
};
const icons = [
  Utensils,
  ShoppingBag,
  Briefcase,
  Laptop,
  Palette,
  GraduationCap,
];
export default function HomePage() {
  return (
    <>
      <section className="market-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> MADE FOR PAKISTAN’S EVENT COMMUNITY
          </p>
          <h1>
            Good events.
            <br />
            Great connections.
            <br />
            <em>Your next opportunity.</em>
          </h1>
          <p className="hero-description">
            Discover events. Find your stall. Grow your business.
            <br className="desktop-only" /> A simpler way to bring organizers,
            businesses and people together.
          </p>
          <EventFilters compact />
          <div className="hero-quicklinks">
            <span>Start exploring</span>
            {["Lahore", "Karachi", "Islamabad"].map((city) => (
              <Link key={city} href={`/events?city=${city}`}>
                {city}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85"
            alt="An event venue arranged for a gathering"
            fill
            unoptimized
            priority
            loading="eager"
            sizes="(max-width: 900px) 100vw, 45vw"
          />
          <div className="hero-photo-caption">
            <span>
              <MapPin size={15} /> Discover places. Meet people.
            </span>
            <p>Make room for something new.</p>
          </div>
          <span className="photo-label">A place for your next big idea</span>
        </div>
      </section>
      <section className="trusted-section section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BRANDS THAT SHOW UP</p>
            <h2>Made for the people behind the stalls.</h2>
            <p>
              Local businesses use VendoraX to find the right crowd, venue and
              moment.
            </p>
          </div>
          <Link className="text-link" href="/for-businesses">
            Join as a business <ArrowRight size={17} />
          </Link>
        </div>
        <div className="brand-cloud">
          {[
            ["Nosh & Co", "NS", "#c97756"],
            ["Kite Studio", "KS", "#557c62"],
            ["Dastarkhwan", "DA", "#d28b3e"],
            ["Northstar Labs", "NL", "#4e6eb5"],
            ["Mitti Home", "MH", "#9c6f55"],
            ["The Green Room", "GR", "#3b8060"],
          ].map(([name, initials, accent]) => (
            <div className="brand-cloud-item" key={name}>
              <BrandLogo name={initials} accent={accent} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section-shell stay-section">
        <div className="stay-banner">
          <div>
            <p className="eyebrow">THE STALL EDIT</p>
            <h2>Book a space that feels like your brand.</h2>
            <p>
              From a six-foot maker table to a full pavilion, compare practical
              packages before you apply.
            </p>
          </div>
          <Link className="action action-light" href="/events">
            Browse packages <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <div className="purpose-strip">
        <span>
          <CalendarDays size={19} /> Discover local events
        </span>
        <span>
          <Store size={19} /> Find a stall for your business
        </span>
        <span>
          <ClipboardCheck size={19} /> Manage applications in one place
        </span>
      </div>
      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FOLLOW YOUR INTERESTS</p>
            <h2>There’s a world to explore.</h2>
          </div>
          <Link className="text-link" href="/categories">
            All categories <ArrowRight size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.slice(0, 6).map((category, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={category.slug}
                href={`/events?category=${encodeURIComponent(category.name)}`}
                className={`category-tile category-tone-${i}`}
              >
                <span className="category-icon">
                  <Icon size={24} strokeWidth={1.6} />
                </span>
                <h3>{category.name}</h3>
                <span>
                  Explore events <ArrowUpRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section-shell upcoming-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GET OUT THERE</p>
            <h2>Coming up around you.</h2>
            <p>Discover upcoming events from our organizers.</p>
          </div>
          <Link className="action action-outline" href="/events">
            Explore all events <ArrowRight size={17} />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="empty-state" role="status">
              Finding upcoming events…
            </div>
          }
        >
          <EventResults featured filters={{ limit: 3 }} />
        </Suspense>
      </section>
      <section className="section-shell">
        <div className="city-section">
          <div>
            <p className="eyebrow">A LITTLE CLOSER TO HOME</p>
            <h2>
              Your city.
              <br />
              Your community.
            </h2>
            <p>
              From your neighbourhood’s next pop-up to an exhibition across the
              country.
            </p>
          </div>
          <div className="city-grid">
            {cities.slice(0, 8).map((city, i) => (
              <Link
                href={`/events?city=${encodeURIComponent(city)}`}
                key={city}
              >
                <span className="city-number">0{i + 1}</span>
                <span>{city}</span>
                <ArrowUpRight size={19} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="how-section">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR BUSINESS, OUT IN THE WORLD</p>
              <h2>A better way to find your spot.</h2>
              <p>
                From browsing to applying, keep the important details together.
              </p>
            </div>
            <Link className="text-link" href="/for-businesses">
              For businesses <ArrowRight size={17} />
            </Link>
          </div>
          <div className="steps-grid">
            {[
              {
                icon: Search,
                title: "Find the right event",
                text: "Explore by city, category and date. Look for an audience that fits your business.",
              },
              {
                icon: Store,
                title: "Choose a stall package",
                text: "Read the price, dimensions, facilities and organizer’s requirements.",
              },
              {
                icon: ClipboardCheck,
                title: "Apply with confidence",
                text: "Introduce your business and follow the organizer’s decision in your dashboard.",
              },
            ].map((step, i) => (
              <div className="step" key={step.title}>
                <div className="step-top">
                  <step.icon size={27} strokeWidth={1.5} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-shell">
        <div className="organizer-callout">
          <div>
            <p className="eyebrow">BRING PEOPLE TOGETHER</p>
            <h2>
              You plan the event.
              <br />
              We’ll help you put it out there.
            </h2>
            <p>
              Create your event, explain your stall packages and manage
              applications from interested businesses.
            </p>
            <div className="callout-checks">
              <span>
                <Check size={16} />
                Clear event details
              </span>
              <span>
                <Check size={16} />
                Your stall packages
              </span>
              <span>
                <Check size={16} />
                One application inbox
              </span>
            </div>
          </div>
          <Link className="action action-light" href="/signup?role=organizer">
            Start as an organizer <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section-shell faq-simple">
        <div>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>
            New here?
            <br />
            You’re in the right place.
          </h2>
          <Link className="text-link" href="/help">
            Visit the help centre <ArrowRight size={17} />
          </Link>
        </div>
        <div>
          {[
            {
              q: "Can I browse without an account?",
              a: "Yes. Explore events and read their details without signing up. An account is needed when you want to apply for a stall.",
            },
            {
              q: "How do I apply for a stall?",
              a: "Create a business account, open a published event and review its packages. Submit your introduction for the organizer to review.",
            },
            {
              q: "Does applying confirm my booking?",
              a: "No. An application is a request. Wait for the organizer’s decision and review any required next steps. Online payments are not currently available.",
            },
            {
              q: "Can I list an event outside the major cities?",
              a: "Yes. Organizers can enter their city and venue when creating an event. Listings are reviewed before appearing publicly.",
            },
          ].map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
