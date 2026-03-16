import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function GET(_r: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.id, params.id)).limit(1);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [existing] = await db.select().from(schema.pages).where(eq(schema.pages.id, params.id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.slug && body.slug !== existing.slug) await db.insert(schema.redirects).values({ id: uuid(), sourcePath: `/${existing.slug}`, destination: `/${body.slug}`, type: 301, createdBy: (session.user as any).id });
  await db.update(schema.pages).set({ ...body, updatedAt: new Date() }).where(eq(schema.pages.id, params.id));
  await db.insert(schema.activityLog).values({ id: uuid(), userId: (session.user as any).id, action: "update", entityType: "page", entityId: params.id, entityTitle: body.title || existing.title });
  const [updated] = await db.select().from(schema.pages).where(eq(schema.pages.id, params.id)).limit(1);
  return NextResponse.json(updated);
}

export async function DELETE(_r: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.update(schema.pages).set({ status: "trashed", updatedAt: new Date() }).where(eq(schema.pages.id, params.id));
  return NextResponse.json({ success: true });
}
