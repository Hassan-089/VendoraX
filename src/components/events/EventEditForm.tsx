"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { PublicEvent } from "@/lib/public-events";
export function EventEditForm({ event }: { event: PublicEvent }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const fields = new FormData(e.currentTarget);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fields)),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to save changes.");
      router.push("/organizer/my-events");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save changes.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl">
      {[
        { name: "title", label: "Event name", value: event.title },
        { name: "city", label: "City", value: event.city },
        { name: "venue", label: "Venue", value: event.venue || "" },
        { name: "category", label: "Category", value: event.category || "" },
      ].map((field) => (
        <div key={field.name}>
          <label className="text-sm font-medium" htmlFor={field.name}>
            {field.label}
          </label>
          <Input
            className="mt-2"
            id={field.name}
            name={field.name}
            defaultValue={field.value}
            required
            maxLength={200}
          />
        </div>
      ))}
      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          className="w-full border border-border rounded p-3 min-h-40 mt-2 text-sm"
          name="description"
          id="description"
          required
          maxLength={15000}
          defaultValue={event.description || ""}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {[
          { name: "start_date", label: "Start date", value: event.start_date },
          {
            name: "end_date",
            label: "End date",
            value: event.end_date || event.start_date,
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="text-sm font-medium" htmlFor={field.name}>
              {field.label}
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="date"
              className="mt-2"
              defaultValue={field.value.slice(0, 10)}
              required
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="expected_visitors" className="text-sm font-medium">
          Expected attendance (your estimate)
        </label>
        <Input
          id="expected_visitors"
          name="expected_visitors"
          type="number"
          min="1"
          max="100000000"
          step="1"
          className="mt-2"
          required
          defaultValue={event.expected_visitors || 1}
        />
      </div>
      <p className="notice">
        Edits are allowed only while an event is pending review and has no
        applications. Published events need a change-notification workflow
        before they can be safely edited.
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save event details"}
      </Button>
    </form>
  );
}
