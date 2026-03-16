import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
export async function GET() { const s = await getServerSession(authOptions); if (!s) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json(await db.select().from(schema.redirects).orderBy(desc(schema.redirects.createdAt))); }
export async function POST(req: NextRequest) { const s = await getServerSession(authOptions); if (!s) return NextResponse.json({error:"Unauthorized"},{status:401}); const { sourcePath, destination, type } = await req.json(); const id = uuid(); await db.insert(schema.redirects).values({ id, sourcePath, destination, type: type||301, createdBy: (s.user as any).id }); return NextResponse.json({ id }, { status: 201 }); }
