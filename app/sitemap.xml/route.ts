import { generateSitemap } from "@/lib/seo/sitemap";
export async function GET() { return new Response(await generateSitemap(), { headers: { "Content-Type": "application/xml" } }); }
