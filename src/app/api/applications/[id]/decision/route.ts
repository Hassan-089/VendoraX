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
  if (account.profile.role !== "organizer")
    return NextResponse.json(
      { error: "Organizer access is required." },
      { status: 403 },
    );
  const { id } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return NextResponse.json(
      { error: "Invalid application." },
      { status: 400 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body || !["approved", "rejected"].includes(body.status))
    return NextResponse.json(
      { error: "Choose an approval or rejection." },
      { status: 400 },
    );
  try {
    const app = await account.db
      .from("stall_applications")
      .select("id,event_id,status")
      .eq("id", id)
      .maybeSingle();
    if (app.error)
      return NextResponse.json(
        { error: "Unable to load application." },
        { status: 503 },
      );
    if (!app.data)
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    const event = await account.db
      .from("events")
      .select("id")
      .eq("id", app.data.event_id)
      .eq("organizer_id", account.user.id)
      .maybeSingle();
    if (event.error || !event.data)
      return NextResponse.json(
        { error: "You cannot review this application." },
        { status: 403 },
      );
    if (app.data.status !== "pending")
      return NextResponse.json(
        {
          error:
            "This application has already been reviewed. Reload to see its status.",
        },
        { status: 409 },
      );
    const updated = await account.db
      .from("stall_applications")
      .update({ status: body.status })
      .eq("id", id)
      .eq("event_id", event.data.id)
      .eq("status", "pending")
      .select("id");
    if (updated.error)
      return NextResponse.json(
        { error: "Unable to save decision." },
        { status: 503 },
      );
    if (!updated.data?.length)
      return NextResponse.json(
        { error: "The application changed. Reload and try again." },
        { status: 409 },
      );
    return NextResponse.json({ id, status: body.status });
  } catch {
    return NextResponse.json(
      { error: "Application service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
