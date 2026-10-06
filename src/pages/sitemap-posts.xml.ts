import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || "https://powervox.com.br";
  const { entries: posts } = await getEmDashCollection("posts", { status: "published" });

  const urls = (posts || []).map((post: any) => `
  <url>
    <loc>${baseUrl}/${post.slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
