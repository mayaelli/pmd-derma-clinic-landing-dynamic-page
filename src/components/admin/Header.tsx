"use client";

import { LayoutDashboard, AlertTriangle, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  statusMessage: string | null;
  statusType: "success" | "error";
}

export function Header({ activeTab, statusMessage, statusType }: HeaderProps) {
  return (
    <header className="px-4 sm:px-6 py-3.5 bg-white/80 backdrop-blur-md border-b border-[#F2ECE4] flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4 text-[#E48EAB]" />
        <span className="text-xs font-bold text-[#333D29] capitalize">{activeTab} Management</span>
      </div>
      {statusMessage && (
        <div className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full shadow-xs border ${statusType === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-[#FFF0F4] border-[#F8BFC5] text-[#E48EAB]"
          }`}>
          {statusType === "error" ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E48EAB] shrink-0" />
          )}
          <span className="truncate">{statusMessage}</span>
        </div>
      )}
    </header>
  );
}