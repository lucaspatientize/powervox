/**
 * /robots.txt — overrides EmDash's built-in one so the Sitemap line points at
 * the canonical domain's sitemap index rather than whichever host was requested.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || "https://powervox.com.br";

  const body = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /_emdash/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
