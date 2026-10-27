export const metadata = { title: "Help & FAQs | VendoraX" };
const groups = [
  {
    title: "Discovering events",
    items: [
      [
        "Do I need an account to browse?",
        "No. Explore published events by city, category, keyword and date without signing in.",
      ],
      [
        "Are attendance numbers guaranteed?",
        "No. Any expected attendance is an estimate supplied by the event organizer.",
      ],
      [
        "Where can I check directions?",
        "Open an event and choose directions. Confirm the venue and date with the organizer before travelling.",
      ],
    ],
  },
  {
    title: "Applying for a stall",
    items: [
      [
        "How do I apply?",
        "Create a business account. Review a published event’s stall packages, sign in and submit your business introduction.",
      ],
      [
        "Does approval mean I have paid?",
        "No. Application review and payment are separate. Online payments are not currently available on VendoraX. Never treat a button click as a successful payment.",
      ],
      [
        "Where can I track my application?",
        "Your business dashboard links to My Applications, where you can see pending, approved and rejected applications.",
      ],
      [
        "Is stall availability guaranteed?",
        "No. Review the package details and confirm booking arrangements with the organizer. Inventory reservation is not yet enabled.",
      ],
    ],
  },
  {
    title: "Organizing an event",
    items: [
      [
        "How do I publish an event?",
        "Register as an organizer, open Create Event, enter your event details and add stall packages. The event is submitted for review before public listing.",
      ],
      [
        "Can I create more than one package?",
        "Yes. Use Add Another Package to describe each package’s price, dimensions and facilities.",
      ],
      [
        "Can I take payments on VendoraX?",
        "Online payment collection is not currently enabled. Do not request or share bank card details through an application.",
      ],
    ],
  },
];
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">WE’LL HELP YOU FIND YOUR WAY</p>
        <h1>A little clarity goes a long way.</h1>
        <p>Practical answers for visitors, organizers and businesses.</p>
      </div>
      <div className="info-content help-faq">
        {groups.map((group) => (
          <section key={group.title}>
            <h2>{group.title}</h2>
            {group.items.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
