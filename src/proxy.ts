import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    !url ||
    !key ||
    !request.cookies
      .getAll()
      .some((cookie) => /^sb-.*-auth-token/.test(cookie.name))
  )
    return response;
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(12000) }),
    },
  });
  try {
    await db.auth.getUser();
  } catch {
    /* Protected layouts fail closed when verification fails. */
  }
  return response;
}
export const config = {
  matcher: [
    "/organizer/:path*",
    "/business/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/profile/:path*",
    "/favorites/:path*",
    "/onboarding/:path*",
  ],
};
