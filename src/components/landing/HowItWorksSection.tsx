import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    number: "01",
    title: "Inscription",
    description:
      "Créez votre profil entreprise en 60 secondes. Ajoutez votre logo et vos informations fiscales.",
  },
  {
    number: "02",
    title: "Création",
    description:
      "Éditez votre facture ou devis. Les taxes se calculent automatiquement, le total se met à jour en temps réel.",
  },
  {
    number: "03",
    title: "Envoi",
    description:
      "Envoyez la facture par e-mail ou messagerie en un clic. Votre client reçoit un document professionnel et conforme.",
  },
  {
    number: "04",
    title: "Encaissement",
    description:
      "Le client règle directement depuis le lien de paiement. La facture passe au vert automatiquement.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#FAFAFA]" id="comment-ca-marche">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-4">
            Comment ça marche
          </p>
          <h2 className="text-3xl sm:text-[42px] font-bold leading-tight tracking-tight text-[#111827] font-literata">
            Facturez et encaissez avec{" "}
            <span className="italic text-[#1A7A6D]">Faktura</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.number} delay={i * 100}>
              <div className="bg-white p-7 rounded-2xl border border-[#F3F4F6] h-full relative group hover:border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
                <div className="text-[40px] font-extrabold leading-none mb-4 font-literata text-[#F3F4F6] group-hover:text-[#1A7A6D]/20 transition-colors duration-500" style={{ animation: "icon-pulse-scale 4s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}>
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-[#D1D5DB]">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
