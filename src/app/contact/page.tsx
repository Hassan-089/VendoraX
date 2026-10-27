import { safeExternalUrl } from "@/lib/marketplace";
export const metadata = { title: "Contact | VendoraX" };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const valid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const whatsapp = safeExternalUrl(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP);
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">LET’S TALK</p>
        <h1>How can we help?</h1>
        <p>
          Questions about an event? Start with its organizer. For account or
          platform questions, use the support channels below.
        </p>
      </div>
      <div className="info-content">
        <h2>Platform support</h2>
        {valid ? (
          <p>
            <a className="text-link" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
        ) : (
          <p>
            Direct platform support is not available through this site yet.
            Please do not send documents, payment information or passwords
            through an event application to request support.
          </p>
        )}
        {whatsapp && (
          <p>
            <a
              className="action action-outline"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp support
            </a>
          </p>
        )}
        <h2>Event questions</h2>
        <p>
          Check the event page for its location, dates, package information and
          organizer. Contact and verification details are shown only when they
          have been provided and made public.
        </p>
        <h2>Account and privacy requests</h2>
        <p>
          {valid
            ? "Contact platform support from the email address registered to your account. Never send your password."
            : "A support contact must be configured before account deletion, privacy requests and listing reports can be handled through this site."}
        </p>
      </div>
    </div>
  );
}
