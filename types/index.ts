export type ContentStatus = "draft" | "published" | "archived" | "trashed";
export type UserRole = "admin" | "editor";
export interface Block { id: string; type: string; data: Record<string, any>; order: number; }
export interface MenuItem { id: string; label: string; url: string; children?: MenuItem[]; }
