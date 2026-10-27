export const metadata = { title: "Cookie information | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">ACCOUNT SESSIONS</p>
        <h1>Cookies that keep you signed in.</h1>
        <p>How the current application uses browser storage.</p>
      </div>
      <div className="info-content">
        <h2>Authentication cookies</h2>
        <p>
          Supabase’s supported session mechanism uses cookies to maintain your
          account session across pages. These cookies are needed for signed-in
          features.
        </p>
        <h2>Public browsing</h2>
        <p>
          You can browse public event pages without creating an account. Search
          filters are stored in the page URL so filtered listings can be shared.
        </p>
        <h2>Your browser controls</h2>
        <p>
          You can clear site cookies through your browser settings. Clearing
          authentication cookies signs you out of account features. You may need
          to sign in again on your next visit.
        </p>
      </div>
    </div>
  );
}
