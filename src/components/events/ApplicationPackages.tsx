"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatPKR } from "@/lib/marketplace";
import type { PublicPackage } from "@/lib/public-events";
import { BrandLogo } from "@/components/marketplace/BrandLogo";
export function ApplicationPackages({
  packages,
  eventId,
  closed,
  demo = false,
}: {
  packages: PublicPackage[];
  eventId: string;
  closed: boolean;
  demo?: boolean;
}) {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<PublicPackage | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          packageId: selected.id,
          message: message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to submit application.");
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit application.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-5">
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            className="border border-border rounded-lg p-6 bg-white"
          >
            <div className="package-brand-row">
              <BrandLogo
                name={pkg.logo || pkg.name}
                accent={pkg.accent}
                size="small"
              />
              <p className="eyebrow">STALL PACKAGE</p>
            </div>
            <h3 className="text-lg font-semibold">{pkg.name}</h3>
            <p className="text-2xl font-semibold my-3">
              {formatPKR(pkg.price)}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Dimensions: {pkg.size || "Not provided"}
            </p>
            <ul className="space-y-2 mb-6">
              {(pkg.perks || []).map((perk, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-xs text-muted-foreground"
                >
                  <Check size={15} className="text-primary shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
            {demo ? (
              <p className="notice">
                Local preview package · applications are disabled.
              </p>
            ) : closed ? (
              <p className="notice">This event has ended.</p>
            ) : user?.role === "business" ? (
              <Button
                className="w-full"
                onClick={() => {
                  setSelected(pkg);
                  setMessage("");
                  setError("");
                  setSuccess(false);
                }}
              >
                Apply for this package
                <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : !user ? (
              <Link className="action action-outline w-full" href="/login">
                {loading ? "Sign in to apply" : "Log in to apply"}
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground">
                A business account is required to apply.
              </p>
            )}
          </article>
        ))}
      </div>
      <p className="notice mt-6">
        An application is a request for review. Availability is not reserved and
        payment is not collected on this site. Confirm requirements and booking
        arrangements with the organizer.
      </p>
      <Modal
        isOpen={!!selected}
        onClose={() => {
          if (!busy) setSelected(null);
        }}
        title={success ? "Application submitted" : "Introduce your business"}
      >
        {success ? (
          <div>
            <p className="text-sm text-muted-foreground leading-7">
              The organizer can now review your application. This does not
              confirm a booking or payment.
            </p>
            <Link
              href="/business/applications"
              className="action action-primary mt-5"
            >
              View my applications
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="text-sm mb-5">
              {selected?.name} · {selected && formatPKR(selected.price)}
            </p>
            <label
              htmlFor="business-introduction"
              className="text-sm font-medium"
            >
              Your business and what you offer
            </label>
            <textarea
              id="business-introduction"
              required
              minLength={10}
              maxLength={3000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full border border-border rounded-md p-3 mt-2 min-h-36 text-sm"
              placeholder="Tell the organizer about your products, your business and any requirements."
            />
            <p className="text-xs text-muted-foreground mt-2">
              Do not include passwords, payment details or identity documents.
            </p>
            {error && (
              <p className="text-sm text-red-700 mt-4" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={busy} className="w-full mt-5">
              {busy ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
