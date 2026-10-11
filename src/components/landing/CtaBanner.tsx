import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function CtaBanner() {
  return (
    <section className="py-16 bg-[#1A7A6D]">
      <RevealOnScroll className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-literata leading-snug">
              Digitalisez votre facturation
              <br />
              et vos encaissements dès aujourd&apos;hui
            </h2>
            <p className="mt-3 text-white/80 text-[15px]">
              Rejoignez des milliers d&apos;entrepreneurs qui facturent avec
              Faktura.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-[#111827] px-8 py-4 rounded-full text-[15px] font-bold hover:bg-[#F9FAFB] transition-colors"
          >
            Démarrer gratuitement
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </RevealOnScroll>
    </section>
  );
}
