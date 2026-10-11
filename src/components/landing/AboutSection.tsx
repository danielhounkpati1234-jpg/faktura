import RevealOnScroll from "./RevealOnScroll";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Factures conformes et professionnelles",
    description:
      "Générez des factures avec toutes les mentions légales requises. Votre identité visuelle, vos coordonnées et vos références fiscales intégrées automatiquement.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.504-6h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.498-6h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM6.75 21v-4.5m0 0h10.5m-10.5 0V6.75a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25v9.75" />
      </svg>
    ),
    title: "Calculs automatiques",
    description:
      "Sous-totaux, taxes et montants TTC se calculent en temps réel. Plus d'erreurs manuelles ni de formules approximatives.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18v-.008zm-12 0h.008v.008H6v-.008z" />
      </svg>
    ),
    title: "Encaissement simplifié",
    description:
      "Vos clients reçoivent un lien de paiement et règlent directement depuis leur téléphone. Le statut de la facture se met à jour automatiquement.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white" id="fonctionnalites">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-4">
            Pourquoi Faktura
          </p>
          <h2 className="text-3xl sm:text-[42px] font-bold leading-tight tracking-tight text-[#111827] font-literata">
            Tout ce qu&apos;il faut pour facturer{" "}
            <span className="italic text-[#1A7A6D]">sereinement</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <RevealOnScroll key={feature.title} delay={i * 120}>
              <div className="p-8 rounded-2xl border border-[#F3F4F6] hover:border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all h-full group">
                <div className="w-12 h-12 rounded-xl bg-[#EDF5F3] text-[#1A7A6D] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300" style={{ animation: "icon-float 3s ease-in-out infinite", animationDelay: `${i * 0.4}s` }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
