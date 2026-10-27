"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
export function ApplicationDecision({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function decide(status: "approved" | "rejected") {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/applications/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to save the decision.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save the decision.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <div className="flex gap-2">
        <Button disabled={busy} onClick={() => void decide("approved")}>
          Approve application
        </Button>
        <Button
          disabled={busy}
          variant="outline"
          onClick={() => void decide("rejected")}
        >
          Decline
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-700 mt-3">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        Application decision only. No inventory or payment is confirmed.
      </p>
    </div>
  );
}
