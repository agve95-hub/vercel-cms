import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { format } from "date-fns";
import { PublicShell } from "@/components/public/PublicShell";
export const metadata = { title: "Blog" };
export default async function BlogPage() {
  const posts = await db.select().from(schema.posts).where(eq(schema.posts.status,"published")).orderBy(desc(schema.posts.createdAt));
  return (<PublicShell><main className="max-w-4xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold mb-8">Blog</h1>{posts.length===0?<p className="text-gray-500">No posts yet.</p>:<div className="space-y-8">{posts.map(p=>(<article key={p.id} className="border-b pb-8"><Link href={`/blog/${p.slug}`} className="group"><h2 className="text-2xl font-semibold group-hover:text-brand-600 transition-colors">{p.title}</h2></Link>{p.excerpt&&<p className="mt-2 text-gray-600">{p.excerpt}</p>}<time className="mt-2 block text-sm text-gray-400">{p.createdAt?format(new Date(p.createdAt),"MMMM d, yyyy"):""}</time></article>))}</div>}</main></PublicShell>);
}
