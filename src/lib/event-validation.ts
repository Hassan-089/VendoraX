export interface DraftPackage {
  name: string;
  price: string;
  size: string;
  perks: string[];
}
export interface EventDraft {
  title: string;
  description: string;
  city: string;
  venue: string;
  category: string;
  start_date: string;
  end_date: string;
  expected_visitors: number;
  packages: DraftPackage[];
}
export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function validateEventDraft(
  input: unknown,
): { value: EventDraft; error?: never } | { error: string; value?: never } {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { error: "Provide event details." };
  const body = input as Record<string, unknown>;
  const text: Record<string, string> = {};
  for (const field of ["title", "description", "city", "venue", "category"]) {
    const value = body[field];
    if (
      typeof value !== "string" ||
      !value.trim() ||
      value.length > (field === "description" ? 15000 : 200)
    )
      return { error: `Check the event ${field}.` };
    text[field] = value.trim();
  }
  if (
    !validDate(body.start_date) ||
    !validDate(body.end_date) ||
    body.end_date < body.start_date
  )
    return { error: "Provide valid dates with the end on or after the start." };
  const attendance =
    typeof body.expected_visitors === "string"
      ? Number(body.expected_visitors)
      : body.expected_visitors;
  if (
    typeof attendance !== "number" ||
    !Number.isSafeInteger(attendance) ||
    attendance < 1 ||
    attendance > 100000000
  )
    return { error: "Attendance must be a positive whole-number estimate." };
  if (!Array.isArray(body.packages) || body.packages.length > 20)
    return { error: "Provide no more than 20 stall packages." };
  const packages: DraftPackage[] = [];
  for (const raw of body.packages) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      return { error: "Check the stall package details." };
    const pkg = raw as Record<string, unknown>;
    if (
      typeof pkg.name !== "string" ||
      !pkg.name.trim() ||
      pkg.name.length > 150 ||
      typeof pkg.price !== "string" ||
      !/^\d{1,9}(\.\d{1,2})?$/.test(pkg.price) ||
      typeof pkg.size !== "string" ||
      !pkg.size.trim() ||
      pkg.size.length > 100 ||
      !Array.isArray(pkg.perks) ||
      pkg.perks.length > 30 ||
      pkg.perks.some((perk) => typeof perk !== "string" || perk.length > 200)
    )
      return {
        error:
          "Each package needs a name, dimensions and a PKR price with at most two decimal places.",
      };
    packages.push({
      name: pkg.name.trim(),
      price: pkg.price,
      size: pkg.size.trim(),
      perks: pkg.perks.map((perk) => String(perk).trim()).filter(Boolean),
    });
  }
  return {
    value: {
      title: text.title,
      description: text.description,
      city: text.city,
      venue: text.venue,
      category: text.category,
      start_date: body.start_date,
      end_date: body.end_date,
      expected_visitors: attendance,
      packages,
    },
  };
}
