import { LRUCache } from "lru-cache";
import { NextRequest, NextResponse } from "next/server";
const cache = new LRUCache<string, { count: number; resetAt: number }>({ max: 10000, ttl: 15*60*1000 });
export const rateLimit = (limit: number, windowMs: number) => (req: NextRequest): NextResponse | null => {
  if (process.env.RATE_LIMIT_ENABLED === "false") return null;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();
  const entry = cache.get(key);
  if (!entry || now > entry.resetAt) { cache.set(key, { count: 1, resetAt: now + windowMs }); return null; }
  if (entry.count >= limit) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  entry.count++;
  return null;
};
