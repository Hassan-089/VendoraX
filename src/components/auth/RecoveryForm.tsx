"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
export function RecoveryForm({ reset = false }: { reset?: boolean }) {
  const [value, setValue] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");
    if (reset && value !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const db = createClient();
      if (reset) {
        const { data, error } = await db.auth.getUser();
        if (error || !data.user)
          throw new Error(
            "This recovery link is invalid or has expired. Request a new link.",
          );
        const updated = await db.auth.updateUser({ password: value });
        if (updated.error) throw updated.error;
        await db.auth.signOut();
        setMessage(
          "Password updated. You can now log in with your new password.",
        );
      } else {
        const result = await db.auth.resetPasswordForEmail(value.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (result.error) throw result.error;
        setMessage(
          "If an account uses this email, you will receive a password recovery link.",
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      {message ? (
        <div>
          <p role="status" className="text-sm leading-7 text-primary">
            {message}
          </p>
          <Link href="/login" className="action action-outline mt-4">
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="recovery-value" className="text-sm font-medium">
              {reset ? "New password" : "Email address"}
            </label>
            <Input
              id="recovery-value"
              className="mt-2"
              type={reset ? "password" : "email"}
              autoComplete={reset ? "new-password" : "email"}
              required
              minLength={reset ? 8 : undefined}
              maxLength={reset ? 128 : 254}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          {reset && (
            <div>
              <label
                htmlFor="recovery-confirmation"
                className="text-sm font-medium"
              >
                Confirm new password
              </label>
              <Input
                id="recovery-confirmation"
                className="mt-2"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-red-700 text-sm leading-6">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            {busy
              ? "Please wait…"
              : reset
                ? "Update password"
                : "Send recovery link"}
          </Button>
          {reset && (
            <Link className="text-link" href="/forgot-password">
              Request a new recovery link
            </Link>
          )}
        </>
      )}
    </form>
  );
}
