import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

// Pages with their own route in src/pages. An EmDash page with one of these
// slugs is shadowed by that route, so it must not be listed a second time.
const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/produtos/", changefreq: "weekly", priority: "0.9" },
  { path: "/sobre/", changefreq: "monthly", priority: "0.8" },
  { path: "/distribuidores/", changefreq: "monthly", priority: "0.8" },
  { path: "/contato/", changefreq: "monthly", priority: "0.8" },
];

// Imported WordPress pages that duplicate a static page above
// (home-2 → "/", sobre-nos → "/sobre/").
const EXCLUDED_SLUGS = new Set(["home-2", "sobre-nos"]);

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || "https://powervox.com.br";
  const { entries: pages } = await getEmDashCollection("pages", { status: "published" });

  const staticSlugs = new Set(STATIC_PAGES.map((p) => p.path.replaceAll("/", "")));
  const cmsPages = (pages || [])
    .filter((page: any) => !staticSlugs.has(page.slug) && !EXCLUDED_SLUGS.has(page.slug))
    .map((page: any) => ({ path: `/${page.slug}/`, changefreq: "monthly", priority: "0.8" }));

  const urls = [...STATIC_PAGES, ...cmsPages].map((p) => `
  <url>
    <loc>${baseUrl}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
