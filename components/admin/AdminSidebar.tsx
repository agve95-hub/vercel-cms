"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PenTool, Image, Menu, Inbox, ArrowLeftRight, Activity, Trash2, Settings, Search, LogOut, Upload } from "lucide-react";

const nav = [
  { label:"Dashboard", href:"/admin", icon:LayoutDashboard },
  { label:"Pages", href:"/admin/pages", icon:FileText },
  { label:"Posts", href:"/admin/posts", icon:PenTool },
  { label:"Media", href:"/admin/media", icon:Image },
  { label:"Menus", href:"/admin/menus", icon:Menu },
  { label:"Forms", href:"/admin/forms", icon:Inbox },
  { label:"Redirects", href:"/admin/redirects", icon:ArrowLeftRight },
  { label:"Activity", href:"/admin/activity", icon:Activity },
  { label:"Trash", href:"/admin/trash", icon:Trash2 },
  { label:"Import", href:"/admin/import/wordpress", icon:Upload },
  { label:"Settings", href:"/admin/settings", icon:Settings },
];

export const AdminSidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white hidden lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-sm">C</div>
        <span className="font-semibold text-sm">CMS Admin</span>
      </div>
      <div className="px-3 py-2"><Link href="/admin/search" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><Search size={16}/><span>Search...</span></Link></div>
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {nav.map(item => { const active = pathname===item.href||(item.href!=="/admin"&&pathname.startsWith(item.href)); return (
          <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${active?"bg-brand-600/20 text-brand-300 font-medium":"text-gray-400 hover:text-white hover:bg-gray-800"}`}><item.icon size={18}/>{item.label}</Link>
        );})}
      </nav>
      <div className="border-t border-gray-800 px-4 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium">{(user?.name||"U")[0]}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-200 truncate">{user?.name||user?.email}</p></div><Link href="/api/auth/signout" className="text-gray-500 hover:text-gray-300"><LogOut size={16}/></Link></div></div>
    </aside>
  );
};
