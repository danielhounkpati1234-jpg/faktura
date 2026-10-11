import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

const stats = [
  { value: "10 000+", label: "Factures créées" },
  { value: "98%", label: "Satisfaction" },
  { value: "2 min", label: "Pour facturer" },
];

export default function HeroSection() {
  return (
    <section className="pt-20 pb-24 lg:pt-32 lg:pb-36 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <RevealOnScroll>
          <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.06] tracking-tight text-[#111827] font-literata">
            Créez, envoyez et
            <br />
            <span className="italic text-[#1A7A6D]">encaissez</span> vos factures.
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={160}>
          <p className="mt-7 text-[17px] sm:text-[19px] text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
            Générez des factures professionnelles en quelques clics. Automatisez
            vos calculs et suivez vos paiements en temps réel.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={240}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#111827] text-white px-8 py-4 rounded-full text-[15px] font-semibold hover:bg-black transition-colors"
            >
              Commencer gratuitement
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={320}>
          <div className="mt-14 flex items-center justify-center gap-10 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                  {stat.value}
                </div>
                <div className="text-[13px] text-[#9CA3AF] font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
