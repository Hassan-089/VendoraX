import { NextResponse } from "next/server";
import { serverAccount } from "@/lib/server-auth";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function POST(request: Request) {
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
  if (account.profile.role !== "business")
    return NextResponse.json(
      { error: "A business account is required." },
      { status: 403 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !body ||
    !uuid.test(body.eventId) ||
    !uuid.test(body.packageId) ||
    typeof body.message !== "string" ||
    body.message.trim().length < 10 ||
    body.message.length > 3000
  )
    return NextResponse.json(
      {
        error:
          "Choose a package and write an introduction of 10–3000 characters.",
      },
      { status: 400 },
    );
  try {
    const event = await account.db
      .from("events")
      .select("id,end_date,status")
      .eq("id", body.eventId)
      .eq("status", "approved")
      .maybeSingle();
    if (event.error)
      return NextResponse.json(
        { error: "Unable to check this event. Please try again." },
        { status: 503 },
      );
    if (!event.data)
      return NextResponse.json(
        { error: "This event is not accepting applications." },
        { status: 404 },
      );
    const { pakistanToday } = await import("@/lib/marketplace");
    if (event.data.end_date && event.data.end_date < pakistanToday())
      return NextResponse.json(
        { error: "This event has ended." },
        { status: 409 },
      );
    const pkg = await account.db
      .from("stall_packages")
      .select("id")
      .eq("id", body.packageId)
      .eq("event_id", body.eventId)
      .maybeSingle();
    if (pkg.error || !pkg.data)
      return NextResponse.json(
        { error: "The selected package is not available for this event." },
        { status: 409 },
      );
    const existing = await account.db
      .from("stall_applications")
      .select("id")
      .eq("business_id", account.user.id)
      .eq("package_id", body.packageId)
      .in("status", ["pending", "approved"])
      .limit(1);
    if (existing.error)
      return NextResponse.json(
        { error: "Unable to verify existing applications." },
        { status: 503 },
      );
    if (existing.data?.length)
      return NextResponse.json(
        { error: "You already have an active application for this package." },
        { status: 409 },
      );
    const result = await account.db
      .from("stall_applications")
      .insert({
        event_id: body.eventId,
        package_id: body.packageId,
        business_id: account.user.id,
        message: body.message.trim(),
        status: "pending",
      })
      .select("id")
      .single();
    if (result.error)
      return NextResponse.json(
        {
          error:
            result.error.code === "23505"
              ? "An application already exists."
              : "Unable to submit your application. Please try again.",
        },
        { status: result.error.code === "23505" ? 409 : 503 },
      );
    return NextResponse.json(
      { id: result.data.id, status: "pending" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Application service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
