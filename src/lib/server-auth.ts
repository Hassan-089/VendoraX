import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
export const serverAccount = cache(async function serverAccount() {
  const store = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    !url ||
    !key ||
    !store.getAll().some((cookie) => /^sb-.*-auth-token/.test(cookie.name))
  )
    return null;
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: () => {
        /* Token refresh is handled by proxy.ts. */
      },
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(12000),
        }),
    },
  });
  try {
    const {
      data: { user },
      error,
    } = await db.auth.getUser();
    if (error || !user) return null;
    const profile = await db
      .from("profiles")
      .select("id,name,role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile.error || !profile.data) return null;
    const role = profile.data.role;
    if (!["user", "organizer", "business", "admin"].includes(role)) return null;
    return {
      user,
      profile: profile.data as {
        id: string;
        name: string | null;
        role: "user" | "organizer" | "business" | "admin";
      },
      db,
    };
  } catch {
    return null;
  }
});
export async function requireAccount(
  role?: "user" | "organizer" | "business" | "admin",
) {
  const account = await serverAccount();
  if (!account) redirect("/login");
  if (role && account.profile.role !== role)
    redirect(`/${account.profile.role}/dashboard`);
  return account;
}
