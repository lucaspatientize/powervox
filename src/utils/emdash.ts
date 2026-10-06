/**
 * EmDash content helpers for Powervox
 * Wraps EmDash query functions with typed interfaces
 */
import { getEmDashCollection, getEmDashEntry, getSiteSettings, getMenu } from "emdash";

// Re-export for convenience
export { getEmDashCollection, getEmDashEntry, getSiteSettings, getMenu };

/**
 * Get all mid-bass products, optionally filtered by polegadas
 */
export async function getMidBassProducts(polegadas?: string) {
  const { entries, error } = await getEmDashCollection("midbass", {
    status: "published",
  });
  if (error) throw new Error(`Failed to fetch mid-bass products: ${error}`);
  if (polegadas && entries) {
    return entries.filter((e: any) => e.data?.polegadas === polegadas);
  }
  return entries || [];
}

/**
 * Get all subwoofer products, optionally filtered by polegadas
 */
export async function getSubwooferProducts(polegadas?: string) {
  const { entries, error } = await getEmDashCollection("subwoofer", {
    status: "published",
  });
  if (error) throw new Error(`Failed to fetch subwoofer products: ${error}`);
  if (polegadas && entries) {
    return entries.filter((e: any) => e.data?.polegadas === polegadas);
  }
  return entries || [];
}

/**
 * Get all products (both types combined)
 */
export async function getAllProducts() {
  const [midbass, subwoofers] = await Promise.all([
    getMidBassProducts(),
    getSubwooferProducts(),
  ]);
  return { midbass, subwoofers };
}

/**
 * Get products by polegadas value — returns both types
 */
export async function getProductsByPolegadas(polegadas: string) {
  const [midbass, subwoofers] = await Promise.all([
    getMidBassProducts(polegadas),
    getSubwooferProducts(polegadas),
  ]);
  return { midbass, subwoofers };
}

/**
 * Map polegadas slug from sitemap URL to the actual value stored in content
 * e.g., "10-subwoofer" → "10", "5-midbass" → "5"
 */
export function parsePolegadasSlug(slug: string): { size: string; type: string } {
  const match = slug.match(/^(\d+)-(subwoofer|midbass)$/);
  if (!match) return { size: "", type: "" };
  return { size: match[1], type: match[2] };
}
