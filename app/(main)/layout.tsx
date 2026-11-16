"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPortal = pathname === "/portal";

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] text-[#1d2939]">
      <aside className="flex w-[248px] shrink-0 flex-col bg-[#182230] px-4 py-6 text-slate-400">
        <div className="mb-12 flex items-center gap-3 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f26757] text-xl font-bold text-white">+</div>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">helpdesk<span className="text-[#f26757]">.</span></span>
        </div>
        <nav className="space-y-2" aria-label="Main navigation">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          <Link href="/dashboard" className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${!isPortal ? "bg-[#263547] font-medium text-white" : "hover:bg-[#223043] hover:text-white"}`}><Icon name="grid" />Dashboard</Link>
          <Link href="/portal" className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${isPortal ? "bg-[#263547] font-medium text-white" : "hover:bg-[#223043] hover:text-white"}`}><Icon name="ticket" />Submit a ticket</Link>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#223043] hover:text-white"><Icon name="users" />My requests</button>
        </nav>
        <div className="mt-auto space-y-2 border-t border-slate-700/60 pt-5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#223043] hover:text-white"><Icon name="settings" />Settings</button>
          <div className="mt-5 flex items-center gap-3 px-3 pt-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9c6a9] text-xs font-bold text-[#9c4c34]">AM</div>
            <div><p className="text-xs font-medium text-white">Alex Morgan</p><p className="text-[11px] text-slate-500">IT Administrator</p></div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e7e9ed] bg-white px-8 lg:px-12">
          <div className="flex items-center gap-3"><span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a2aab5]">IT SUPPORT</span><span className="text-[#d5d9de]">/</span><span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#263547]">{isPortal ? "PORTAL" : "DASHBOARD"}</span></div>
          <button aria-label="Notifications" className="relative rounded-lg p-2 text-[#7b8795] hover:bg-slate-50"><Icon name="bell" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#f26757]" /></button>
        </header>
        {children}
      </main>
    </div>
  );
}
