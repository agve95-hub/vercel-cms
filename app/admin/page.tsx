import { db, schema } from "@/lib/db";
import { eq, desc, count } from "drizzle-orm";
import Link from "next/link";
import { FileText, PenTool, Image, Inbox, Clock } from "lucide-react";
import { format } from "date-fns";
export default async function Dashboard() {
  const [{ count: pc }] = await db.select({ count: count() }).from(schema.pages);
  const [{ count: ptc }] = await db.select({ count: count() }).from(schema.posts);
  const [{ count: mc }] = await db.select({ count: count() }).from(schema.media);
  const [{ count: fc }] = await db.select({ count: count() }).from(schema.formSubmissions).where(eq(schema.formSubmissions.read, false));
  const activity = await db.select().from(schema.activityLog).orderBy(desc(schema.activityLog.createdAt)).limit(10);
  const drafts = await db.select().from(schema.pages).where(eq(schema.pages.status,"draft")).limit(5);
  const stats = [{l:"Pages",v:pc,i:FileText,h:"/admin/pages",c:"bg-blue-50 text-blue-700"},{l:"Posts",v:ptc,i:PenTool,h:"/admin/posts",c:"bg-green-50 text-green-700"},{l:"Media",v:mc,i:Image,h:"/admin/media",c:"bg-purple-50 text-purple-700"},{l:"Forms",v:fc,i:Inbox,h:"/admin/forms",c:"bg-amber-50 text-amber-700"}];
  return (<div><h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{stats.map(s=>(<Link key={s.l} href={s.h} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg ${s.c} flex items-center justify-center`}><s.i size={20}/></div><div><p className="text-2xl font-bold text-gray-900">{s.v}</p><p className="text-sm text-gray-500">{s.l}</p></div></div></Link>))}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border p-5"><h2 className="text-lg font-semibold mb-4">Recent Activity</h2>{activity.length===0?<p className="text-gray-500 text-sm">No activity yet.</p>:<div className="space-y-3">{activity.map(a=>(<div key={a.id} className="flex items-start gap-3 text-sm"><Clock size={14} className="text-gray-400 mt-1 shrink-0"/><div><span className="font-medium capitalize">{a.action}</span><span className="text-gray-500"> {a.entityType}: </span><span>{a.entityTitle}</span><p className="text-xs text-gray-400">{a.createdAt?format(new Date(a.createdAt),"MMM d, h:mm a"):""}</p></div></div>))}</div>}</div>
      <div className="bg-white rounded-xl border p-5"><h2 className="text-lg font-semibold mb-4">Drafts</h2>{drafts.length===0?<p className="text-gray-500 text-sm">No drafts.</p>:<div className="space-y-2">{drafts.map(d=>(<Link key={d.id} href={`/admin/pages/${d.id}`} className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-lg"><FileText size={14} className="text-gray-400"/><span>{d.title}</span></Link>))}</div>}</div>
    </div>
  </div>);
}
