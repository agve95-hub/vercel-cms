import { db, schema } from "@/lib/db";
import { and, eq, gt } from "drizzle-orm";
import { v4 as uuid } from "uuid";
const LOCK_MS = 15*60*1000;
export const acquireLock = async (entityType: string, entityId: string, userId: string) => {
  const now = new Date();
  const expiresAt = new Date(Date.now() + LOCK_MS);
  const [existing] = await db.select().from(schema.contentLocks).where(and(eq(schema.contentLocks.entityType, entityType), eq(schema.contentLocks.entityId, entityId), gt(schema.contentLocks.expiresAt, now))).limit(1);
  if (existing && existing.userId !== userId) return { locked: true, lockedBy: existing.userId };
  if (existing) { await db.update(schema.contentLocks).set({ expiresAt }).where(eq(schema.contentLocks.id, existing.id)); }
  else { await db.insert(schema.contentLocks).values({ id: uuid(), entityType, entityId, userId, expiresAt }); }
  return { locked: false };
};
export const releaseLock = async (entityType: string, entityId: string, userId: string) => { await db.delete(schema.contentLocks).where(and(eq(schema.contentLocks.entityType, entityType), eq(schema.contentLocks.entityId, entityId), eq(schema.contentLocks.userId, userId))); };
export const renewLock = async (entityType: string, entityId: string, userId: string) => { await db.update(schema.contentLocks).set({ expiresAt: new Date(Date.now()+LOCK_MS) }).where(and(eq(schema.contentLocks.entityType, entityType), eq(schema.contentLocks.entityId, entityId), eq(schema.contentLocks.userId, userId))); };
