import { db, schema } from "@/lib/db";
import { like, or, sql } from "drizzle-orm";
export const searchContent = async (query: string) => {
  const p = `%${query}%`;
  const pages = await db.select({ entityType: sql<string>`'page'`, entityId: schema.pages.id, title: schema.pages.title }).from(schema.pages).where(or(like(schema.pages.title, p), like(schema.pages.blocks, p))).limit(10);
  const posts = await db.select({ entityType: sql<string>`'post'`, entityId: schema.posts.id, title: schema.posts.title }).from(schema.posts).where(or(like(schema.posts.title, p), like(schema.posts.blocks, p))).limit(10);
  const med = await db.select({ entityType: sql<string>`'media'`, entityId: schema.media.id, title: schema.media.filename }).from(schema.media).where(or(like(schema.media.filename, p), like(schema.media.altText, p))).limit(10);
  return [...pages, ...posts, ...med];
};
export const indexContent = () => {};
