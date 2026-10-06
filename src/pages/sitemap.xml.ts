/**
 * /sitemap.xml — overrides EmDash's built-in sitemap, which only knows the
 * collections' own URL patterns (/midbass/{slug}) and misses the static pages.
 * Serves the same index as /sitemap-index.xml.
 */
export { GET } from "./sitemap-index.xml";
