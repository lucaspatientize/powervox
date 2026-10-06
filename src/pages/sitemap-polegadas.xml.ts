import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || "https://powervox.com.br";

  // Static polegadas taxonomy pages matching original sitemap
  const polegadasSlugs = [
    "5-midbass",
    "6-midbass",
    "8-subwoofer",
    "10-subwoofer",
    "12-subwoofer",
    "15-subwoofer",
  ];

  const urls = polegadasSlugs.map((slug) => `
  <url>
    <loc>${baseUrl}/polegadas/${slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
