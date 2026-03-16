import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { acquireLock, releaseLock, renewLock } from "@/lib/locks/content-lock";
export async function POST(req: NextRequest) { const s = await getServerSession(authOptions); if (!s) return NextResponse.json({error:"Unauthorized"},{status:401}); const { action, entityType, entityId } = await req.json(); const uid = (s.user as any).id; if (action==="acquire") return NextResponse.json(await acquireLock(entityType,entityId,uid)); if (action==="release") { await releaseLock(entityType,entityId,uid); return NextResponse.json({success:true}); } if (action==="renew") { await renewLock(entityType,entityId,uid); return NextResponse.json({success:true}); } return NextResponse.json({error:"Invalid action"},{status:400}); }
