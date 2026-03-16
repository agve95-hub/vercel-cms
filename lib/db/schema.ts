import { mysqlTable, varchar, text, int, boolean, datetime, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

const id = () => varchar("id", { length: 36 }).primaryKey();
const ts = () => datetime("created_at").default(sql`NOW()`);
const up = () => datetime("updated_at").default(sql`NOW()`);

export const users = mysqlTable("users", {
  id: id(), email: varchar("email",{length:255}).notNull().unique(),
  passwordHash: varchar("password_hash",{length:255}), name: varchar("name",{length:255}).notNull(),
  role: mysqlEnum("role",["admin","editor"]).notNull().default("editor"),
  avatarUrl: text("avatar_url"), oauthProvider: varchar("oauth_provider",{length:50}),
  oauthId: varchar("oauth_id",{length:255}), createdAt: ts(), updatedAt: up(),
});

export const pages = mysqlTable("pages", {
  id: id(), title: varchar("title",{length:500}).notNull(), slug: varchar("slug",{length:500}).notNull().unique(),
  parentId: varchar("parent_id",{length:36}), template: varchar("template",{length:100}),
  blocks: text("blocks").notNull().default("[]"),
  status: mysqlEnum("status",["draft","published","archived","trashed"]).notNull().default("draft"),
  publishAt: datetime("publish_at"), seoTitle: varchar("seo_title",{length:200}),
  seoDescription: text("seo_description"), seoOgImage: text("seo_og_image"),
  canonicalUrl: text("canonical_url"), robots: varchar("robots",{length:100}).default("index,follow"),
  autoSaveBlocks: text("auto_save_blocks"), autoSaveAt: datetime("auto_save_at"),
  createdBy: varchar("created_by",{length:36}), createdAt: ts(), updatedAt: up(),
});

export const posts = mysqlTable("posts", {
  id: id(), title: varchar("title",{length:500}).notNull(), slug: varchar("slug",{length:500}).notNull().unique(),
  blocks: text("blocks").notNull().default("[]"), excerpt: text("excerpt"),
  featuredImage: varchar("featured_image",{length:36}),
  status: mysqlEnum("status",["draft","published","archived","trashed"]).notNull().default("draft"),
  publishAt: datetime("publish_at"), seoTitle: varchar("seo_title",{length:200}),
  seoDescription: text("seo_description"), seoOgImage: text("seo_og_image"),
  canonicalUrl: text("canonical_url"), robots: varchar("robots",{length:100}).default("index,follow"),
  autoSaveBlocks: text("auto_save_blocks"), autoSaveAt: datetime("auto_save_at"),
  createdBy: varchar("created_by",{length:36}), createdAt: ts(), updatedAt: up(),
});

export const categories = mysqlTable("categories", {
  id: id(), name: varchar("name",{length:255}).notNull(), slug: varchar("slug",{length:255}).notNull().unique(), description: text("description"),
});

export const tags = mysqlTable("tags", {
  id: id(), name: varchar("name",{length:255}).notNull(), slug: varchar("slug",{length:255}).notNull().unique(),
});

export const postCategories = mysqlTable("post_categories", {
  postId: varchar("post_id",{length:36}).notNull(), categoryId: varchar("category_id",{length:36}).notNull(),
});

export const postTags = mysqlTable("post_tags", {
  postId: varchar("post_id",{length:36}).notNull(), tagId: varchar("tag_id",{length:36}).notNull(),
});

export const media = mysqlTable("media", {
  id: id(), filename: varchar("filename",{length:500}).notNull(), filepath: varchar("filepath",{length:1000}).notNull(),
  mimetype: varchar("mimetype",{length:100}).notNull(), sizeBytes: int("size_bytes").notNull(),
  width: int("width"), height: int("height"), altText: text("alt_text"), variants: text("variants"),
  uploadedBy: varchar("uploaded_by",{length:36}), createdAt: ts(), updatedAt: up(),
});

export const navigationMenus = mysqlTable("navigation_menus", {
  id: id(), name: varchar("name",{length:100}).notNull(), items: text("items").notNull().default("[]"), updatedAt: up(),
});

export const formSubmissions = mysqlTable("form_submissions", {
  id: id(), formName: varchar("form_name",{length:100}).notNull(), data: text("data").notNull(),
  pageId: varchar("page_id",{length:36}), ipAddress: varchar("ip_address",{length:45}),
  read: boolean("is_read").default(false), createdAt: ts(), updatedAt: up(),
});

export const activityLog = mysqlTable("activity_log", {
  id: id(), userId: varchar("user_id",{length:36}), action: varchar("action",{length:50}).notNull(),
  entityType: varchar("entity_type",{length:50}).notNull(), entityId: varchar("entity_id",{length:36}).notNull(),
  entityTitle: varchar("entity_title",{length:500}), details: text("details"), createdAt: ts(),
});

export const siteSettings = mysqlTable("site_settings", {
  key: varchar("setting_key",{length:255}).primaryKey(), value: text("setting_value").notNull(),
});

export const redirects = mysqlTable("redirects", {
  id: id(), sourcePath: varchar("source_path",{length:500}).notNull().unique(),
  destination: varchar("destination",{length:500}).notNull(), type: int("type").notNull().default(301),
  hits: int("hits").notNull().default(0), createdBy: varchar("created_by",{length:36}), createdAt: ts(), updatedAt: up(),
});

export const contentLocks = mysqlTable("content_locks", {
  id: id(), entityType: varchar("entity_type",{length:50}).notNull(), entityId: varchar("entity_id",{length:36}).notNull(),
  userId: varchar("user_id",{length:36}).notNull(), lockedAt: ts(), expiresAt: datetime("expires_at").notNull(),
});

export const importJobs = mysqlTable("import_jobs", {
  id: id(), source: mysqlEnum("source",["wordpress","github"]).notNull(),
  status: mysqlEnum("import_status",["pending","processing","completed","failed"]).notNull().default("pending"),
  filePath: text("file_path"), summary: text("summary"), startedBy: varchar("started_by",{length:36}),
  startedAt: ts(), completedAt: datetime("completed_at"),
});

export const loginAttempts = mysqlTable("login_attempts", {
  id: id(), email: varchar("email",{length:255}).notNull(), ipAddress: varchar("ip_address",{length:45}).notNull(),
  userAgent: text("user_agent"), success: boolean("success").notNull(), createdAt: ts(), lockoutUntil: datetime("lockout_until"),
});
