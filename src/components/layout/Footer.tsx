import Link from "next/link";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="wordmark">
            <span className="brand-mark" aria-hidden="true">
              v
            </span>
            VendoraX.
          </Link>
          <p className="footer-about">
            A place for Pakistan’s events, ambitious organizers and businesses
            ready to grow.
          </p>
          <p className="footer-about">Discover. Connect. Show up.</p>
        </div>
        {[
          {
            title: "Discover",
            links: [
              ["Explore events", "/events"],
              ["Event categories", "/categories"],
              ["Browse by city", "/cities"],
              ["Event guides", "/blog"],
            ],
          },
          {
            title: "Get involved",
            links: [
              ["For organizers", "/for-organizers"],
              ["For businesses", "/for-businesses"],
              ["About VendoraX", "/about"],
              ["Help & FAQs", "/help"],
            ],
          },
          {
            title: "The essentials",
            links: [
              ["Contact", "/contact"],
              ["Terms & conditions", "/terms"],
              ["Privacy policy", "/privacy"],
              ["Cookie information", "/cookies"],
            ],
          },
        ].map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} VendoraX. Made for connections.
        </span>
        <span>Pakistan · All event dates in PKT · Prices in PKR</span>
      </div>
    </footer>
  );
}
