import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://vendorax.focusnexuss.com"
  ).replace(/\/$/, "");
  return [
    "",
    "/events",
    "/categories",
    "/cities",
    "/for-organizers",
    "/for-businesses",
    "/about",
    "/help",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/blog",
  ].map((path) => ({ url: `${base}${path}` }));
}
