import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAccount } from "@/lib/server-auth";
export default async function Page() {
  const account = await requireAccount("business");
  const counts = await Promise.all(
    ["pending", "approved", "rejected"].map((status) =>
      account.db
        .from("stall_applications")
        .select("id", { count: "exact", head: true })
        .eq("business_id", account.user.id)
        .eq("status", status),
    ),
  );
  const error = counts.some((result) => result.error);
  return (
    <DashboardLayout allowedRoles={["business"]}>
      <div className="page-intro">
        <p className="eyebrow">YOUR BUSINESS, OUT THERE</p>
        <h1>Make your next connection.</h1>
        <p>
          Review your real application activity and find an event that fits.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/events" className="action action-primary">
          Find events
        </Link>
        <Link href="/business/applications" className="action action-outline">
          My applications
        </Link>
      </div>
      {error ? (
        <p className="notice" role="alert">
          Your application activity is temporarily unavailable. Please try
          again.
        </p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["Pending review", counts[0].count || 0],
            ["Approved applications", counts[1].count || 0],
            ["Rejected applications", counts[2].count || 0],
          ].map(([label, count]) => (
            <div
              key={label}
              className="border border-border bg-white rounded-lg p-6"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-4xl font-semibold mt-4">{count}</p>
            </div>
          ))}
        </div>
      )}
      <div className="detail-section mt-5">
        <h2>Keep applications and bookings separate</h2>
        <p>
          An approved application is the organizer’s decision on your request.
          It is not a confirmed booking, payment receipt or inventory
          reservation. Online payment processing is not enabled.
        </p>
      </div>
    </DashboardLayout>
  );
}
