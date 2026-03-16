import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { PublicShell } from "@/components/public/PublicShell";
export default async function Home() {
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.slug,"home")).limit(1);
  if (!page || page.status !== "published") return (<PublicShell><main className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Welcome</h1><p className="text-gray-600">Visit <a href="/admin" className="text-brand-600 underline">/admin</a> to set up your site.</p></div></main></PublicShell>);
  return (<PublicShell><main><BlockRenderer blocks={JSON.parse(page.blocks)}/></main></PublicShell>);
}
