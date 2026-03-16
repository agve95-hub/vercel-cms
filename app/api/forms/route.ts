import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { sendEmail } from "@/lib/email/send";
import { sanitizePlainText } from "@/lib/security/sanitize";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await db.select().from(schema.formSubmissions).orderBy(desc(schema.formSubmissions.createdAt)));
}

export async function POST(req: NextRequest) {
  const { formName, data, pageId } = await req.json();
  if (data?._hp) return NextResponse.json({ success: true });
  const clean: Record<string,string> = {};
  for (const [k,v] of Object.entries(data||{})) { if (!k.startsWith("_")) clean[k] = sanitizePlainText(String(v)); }
  await db.insert(schema.formSubmissions).values({ id: uuid(), formName: formName||"contact", data: JSON.stringify(clean), pageId, ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() });
  if (process.env.CONTACT_FORM_TO) await sendEmail({ to: process.env.CONTACT_FORM_TO, subject: `New ${formName||"contact"} submission`, html: Object.entries(clean).map(([k,v])=>`<p><b>${k}:</b> ${v}</p>`).join("") });
  return NextResponse.json({ success: true }, { status: 201 });
}
