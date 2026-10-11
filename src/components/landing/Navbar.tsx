"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Témoignages", href: "#temoignages" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#e5e7eb]"
          : "bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-[#1A7A6D] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#146358] transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="white" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#111827]">
            Faktura
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#6B7280]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#111827] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-[14px] font-semibold text-[#374151] hover:text-[#111827] px-4 py-2 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex items-center gap-2 bg-[#111827] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-black transition-colors"
          >
            Créer mon compte
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F3F4F6] text-[#374151]"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] px-6 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[15px] font-medium text-[#374151] hover:text-[#111827]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col gap-3">
            <Link href="/login" className="block text-center py-3 text-[15px] font-semibold text-[#374151]">
              Connexion
            </Link>
            <Link href="/signup" className="block text-center py-3 bg-[#111827] text-white rounded-full font-semibold text-[15px]">
              Créer mon compte
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
