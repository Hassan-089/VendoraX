"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RoleSelector } from "./RoleSelector";
import { createClient } from "@/lib/supabaseClient";

export function SignupForm({
  initialRole = "user",
}: {
  initialRole?: "user" | "organizer" | "business";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pass role in user_metadata so the Supabase SQL Trigger can pick it up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
            user_role: role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user && !authData.session) {
        setNotice("Check your email to confirm your account, then log in.");
        return;
      }
      // Only enter protected pages when a session exists.
      if (authData.session) router.push("/onboarding");
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {notice && (
        <p
          role="status"
          className="p-3 bg-green-50 text-green-800 rounded-md text-sm"
        >
          {notice}
        </p>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select your role</label>
          <RoleSelector selectedRole={role} onSelect={setRole} />
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="signup-name"
            autoComplete="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="signup-email"
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="signup-password"
            autoComplete="new-password"
            minLength={8}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11"
        variant="primary"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
