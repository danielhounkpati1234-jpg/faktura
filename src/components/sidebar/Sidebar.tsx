"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FileText,
  Users,
  HelpCircle,
  Settings,
  X,
} from "lucide-react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/app-store";
import SidebarNavItem from "./SidebarNavItem";
import UserProfile from "./UserProfile";
import DarkModeToggle from "./DarkModeToggle";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  FileText: <FileText size={20} />,
  Users: <Users size={20} />,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const { invoices } = useAppStore();

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-sidebar-bg border-r border-gray-100 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-heading tracking-tight">faktura</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-sidebar-hover text-muted"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="group flex items-center gap-2 px-3 py-2 bg-gray-50/80 rounded-lg border border-transparent text-sm text-muted cursor-pointer hover:bg-gray-100/80 hover:border-gray-200 focus-within:border-brand-300 focus-within:bg-card focus-within:shadow-soft transition-all duration-200">
            <Search size={15} className="text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
            <span className="group-hover:text-gray-500 transition-colors duration-200">Rechercher</span>
            <kbd className="ml-auto text-[10px] bg-card/80 border border-gray-200/60 rounded px-1.5 py-0.5 font-mono text-gray-400 group-hover:border-gray-200 transition-all duration-200">
              ⌘ F
            </kbd>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            Menu
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1 sidebar-scroll overflow-y-auto">
          {navItems.map((item) => {
            const badge = item.href === "/invoices" && invoices.length > 0
              ? invoices.length
              : item.badge;
            return (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                icon={iconMap[item.icon]}
                label={item.label}
                badge={badge}
                isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                onClick={onClose}
              />
            );
          })}
        </nav>

        <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
          <SidebarNavItem
            href="/help"
            icon={<HelpCircle size={20} />}
            label="Aide et support"
            isActive={pathname === "/help"}
          />
          <SidebarNavItem
            href="/settings"
            icon={<Settings size={20} />}
            label="Paramètres"
            isActive={pathname === "/settings"}
          />
          <DarkModeToggle />
        </div>

        <div className="border-t border-gray-100">
          <UserProfile />
        </div>
      </aside>
    </>
  );
}
