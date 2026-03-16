import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
export default async function EditPage({ params }: { params: { id: string } }) {
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.id, params.id)).limit(1);
  if (!page) notFound();
  return <PageEditor page={page}/>;
}
