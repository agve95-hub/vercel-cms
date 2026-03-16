import { db, schema } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
export const findRedirect = async (path: string) => {
  const [r] = await db.select().from(schema.redirects).where(eq(schema.redirects.sourcePath, path)).limit(1);
  if (r) await db.update(schema.redirects).set({ hits: sql`${schema.redirects.hits} + 1` }).where(eq(schema.redirects.id, r.id));
  return r;
};
