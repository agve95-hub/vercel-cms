import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
export const generateSitemap = async (): Promise<string> => {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const pgs = await db.select({ slug: schema.pages.slug }).from(schema.pages).where(eq(schema.pages.status, "published"));
  const pts = await db.select({ slug: schema.posts.slug }).from(schema.posts).where(eq(schema.posts.status, "published"));
  const urls = [siteUrl, ...pgs.map(p => `${siteUrl}/${p.slug}`), `${siteUrl}/blog`, ...pts.map(p => `${siteUrl}/blog/${p.slug}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${u}</loc></url>`).join("\n")}\n</urlset>`;
};
