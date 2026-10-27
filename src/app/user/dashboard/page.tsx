import Link from "next/link";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EventResults } from "@/components/marketplace/EventResults";
import { requireAccount } from "@/lib/server-auth";
export default async function Page() {
  const account = await requireAccount("user");
  return (
    <DashboardLayout allowedRoles={["user"]}>
      <div className="page-intro">
        <p className="eyebrow">YOUR NEXT EXPERIENCE</p>
        <h1>
          Welcome{account.profile.name ? `, ${account.profile.name}` : ""}.
        </h1>
        <p>Discover upcoming events across Pakistan.</p>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/events" className="action action-primary">
          Explore events
        </Link>
        <Link href="/profile" className="action action-outline">
          Manage profile
        </Link>
      </div>
      <Suspense fallback={<p role="status">Loading events…</p>}>
        <EventResults featured filters={{ limit: 3 }} />
      </Suspense>
      <p className="notice mt-8">
        Saved events and attendee bookings are not available yet. Public
        browsing is always open without an account.
      </p>
    </DashboardLayout>
  );
}
