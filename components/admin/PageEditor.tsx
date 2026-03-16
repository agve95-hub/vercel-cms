"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Eye, Monitor, Tablet, Smartphone } from "lucide-react";

export const PageEditor = ({ page }: { page: any }) => {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [blocks, setBlocks] = useState(page.blocks);
  const [status, setStatus] = useState(page.status);
  const [seoTitle, setSeoTitle] = useState(page.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(page.seoDescription || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [device, setDevice] = useState("desktop");

  useEffect(() => { setSaved(false); }, [title, slug, blocks, status, seoTitle, seoDesc]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey||e.ctrlKey)&&e.key==="s") { e.preventDefault(); handleSave(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  });

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/pages/${page.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, slug, blocks, status, seoTitle: seoTitle||null, seoDescription: seoDesc||null }) });
    if (res.ok) setSaved(true);
    setSaving(false);
  };
  const handleDelete = async () => { if (!confirm("Move to trash?")) return; await fetch(`/api/pages/${page.id}`, { method: "DELETE" }); router.push("/admin/pages"); };
  const widths: Record<string,string> = { desktop:"100%", tablet:"768px", mobile:"375px" };

  return (<div>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-gray-900">Edit Page</h1><span className={`text-xs px-2 py-0.5 rounded-full ${saved?"bg-green-50 text-green-600":"bg-yellow-50 text-yellow-600"}`}>{saving?"Saving...":saved?"Saved":"Unsaved"}</span></div>
      <div className="flex gap-2"><button onClick={()=>setShowPreview(!showPreview)} className="btn-secondary"><Eye size={16} className="mr-1.5"/>Preview</button><button onClick={handleDelete} className="btn-danger"><Trash2 size={16}/></button><button onClick={handleSave} disabled={saving} className="btn-primary"><Save size={16} className="mr-1.5"/>Save</button></div>
    </div>
    {showPreview && <div className="mb-6 bg-white rounded-xl border overflow-hidden"><div className="flex items-center gap-2 p-3 border-b bg-gray-50"><button onClick={()=>setDevice("desktop")} className={`p-1.5 rounded ${device==="desktop"?"bg-white shadow-sm":""}`}><Monitor size={16}/></button><button onClick={()=>setDevice("tablet")} className={`p-1.5 rounded ${device==="tablet"?"bg-white shadow-sm":""}`}><Tablet size={16}/></button><button onClick={()=>setDevice("mobile")} className={`p-1.5 rounded ${device==="mobile"?"bg-white shadow-sm":""}`}><Smartphone size={16}/></button></div><div className="flex justify-center p-4 bg-gray-100"><iframe src={`/${slug}`} style={{width:widths[device],height:"500px"}} className="bg-white border rounded"/></div></div>}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border p-5"><label className="label">Title</label><input value={title} onChange={e=>setTitle(e.target.value)} className="input text-lg font-semibold"/></div>
        <div className="bg-white rounded-xl border p-5"><label className="label">Content Blocks (JSON)</label><textarea value={blocks} onChange={e=>setBlocks(e.target.value)} className="input font-mono text-xs" rows={16}/><p className="text-xs text-gray-400 mt-2">Visual block editor coming soon. Edit JSON directly for now.</p></div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-xl border p-5"><label className="label">Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} className="input"/></div>
        <div className="bg-white rounded-xl border p-5"><label className="label">Status</label><select value={status} onChange={e=>setStatus(e.target.value)} className="input"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
        <div className="bg-white rounded-xl border p-5"><h3 className="font-medium text-gray-900 mb-3">SEO</h3><div className="space-y-3"><div><label className="label">SEO Title</label><input value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} className="input" maxLength={70}/><p className="text-xs text-gray-400 mt-1">{seoTitle.length}/70</p></div><div><label className="label">Meta Description</label><textarea value={seoDesc} onChange={e=>setSeoDesc(e.target.value)} className="input" rows={3} maxLength={160}/><p className="text-xs text-gray-400 mt-1">{seoDesc.length}/160</p></div></div></div>
      </div>
    </div>
  </div>);
};
