// Best-effort per-instance protection. A shared store is required for a distributed production limit.
const windows = new Map<string, { count: number; until: number }>();
export function allowRequest(key: string, limit: number, windowMs = 60000) {
  const now = Date.now();
  if (windows.size > 10000) {
    for (const [id, item] of windows) if (item.until <= now) windows.delete(id);
    if (windows.size > 10000) return false;
  }
  const current = windows.get(key);
  if (!current || current.until <= now) {
    windows.set(key, { count: 1, until: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count++;
  return true;
}
export function requestIdentity(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    "local"
  )
    .split(",")[0]
    .trim()
    .slice(0, 100);
}
