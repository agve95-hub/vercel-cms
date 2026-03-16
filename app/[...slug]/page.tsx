import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { PublicShell } from "@/components/public/PublicShell";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
interface Props { params: { slug: string[] } }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const [p] = await db.select().from(schema.pages).where(eq(schema.pages.slug, params.slug.join("/"))).limit(1); return p ? { title: p.seoTitle||p.title, description: p.seoDescription||undefined } : {}; }
export default async function DynamicPage({ params }: Props) {
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.slug, params.slug.join("/"))).limit(1);
  if (!page || page.status !== "published") notFound();
  return (<PublicShell><main className="max-w-7xl mx-auto px-4 py-12"><BlockRenderer blocks={JSON.parse(page.blocks)}/></main></PublicShell>);
}
