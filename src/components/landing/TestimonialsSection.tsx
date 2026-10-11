import RevealOnScroll from "./RevealOnScroll";

const testimonials = [
  {
    quote:
      "Depuis que j'utilise Faktura, mes clients me paient via TMoney dans la journée. Fini les relances interminables sur WhatsApp.",
    name: "Koffi Kouassi",
    role: "Fondateur, Agence Kroma • Lomé",
    initials: "KK",
    bg: "bg-[#1A7A6D]",
  },
  {
    quote:
      "Nous avons conclu plus de 60 millions FCFA de contrats sans un seul rejet administratif. Les factures sont acceptées partout en zone UEMOA.",
    name: "Aïssata Bamba",
    role: "Directrice, Bamba Consulting • Abidjan",
    initials: "AB",
    bg: "bg-[#111827]",
  },
  {
    quote:
      "Un outil indispensable. Mon comptable reçoit l'export fiscal chaque mois avec le détail de la TVA collectée. C'est rentabilisé dès le premier client.",
    name: "Emmanuel Nkembe",
    role: "Gérant, MétalTech Solutions • Douala",
    initials: "EN",
    bg: "bg-[#6B7280]",
  },
  {
    quote:
      "La conformité OHADA était un cauchemar avant Faktura. Maintenant tout est automatique : NIF, RCCM, mentions obligatoires. Un gain de temps énorme.",
    name: "Darlene Robertson",
    role: "Comptable, Cabinet ACS • Cotonou",
    initials: "DR",
    bg: "bg-[#1A7A6D]",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#FAFAFA]" id="temoignages">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-4">
            Témoignages
          </p>
          <h2 className="text-3xl sm:text-[42px] font-bold leading-tight tracking-tight text-[#111827] font-literata">
            Ce que nos <span className="italic text-[#1A7A6D]">clients</span>
            <br />
            disent de nous
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 100}>
              <div className="bg-white p-8 rounded-2xl border border-[#F3F4F6] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all h-full flex flex-col justify-between">
                <p className="text-[15px] text-[#374151] leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-[#F3F4F6]">
                  <div
                    className={`w-10 h-10 rounded-full ${t.bg} text-white font-bold flex items-center justify-center text-[12px]`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-[#111827]">{t.name}</div>
                    <div className="text-[12px] text-[#9CA3AF]">{t.role}</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
