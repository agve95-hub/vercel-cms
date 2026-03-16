import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { eq, desc, ne } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const postSchema = z.object({ title: z.string().min(1), slug: z.string().min(1), blocks: z.string(), excerpt: z.string().nullable().optional(), featuredImage: z.string().nullable().optional(), status: z.enum(["draft","published","archived","trashed"]).optional(), publishAt: z.string().nullable().optional(), seoTitle: z.string().nullable().optional(), seoDescription: z.string().nullable().optional(), seoOgImage: z.string().nullable().optional(), canonicalUrl: z.string().nullable().optional(), robots: z.string().optional() });

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const s = req.nextUrl.searchParams.get("status");
  const rows = s ? await db.select().from(schema.posts).where(eq(schema.posts.status, s)).orderBy(desc(schema.posts.updatedAt)) : await db.select().from(schema.posts).where(ne(schema.posts.status, "trashed")).orderBy(desc(schema.posts.updatedAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  const { title, slug, blocks, ...rest } = parsed.data;
  const id = uuid();
  await db.insert(schema.posts).values({ id, title, slug, blocks, createdBy: (session.user as any).id, createdAt: new Date(), updatedAt: new Date(), ...rest });
  await db.insert(schema.activityLog).values({ id: uuid(), userId: (session.user as any).id, action: "create", entityType: "post", entityId: id, entityTitle: title });
  return NextResponse.json({ id, title, slug }, { status: 201 });
}
