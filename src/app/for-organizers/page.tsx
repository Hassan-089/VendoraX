import Link from "next/link";
import { CalendarPlus, Store, ClipboardCheck } from "lucide-react";
export const metadata = { title: "For event organizers | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">FOR THE PEOPLE WHO MAKE IT HAPPEN</p>
        <h1>Bring your event to the right people.</h1>
        <p>
          Give visitors the details they need and businesses a clear way to
          apply for your stalls.
        </p>
      </div>
      <Link href="/signup?role=organizer" className="action action-primary">
        Create an organizer account
      </Link>
      <div className="steps-grid my-14">
        {[
          {
            icon: CalendarPlus,
            title: "Tell your event’s story",
            text: "Add the name, category, city, venue, dates and description. Set an honest attendance estimate.",
          },
          {
            icon: Store,
            title: "Describe each package",
            text: "Set a PKR price, dimensions and included facilities so businesses know what they are applying for.",
          },
          {
            icon: ClipboardCheck,
            title: "Review your applications",
            text: "Manage pending applications and communicate your decision through your dashboard.",
          },
        ].map((item) => (
          <div className="step" key={item.title}>
            <div className="step-top">
              <item.icon />
            </div>
            <h2 className="text-lg font-semibold mb-3">{item.title}</h2>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <p className="notice">
        Events are reviewed before appearing publicly. Online payments and
        inventory reservations are not currently enabled.
      </p>
    </div>
  );
}
