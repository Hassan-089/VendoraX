"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const links = [
  { label: "Explore events", href: "/events" },
  { label: "For organizers", href: "/for-organizers" },
  { label: "For businesses", href: "/for-businesses" },
];
export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [error, setError] = useState("");
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="wordmark" aria-label="VendoraX home">
          <span className="brand-mark" aria-hidden="true">
            v
          </span>
          VendoraX<span className="text-primary">.</span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-account">
          {user ? (
            <>
              <Link href={`/${user.role || "user"}/dashboard`}>Dashboard</Link>
              <button
                onClick={() => {
                  setError("");
                  void logout().catch(() =>
                    setError("Unable to sign out. Please try again."),
                  );
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link className="action action-primary" href="/signup">
                Get started <ArrowUpRight size={15} />
              </Link>
            </>
          )}
          {loading && (
            <span className="sr-only" role="status">
              Checking your account
            </span>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-center text-sm text-red-700 pb-2">
          {error}
        </p>
      )}
      <details key={pathname} className="mobile-menu">
        <summary>
          Explore VendoraX
          <Menu size={17} />
        </summary>
        <nav aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/categories">Browse categories</Link>
          <Link href="/help">Help centre</Link>
        </nav>
      </details>
    </header>
  );
}
