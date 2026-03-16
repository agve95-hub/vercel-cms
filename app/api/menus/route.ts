import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
export async function GET() { return NextResponse.json(await db.select().from(schema.navigationMenus)); }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, items } = await req.json();
  const [existing] = await db.select().from(schema.navigationMenus).where(eq(schema.navigationMenus.name, name)).limit(1);
  if (existing) { await db.update(schema.navigationMenus).set({ items: JSON.stringify(items), updatedAt: new Date() }).where(eq(schema.navigationMenus.id, existing.id)); return NextResponse.json({ id: existing.id }); }
  const id = uuid(); await db.insert(schema.navigationMenus).values({ id, name, items: JSON.stringify(items) }); return NextResponse.json({ id }, { status: 201 });
}
