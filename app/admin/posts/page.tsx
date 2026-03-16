import { db, schema } from "@/lib/db";
import { desc, ne } from "drizzle-orm";
import Link from "next/link";
import { Plus, PenTool } from "lucide-react";
import { format } from "date-fns";
export default async function PostsPage() {
  const posts = await db.select().from(schema.posts).where(ne(schema.posts.status,"trashed")).orderBy(desc(schema.posts.updatedAt));
  return (<div><div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">Posts</h1><Link href="/admin/posts/new" className="btn-primary"><Plus size={16} className="mr-1.5"/>New Post</Link></div>
    <div className="bg-white rounded-xl border overflow-hidden">{posts.length===0?<div className="p-12 text-center text-gray-500"><PenTool size={40} className="mx-auto mb-3 text-gray-300"/><p>No posts yet.</p></div>:<table className="w-full"><thead><tr className="border-b bg-gray-50"><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th></tr></thead><tbody className="divide-y">{posts.map(p=>(<tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3"><Link href={`/admin/posts/${p.id}`} className="font-medium hover:text-brand-600">{p.title}</Link></td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status==="published"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>{p.status}</span></td><td className="px-4 py-3 text-sm text-gray-400">{p.updatedAt?format(new Date(p.updatedAt),"MMM d, yyyy"):""}</td></tr>))}</tbody></table>}</div></div>);
}
