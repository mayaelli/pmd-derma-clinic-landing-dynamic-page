"use client";

import { useState } from "react";
import { ChevronRight, LogOut, LucideIcon, PanelLeftClose, PanelLeft, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type TabType = "bookings" | "services" | "promos" | "doctor" | "reviews" | "reels";

interface NavItem {
  id: TabType;
  name: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navigation: readonly NavItem[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
  navigation,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`
          bg-white border-r border-[#F2ECE4]
          flex flex-col h-full shrink-0
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "block" : "hidden"}
          md:flex
          ${sidebarCollapsed ? "md:w-0 md:overflow-hidden" : "w-72"}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="hidden md:flex p-6 border-b border-[#F2ECE4] items-center gap-3 sticky top-0 bg-white z-10">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/precious-md-rose-pink-logo.png"
                alt="Precious MD Logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg font-['Poppins'] text-[#333D29] tracking-tight">
                Precious MD Admin
              </h1>
              <p className="text-[11px] font-medium text-[#738285]">Management Portal</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#738285] uppercase">
              Content Modules
            </div>
            {navigation.map(({ id, name, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-[#CD9581] text-white shadow-md shadow-[#CD9581]/20"
                      : "text-[#556365] hover:bg-[#F3EFEA] hover:text-[#2D2B30]"
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

        {/* User card + logout button */}
        <div className="p-4 m-4 bg-[#F3EFEA] rounded-2xl border border-[#EBE5DC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#CD9581] text-white flex items-center justify-center font-bold text-xs">
              DR
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D2B30]">Dr. Administrator</p>
              <p className="text-[10px] text-[#738285]">Clinic Manager</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-[#738285] hover:text-[#E48EAB] p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Sidebar toggle ───────────────────────────────────────────────── */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`
          hidden md:flex
          fixed left-0 top-1/2 -translate-y-1/2 z-50
          bg-[#CD9581] hover:bg-[#B8846F] text-white
          p-2 rounded-r-xl shadow-lg
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "translate-x-0" : "translate-x-72"}
        `}
        title={sidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
      >
        {sidebarCollapsed ? (
          <PanelLeft className="w-5 h-5" />
        ) : (
          <PanelLeftClose className="w-5 h-5" />
        )}
      </button>

      {/* ── Logout confirmation modal ────────────────────────────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E8E2D9] w-full max-w-sm p-7 space-y-5">

            {loggingOut ? (
              /* ── Signing out state ────────────────────────────────────── */
              <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
                <div className="relative w-14 h-14">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#F2ECE4]" />
                  {/* Spinning arc */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C87D87] animate-spin" />
                  {/* Center logo */}
                  <div className="absolute inset-2 rounded-full bg-[#FCE8E6] flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-[#C87D87]" />
                  </div>
                </div>
                <div>
                  <p className="font-serif font-semibold text-sm text-[#1A1817]">Signing you out…</p>
                  <p className="text-xs text-[#706A63] mt-1">Clearing your session securely.</p>
                </div>
              </div>
            ) : (
              /* ── Confirmation state ───────────────────────────────────── */
              <>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-[#F5D5C8] flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-[#C87D87]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-base text-[#1A1817]">
                      Sign out of Admin?
                    </h3>
                    <p className="text-xs text-[#706A63] mt-1 leading-relaxed">
                      Your session will be cleared. You&apos;ll need to sign in again to access the dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-2.5 px-4 border border-[#E8E2D9] text-[#706A63] hover:bg-[#F7F4EF] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutConfirm}
                    className="flex-1 py-2.5 px-4 bg-[#C87D87] hover:bg-[#b8707a] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
