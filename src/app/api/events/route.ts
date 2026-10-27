import { NextResponse } from "next/server";
import { serverAccount } from "@/lib/server-auth";
import { validateEventDraft } from "@/lib/event-validation";
import { allowRequest } from "@/lib/rate-limit";
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
  if (account.profile.role !== "organizer")
    return NextResponse.json(
      { error: "An organizer account is required." },
      { status: 403 },
    );
  if (!allowRequest(`create-event:${account.user.id}`, 5))
    return NextResponse.json(
      { error: "Please wait before creating another event." },
      { status: 429 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = validateEventDraft(body);
  if (parsed.error)
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { packages, ...fields } = parsed.value!;
  try {
    const count = await account.db
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("organizer_id", account.user.id);
    if (count.error)
      return NextResponse.json(
        { error: "Unable to check your event limit." },
        { status: 503 },
      );
    if ((count.count || 0) >= 5)
      return NextResponse.json(
        { error: "The current account limit is five events." },
        { status: 409 },
      );
    const event = await account.db
      .from("events")
      .insert({ ...fields, organizer_id: account.user.id, status: "pending" })
      .select("id")
      .single();
    if (event.error || !event.data)
      return NextResponse.json(
        { error: "Unable to save your event." },
        { status: 503 },
      );
    if (packages.length) {
      const result = await account.db
        .from("stall_packages")
        .insert(packages.map((pkg) => ({ ...pkg, event_id: event.data.id })));
      if (result.error)
        return NextResponse.json(
          {
            id: event.data.id,
            partial: true,
            error:
              "Your event was saved pending review, but its stall packages could not be saved. Do not submit another copy. Open My Events.",
          },
          { status: 201 },
        );
    }
    return NextResponse.json(
      { id: event.data.id, status: "pending" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to save your event. Check My Events before retrying." },
      { status: 503 },
    );
  }
}
