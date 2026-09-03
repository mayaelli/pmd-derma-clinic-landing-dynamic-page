"use client";

import { Sparkles, ChevronRight, LogOut, LucideIcon } from "lucide-react";

interface NavItem {
  id: "services" | "promos" | "feedback";
  name: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navigation: readonly NavItem[];
  activeTab: string;
  setActiveTab: (tab: "services" | "promos" | "feedback") => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ navigation, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  return (
    <aside className={`
      md:sticky md:top-0 md:h-screen md:overflow-y-auto
      w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-[#F2ECE4]
      flex flex-col justify-between shrink-0 z-10
      ${mobileMenuOpen ? "block" : "hidden md:flex"}
    `}>
      <div>
        <div className="hidden md:flex p-6 border-b border-[#F2ECE4] items-center gap-3">
          <div className="p-2.5 bg-[#FCE8E6] rounded-2xl text-[#C88482] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#333D29] tracking-tight">Precious MD Admin</h1>
            <p className="text-[11px] font-medium text-[#738285]">Management Portal</p>
          </div>
        </div>
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#738285] uppercase">Content Modules</div>
          {navigation.map(({ id, name, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive ? "bg-[#CD9581] text-white shadow-md shadow-[#CD9581]/20" : "text-[#556365] hover:bg-[#F3EFEA] hover:text-[#2D2B30]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#E48EAB]"}`} />
                  <span>{name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? "text-white opacity-75" : "text-[#8C958E]"}`} />
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-4 m-4 bg-[#F3EFEA] rounded-2xl border border-[#EBE5DC] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#CD9581] text-white flex items-center justify-center font-bold text-xs">DR</div>
          <div>
            <p className="text-xs font-bold text-[#2D2B30]">Dr. Administrator</p>
            <p className="text-[10px] text-[#738285]">Clinic Manager</p>
          </div>
        </div>
        <button className="text-[#738285] hover:text-[#E48EAB] p-1.5 rounded-lg hover:bg-white transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}