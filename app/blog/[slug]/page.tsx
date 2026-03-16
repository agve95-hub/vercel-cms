import { db, schema } from "@/lib/db";
import { eq, ne, and, desc } from "drizzle-orm";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { PublicShell } from "@/components/public/PublicShell";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import type { Metadata } from "next";
interface Props { params: { slug: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const [p] = await db.select().from(schema.posts).where(eq(schema.posts.slug, params.slug)).limit(1); return p ? { title: p.seoTitle||p.title, description: p.seoDescription||p.excerpt||undefined } : {}; }
export default async function BlogPost({ params }: Props) {
  const [post] = await db.select().from(schema.posts).where(eq(schema.posts.slug, params.slug)).limit(1);
  if (!post || post.status !== "published") notFound();
  const related = await db.select().from(schema.posts).where(and(eq(schema.posts.status,"published"),ne(schema.posts.id,post.id))).orderBy(desc(schema.posts.createdAt)).limit(3);
  return (<PublicShell><main className="max-w-4xl mx-auto px-4 py-12"><article><h1 className="text-4xl font-bold mb-4">{post.title}</h1><time className="block text-sm text-gray-400 mb-8">{post.createdAt?format(new Date(post.createdAt),"MMMM d, yyyy"):""}</time><BlockRenderer blocks={JSON.parse(post.blocks)}/></article>{related.length>0&&<aside className="mt-16 border-t pt-8"><h2 className="text-2xl font-bold mb-6">Related Posts</h2><div className="grid md:grid-cols-3 gap-6">{related.map(r=>(<Link key={r.id} href={`/blog/${r.slug}`} className="group"><h3 className="font-semibold group-hover:text-brand-600">{r.title}</h3></Link>))}</div></aside>}</main></PublicShell>);
}
