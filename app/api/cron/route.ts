import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, lte } from "drizzle-orm";
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = new Date(); let n = 0;
  const dp = await db.select().from(schema.pages).where(and(eq(schema.pages.status, "draft"), lte(schema.pages.publishAt, now)));
  for (const p of dp.filter(p=>p.publishAt)) { await db.update(schema.pages).set({ status: "published", updatedAt: now }).where(eq(schema.pages.id, p.id)); n++; }
  const dps = await db.select().from(schema.posts).where(and(eq(schema.posts.status, "draft"), lte(schema.posts.publishAt, now)));
  for (const p of dps.filter(p=>p.publishAt)) { await db.update(schema.posts).set({ status: "published", updatedAt: now }).where(eq(schema.posts.id, p.id)); n++; }
  return NextResponse.json({ ok: true, published: n });
}
