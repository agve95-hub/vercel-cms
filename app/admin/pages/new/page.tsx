"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
export default function NewPage() {
  const router = useRouter();
  const [title, setTitle] = useState(""); const [slug, setSlug] = useState(""); const [blocks, setBlocks] = useState("[]"); const [status, setStatus] = useState("draft"); const [saving, setSaving] = useState(false);
  const autoSlug = (t:string) => t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const handleSave = async () => { setSaving(true); const r = await fetch("/api/pages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,slug:slug||autoSlug(title),blocks,status})}); if(r.ok){const d=await r.json();router.push(`/admin/pages/${d.id}`);} setSaving(false); };
  return (<div><div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">New Page</h1><button onClick={handleSave} disabled={saving||!title} className="btn-primary"><Save size={16} className="mr-1.5"/>{saving?"Saving...":"Save"}</button></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 space-y-4"><div className="bg-white rounded-xl border p-5"><label className="label">Title</label><input value={title} onChange={e=>{setTitle(e.target.value);if(!slug)setSlug(autoSlug(e.target.value));}} className="input text-lg font-semibold" placeholder="Page title"/></div><div className="bg-white rounded-xl border p-5"><label className="label">Content Blocks (JSON)</label><textarea value={blocks} onChange={e=>setBlocks(e.target.value)} className="input font-mono text-xs" rows={12}/></div></div>
    <div className="space-y-4"><div className="bg-white rounded-xl border p-5"><label className="label">Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} className="input" placeholder="page-slug"/></div><div className="bg-white rounded-xl border p-5"><label className="label">Status</label><select value={status} onChange={e=>setStatus(e.target.value)} className="input"><option value="draft">Draft</option><option value="published">Published</option></select></div></div></div></div>);
}
