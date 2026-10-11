import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white border-t border-[#F3F4F6]">
      <RevealOnScroll className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-[48px] font-bold leading-tight tracking-tight text-[#111827] font-literata">
          Découvrez comment Faktura peut{" "}
          <span className="italic text-[#1A7A6D]">accélérer</span> votre
          activité
        </h2>
        <p className="mt-5 text-[16px] text-[#6B7280] max-w-xl mx-auto">
          Rejoignez les milliers d&apos;entrepreneurs qui ont transformé leur
          facturation et leur encaissement.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#1A7A6D] text-white px-8 py-4 rounded-full text-[15px] font-bold hover:bg-[#146358] transition-colors"
          >
            Démarrer gratuitement
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#374151] border border-[#D1D5DB] px-8 py-4 rounded-full text-[15px] font-semibold hover:bg-[#F9FAFB] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </RevealOnScroll>
    </section>
  );
}
