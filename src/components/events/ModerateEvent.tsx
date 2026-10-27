"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
export function ModerateEvent({ id }: { id: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <div>
      <Button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const response = await fetch(`/api/admin/events/${id}`, {
              method: "POST",
            });
            const data = await response.json();
            if (!response.ok)
              throw new Error(data.error || "Unable to approve event.");
            router.refresh();
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Unable to approve event.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Approving…" : "Approve for publication"}
      </Button>
      {error && (
        <p className="text-red-700 text-xs mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
