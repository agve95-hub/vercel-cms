import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function GET(_r: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, params.id)).limit(1);
  return post ? NextResponse.json(post) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [existing] = await db.select().from(schema.posts).where(eq(schema.posts.id, params.id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.slug && body.slug !== existing.slug) await db.insert(schema.redirects).values({ id: uuid(), sourcePath: `/blog/${existing.slug}`, destination: `/blog/${body.slug}`, type: 301, createdBy: (session.user as any).id });
  await db.update(schema.posts).set({ ...body, updatedAt: new Date() }).where(eq(schema.posts.id, params.id));
  const [updated] = await db.select().from(schema.posts).where(eq(schema.posts.id, params.id)).limit(1);
  return NextResponse.json(updated);
}

export async function DELETE(_r: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.update(schema.posts).set({ status: "trashed", updatedAt: new Date() }).where(eq(schema.posts.id, params.id));
  return NextResponse.json({ success: true });
}
