import { validDate } from "@/lib/event-validation";
import { NextResponse } from "next/server";
import { serverAccount } from "@/lib/server-auth";
export async function PATCH(
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
  if (account.profile.role !== "organizer")
    return NextResponse.json(
      { error: "Organizer access required." },
      { status: 403 },
    );
  const { id } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const keys = ["title", "description", "city", "venue", "category"];
  if (
    !body ||
    keys.some(
      (key) =>
        typeof body[key] !== "string" ||
        !body[key].trim() ||
        body[key].length > (key === "description" ? 15000 : 200),
    ) ||
    !validDate(body.start_date) ||
    !validDate(body.end_date) ||
    body.end_date < body.start_date ||
    !Number.isInteger(Number(body.expected_visitors)) ||
    Number(body.expected_visitors) < 1 ||
    Number(body.expected_visitors) > 100000000
  )
    return NextResponse.json(
      { error: "Check all event fields, dates and attendance." },
      { status: 400 },
    );
  try {
    const owner = await account.db
      .from("events")
      .select("id")
      .eq("id", id)
      .eq("organizer_id", account.user.id)
      .eq("status", "pending")
      .maybeSingle();
    if (owner.error || !owner.data)
      return NextResponse.json(
        { error: "This event is unavailable or cannot be edited." },
        { status: 404 },
      );
    const count = await account.db
      .from("stall_applications")
      .select("id", { count: "exact", head: true })
      .eq("event_id", id);
    if (count.error)
      return NextResponse.json(
        { error: "Unable to check event applications." },
        { status: 503 },
      );
    if (count.count)
      return NextResponse.json(
        {
          error:
            "This event has applications and cannot be edited through this form.",
        },
        { status: 409 },
      );
    const updated = await account.db
      .from("events")
      .update({
        title: body.title.trim(),
        description: body.description.trim(),
        city: body.city.trim(),
        venue: body.venue.trim(),
        category: body.category.trim(),
        start_date: body.start_date,
        end_date: body.end_date,
        expected_visitors: Number(body.expected_visitors),
      })
      .eq("id", id)
      .eq("organizer_id", account.user.id)
      .eq("status", "pending")
      .select("id");
    if (updated.error)
      return NextResponse.json(
        { error: "Unable to save event details." },
        { status: 503 },
      );
    if (!updated.data?.length)
      return NextResponse.json(
        { error: "This event is unavailable or is no longer pending review." },
        { status: 409 },
      );
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "Event service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
