import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { processImage } from "@/lib/media/process";
import { validateUpload } from "@/lib/security/validate-upload";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await db.select().from(schema.media).orderBy(desc(schema.media.createdAt)));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const file = fd.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const v = await validateUpload(buf, file.type, file.size);
  if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
  const p = await processImage(buf, file.name);
  const id = uuid();
  await db.insert(schema.media).values({ id, filename: file.name, filepath: p.original, mimetype: file.type, sizeBytes: file.size, width: p.width, height: p.height, altText: (fd.get("altText") as string)||"", variants: JSON.stringify(p.variants), uploadedBy: (session.user as any).id });
  return NextResponse.json({ id }, { status: 201 });
}
