import RevealOnScroll from "./RevealOnScroll";

const benefits = [
  {
    title: (
      <>
        La plus <span className="italic font-bold text-[#1A7A6D]">fiable</span> et{" "}
        <span className="italic font-bold text-[#1A7A6D]">conforme</span>
      </>
    ),
    bullets: [
      "Factures conformes aux normes fiscales en vigueur",
      "Rétention client de 95% sur 12 mois",
      "Durée de vie client moyenne de 10+ ans",
      "Utilisée par des institutions premium dans plusieurs pays",
    ],
  },
  {
    title: (
      <>
        La plus <span className="italic font-bold text-[#1A7A6D]">expérimentée</span>
      </>
    ),
    bullets: [
      "Expertise approfondie en facturation et encaissement",
      "Solidité financière et scalabilité éprouvées",
      "Partenariats avec les principaux opérateurs de paiement",
      "Sécurité de niveau bancaire",
    ],
  },
  {
    title: (
      <>
        La plus <span className="italic font-bold text-[#1A7A6D]">évolutive</span>
      </>
    ),
    bullets: [
      "Infrastructure multi-pays et multi-devises",
      "Architecture cloud robuste et rapide",
      "Encaissement et décaissement simultanés",
      "API ouverte pour intégration sur mesure",
    ],
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-4">
            Nos avantages
          </p>
          <h2 className="text-3xl sm:text-[42px] font-bold leading-tight tracking-tight text-[#111827] font-literata">
            Pourquoi choisir{" "}
            <span className="italic text-[#1A7A6D]">Faktura</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <RevealOnScroll key={i} delay={i * 120}>
              <div className="p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <h3 className="text-xl font-bold text-[#111827] mb-5 leading-snug">
                  {benefit.title}
                </h3>
                <ul className="space-y-3 flex-1">
                  {benefit.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-[14px] text-[#6B7280]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1A7A6D] shrink-0 animate-pulse" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <a
                  href="#tarifs"
                  className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A7A6D] hover:text-[#146358] transition-colors"
                >
                  En savoir plus
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
