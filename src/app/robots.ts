import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://vendorax.focusnexuss.com"
  ).replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/organizer/",
        "/business/",
        "/user/",
        "/profile",
        "/favorites",
        "/onboarding",
        "/reset-password",
        "/auth/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
