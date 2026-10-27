import { NextResponse } from "next/server";
import { serverAccount } from "@/lib/server-auth";
export async function PATCH(request: Request) {
  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  const account = await serverAccount();
  if (!account)
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !body ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.length > 150 ||
    Object.keys(body).some((key) => key !== "name")
  )
    return NextResponse.json(
      { error: "Only your display name can be changed. Use 1–150 characters." },
      { status: 400 },
    );
  const result = await account.db
    .from("profiles")
    .update({ name: body.name.trim() })
    .eq("id", account.user.id)
    .select("id");
  if (result.error || !result.data?.length)
    return NextResponse.json(
      { error: "Unable to update your profile." },
      { status: 503 },
    );
  return NextResponse.json({ updated: true });
}
