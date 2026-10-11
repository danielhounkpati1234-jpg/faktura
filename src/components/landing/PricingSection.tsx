import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

const plans = [
  {
    tier: "Découverte",
    name: "Gratuit",
    price: "0",
    period: "Pour toujours",
    description: "Idéal pour démarrer en tant qu'indépendant.",
    features: [
      "5 factures par mois",
      "1 utilisateur",
      "Calcul TVA automatique",
      "Export PDF standard",
    ],
    excluded: ["Paiements Mobile Money intégrés"],
    cta: "Commencer gratuitement",
    featured: false,
  },
  {
    tier: "Populaire",
    name: "Pro",
    price: "5 000",
    period: "par mois",
    description: "Pour les consultants et PME en croissance.",
    features: [
      "Factures & devis illimités",
      "Paiements Mobile Money intégrés",
      "Logo et marque personnalisés",
      "Calcul TVA automatique",
      "Envoi WhatsApp & Email",
      "Export comptable en 1 clic",
    ],
    excluded: [],
    cta: "Essai gratuit 14 jours",
    subCta: "Sans carte bancaire",
    featured: true,
  },
  {
    tier: "Entreprises",
    name: "Business",
    price: "15 000",
    period: "par mois",
    description: "Pour les équipes multi-collaborateurs.",
    features: [
      "Factures & devis illimités",
      "Jusqu'à 10 utilisateurs",
      "Multi-devises",
      "Intégrations API & banques",
      "Support prioritaire 24/7",
    ],
    excluded: [],
    cta: "Choisir Business",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 bg-white" id="tarifs">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-4">
            Tarifs simples
          </p>
          <h2 className="text-3xl sm:text-[42px] font-bold leading-tight tracking-tight text-[#111827] font-literata">
            Des forfaits <span className="italic text-[#1A7A6D]">simples</span> et
            sans engagement
          </h2>
          <p className="mt-4 text-[16px] text-[#6B7280]">
            Payez par Mobile Money ou carte bancaire.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <RevealOnScroll key={plan.name} delay={i * 120}>
              <div
                className={`rounded-2xl p-8 flex flex-col justify-between h-full relative ${
                  plan.featured
                    ? "bg-[#111827] text-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] lg:-translate-y-3"
                    : "bg-white border border-[#E5E7EB]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1A7A6D] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    ★ Le plus populaire
                  </div>
                )}

                <div>
                  <p
                    className={`text-[12px] font-semibold uppercase tracking-wider ${
                      plan.featured ? "text-[#9CA3AF]" : "text-[#9CA3AF]"
                    }`}
                  >
                    {plan.tier}
                  </p>
                  <h3
                    className={`text-2xl font-extrabold mt-1 ${
                      plan.featured ? "text-white" : "text-[#111827]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-[13px] mt-1 ${
                      plan.featured ? "text-white/60" : "text-[#9CA3AF]"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-6 mb-6">
                    <span
                      className={`text-4xl font-extrabold ${
                        plan.featured ? "text-white" : "text-[#111827]"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-lg font-bold ml-1 ${
                        plan.featured ? "text-[#1A7A6D]" : "text-[#1A7A6D]"
                      }`}
                    >
                      FCFA
                    </span>
                    <span
                      className={`block text-[12px] mt-1 ${
                        plan.featured ? "text-white/50" : "text-[#9CA3AF]"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <ul
                    className={`space-y-3 text-[13px] border-t pt-6 ${
                      plan.featured
                        ? "text-white/90 border-white/10"
                        : "text-[#374151] border-[#F3F4F6]"
                    }`}
                  >
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <svg
                          className={`w-4 h-4 shrink-0 ${
                            plan.featured ? "text-[#1A7A6D]" : "text-[#1A7A6D]"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                    {plan.excluded.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[#D1D5DB]">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/signup"
                    className={`block text-center w-full py-3.5 rounded-full font-semibold text-[14px] transition-colors ${
                      plan.featured
                        ? "bg-[#1A7A6D] text-white hover:bg-[#146358]"
                        : "border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  {plan.subCta && (
                    <p className="text-center text-[11px] text-white/40 mt-2">
                      {plan.subCta}
                    </p>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <p className="mt-10 text-center text-[12px] text-[#9CA3AF]">
          Paiements sécurisés via Mobile Money et carte bancaire
        </p>
      </div>
    </section>
  );
}
