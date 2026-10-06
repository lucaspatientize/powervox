/**
 * Redirect /sitemaps.xml → /sitemap-index.xml (matches old WordPress URL)
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect }) => {
  return redirect("/sitemap-index.xml", 301);
};
