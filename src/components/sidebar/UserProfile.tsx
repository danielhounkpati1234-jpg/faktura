"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { useAuth } from "@/lib/auth-context";

export default function UserProfile() {
  const { profile } = useAppStore();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials =
    (profile.firstName[0] || "") + (profile.lastName[0] || "");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sidebar-hover transition-colors duration-200"
      >
        <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-sm font-semibold shrink-0">
          {initials.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-heading truncate">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-xs text-muted truncate">{profile.email}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-1 bg-card border border-gray-200 rounded-lg shadow-lg z-20 py-1 animate-fade-in">
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-status-overdue hover:bg-status-overdue-bg transition-colors duration-200"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
