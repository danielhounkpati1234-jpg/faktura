"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-body hover:bg-sidebar-hover hover:text-heading transition-colors w-full"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
      <span className="flex-1 text-left">Mode sombre</span>
      <div
        className={`w-10 h-[22px] rounded-full relative transition-colors ${
          isDark ? "bg-brand-500" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-[22px]" : "translate-x-[3px]"
          }`}
        />
      </div>
    </button>
  );
}
