export const metadata = { title: "Privacy | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">YOUR INFORMATION</p>
        <h1>Privacy, in plain language.</h1>
        <p>
          Last updated 20 October 2026. This page describes the integrations
          currently present in the application.
        </p>
      </div>
      <div className="info-content">
        <h2>Account information</h2>
        <p>
          The app uses Supabase for authentication and database storage.
          Registration collects your name, email address, account role and
          password through the authentication provider.
        </p>
        <h2>Events and applications</h2>
        <p>
          Event information is intended for public discovery after approval.
          Business introductions and application records are intended for the
          applicant and the relevant organizer. Do not include unnecessary
          sensitive personal information in application notes.
        </p>
        <h2>AI assistance</h2>
        <p>
          Messages sent to the support assistant and event details submitted to
          the description generator may be sent to Google’s Gemini service. Do
          not include passwords, payment information, identity documents or
          confidential business information in AI prompts.
        </p>
        <h2>Media and hosting</h2>
        <p>
          The website is hosted on Vercel. Some images are served from external
          image providers; requesting these resources can share normal
          connection information with those providers.
        </p>
        <h2>Cookies and account sessions</h2>
        <p>
          Session cookies are used to maintain sign-in. See Cookie Information
          for more detail. Signing out ends the current application session.
        </p>
        <h2>Requests about your information</h2>
        <p>
          Use the contact page to find configured support channels. A complete
          retention schedule, operator contact details, verified access policies
          and account deletion process must be confirmed before production
          acceptance.
        </p>
      </div>
    </div>
  );
}
