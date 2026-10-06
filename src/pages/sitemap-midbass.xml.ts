import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || "https://powervox.com.br";
  const { entries: products } = await getEmDashCollection("midbass", { status: "published" });

  const urls = (products || []).map((p: any) => `
  <url>
    <loc>${baseUrl}/produtos/mid-bass/${p.slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/produtos/mid-bass/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>${urls}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
