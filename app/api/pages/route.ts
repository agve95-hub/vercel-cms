import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { eq, desc, ne } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const pageSchema = z.object({ title: z.string().min(1), slug: z.string().min(1), blocks: z.string(), status: z.enum(["draft","published","archived","trashed"]).optional(), publishAt: z.string().nullable().optional(), seoTitle: z.string().nullable().optional(), seoDescription: z.string().nullable().optional(), parentId: z.string().nullable().optional(), template: z.string().nullable().optional(), seoOgImage: z.string().nullable().optional(), canonicalUrl: z.string().nullable().optional(), robots: z.string().optional() });

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const s = req.nextUrl.searchParams.get("status");
  const rows = s ? await db.select().from(schema.pages).where(eq(schema.pages.status, s)).orderBy(desc(schema.pages.updatedAt)) : await db.select().from(schema.pages).where(ne(schema.pages.status, "trashed")).orderBy(desc(schema.pages.updatedAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  const { title, slug, blocks, ...rest } = parsed.data;
  const id = uuid();
  const now = new Date();
  await db.insert(schema.pages).values({ id, title, slug, blocks, createdBy: (session.user as any).id, createdAt: now, updatedAt: now, ...rest });
  await db.insert(schema.activityLog).values({ id: uuid(), userId: (session.user as any).id, action: "create", entityType: "page", entityId: id, entityTitle: title });
  return NextResponse.json({ id, title, slug }, { status: 201 });
}
