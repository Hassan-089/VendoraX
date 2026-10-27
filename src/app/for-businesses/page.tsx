import Link from "next/link";
export const metadata = { title: "For businesses & stall owners | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">LET YOUR BUSINESS BE SEEN</p>
        <h1>Find the right place to show up.</h1>
        <p>
          Browse events across Pakistan. Compare stall packages and introduce
          your business to an event organizer.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/events" className="action action-primary">
          Explore events
        </Link>
        <Link href="/signup?role=business" className="action action-outline">
          Create a business account
        </Link>
      </div>
      <div className="info-content">
        <h2>Know the basics before you apply</h2>
        <p>
          Review the event date, venue, stall price, dimensions and included
          facilities. If important requirements are missing, clarify them with
          the organizer before committing.
        </p>
        <h2>One place for your applications</h2>
        <p>
          Submit a business introduction and follow pending, approved and
          rejected applications from My Applications. An approval is not a
          payment receipt or guaranteed inventory reservation.
        </p>
        <h2>Your next connection starts here</h2>
        <p>
          Find food fairs, fashion showcases, trade exhibitions, technology
          events and more. Only real approved listings appear in discovery.
        </p>
      </div>
    </div>
  );
}
