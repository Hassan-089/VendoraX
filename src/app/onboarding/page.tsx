import Link from "next/link";
import { Compass, CalendarPlus, Store } from "lucide-react";
import { requireAccount } from "@/lib/server-auth";
export default async function Page() {
  const account = await requireAccount();
  const options = [
    {
      role: "user",
      icon: Compass,
      title: "Discover events",
      text: "Find experiences and gatherings across Pakistan.",
      href: "/user/dashboard",
    },
    {
      role: "organizer",
      icon: CalendarPlus,
      title: "Organize an event",
      text: "Publish event details, describe stalls and review applications.",
      href: "/organizer/dashboard",
    },
    {
      role: "business",
      icon: Store,
      title: "Promote my business",
      text: "Explore events, compare packages and apply for a stall.",
      href: "/business/dashboard",
    },
  ];
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">WELCOME TO VENDORAX</p>
        <h1>What would you like to do?</h1>
        <p>
          Your account is currently set up as{" "}
          {account.profile.role === "user"
            ? "an event visitor"
            : account.profile.role === "organizer"
              ? "an event organizer"
              : account.profile.role === "business"
                ? "a business owner"
                : "a platform administrator"}
          . Public event discovery is available to everyone.
        </p>
      </div>
      <div className="event-grid">
        {options.map((option) => (
          <article key={option.role} className="category-tile">
            <option.icon className="text-primary mb-5" size={28} />
            <h2 className="text-lg font-semibold">{option.title}</h2>
            <p className="text-sm text-muted-foreground my-4 leading-7">
              {option.text}
            </p>
            {option.role === account.profile.role ? (
              <Link href={option.href} className="action action-primary">
                Continue to dashboard
              </Link>
            ) : option.role === "user" ? (
              <Link href="/events" className="action action-outline">
                Explore events
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground">
                This option needs a {option.role} account. Changing account
                roles is not currently available.
              </p>
            )}
          </article>
        ))}
      </div>
      {account.profile.role === "admin" && (
        <Link href="/admin/dashboard" className="action action-primary mt-6">
          Open administration
        </Link>
      )}
    </div>
  );
}
