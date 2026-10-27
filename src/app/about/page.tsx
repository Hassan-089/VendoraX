import Link from "next/link";
export const metadata = { title: "About VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">MADE FOR CONNECTIONS</p>
        <h1>
          More than a listing.
          <br />A place to come together.
        </h1>
        <p>
          VendoraX connects people discovering events with the organizers
          creating them and the businesses taking part.
        </p>
      </div>
      <div className="info-content">
        <h2>For people with something to discover</h2>
        <p>
          Explore festivals, exhibitions and local gatherings across Pakistan.
          Public event details are available without an account.
        </p>
        <h2>For people with something to share</h2>
        <p>
          Organizers can describe their event and stall packages. Businesses can
          introduce themselves through an application and follow the organizer’s
          decision.
        </p>
        <h2>Clear information comes first</h2>
        <p>
          Only approved listings appear in public discovery. Attendance figures
          are organizer estimates, not guarantees. An application is not a
          confirmed booking or payment.
        </p>
        <Link href="/events" className="action action-primary">
          Find your next event
        </Link>
      </div>
    </div>
  );
}
