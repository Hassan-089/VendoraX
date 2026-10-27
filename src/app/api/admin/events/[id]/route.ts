import { NextResponse } from "next/server";
import { serverAccount } from "@/lib/server-auth";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
  if (account.profile.role !== "admin")
    return NextResponse.json(
      { error: "Administrator access is required." },
      { status: 403 },
    );
  const { id } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  const result = await account.db
    .from("events")
    .update({ status: "approved" })
    .eq("id", id)
    .eq("status", "pending")
    .select("id");
  if (result.error)
    return NextResponse.json(
      { error: "Unable to approve event." },
      { status: 503 },
    );
  if (!result.data?.length)
    return NextResponse.json(
      { error: "The event changed or is no longer pending." },
      { status: 409 },
    );
  return NextResponse.json({ id, status: "approved" });
}
