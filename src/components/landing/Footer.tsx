import Link from "next/link";

const footerLinks = {
  Produit: [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "Témoignages", href: "#temoignages" },
  ],
  Entreprise: [
    { label: "À propos", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carrières", href: "#" },
    { label: "Contact", href: "mailto:support@faktura.io" },
  ],
  Légal: [
    { label: "Conditions d'utilisation", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "Mentions légales", href: "#" },
    { label: "CGV", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#1A7A6D] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="white" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Faktura
              </span>
            </div>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-sm mb-5">
              Facturation moderne et intelligente pour les entrepreneurs
              ouest-africains. Conforme aux normes UEMOA, OHADA et DGI.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium text-white/60">
              <span className="w-2 h-2 rounded-full bg-[#1A7A6D]" />
              Conforme UEMOA • OHADA • DGI Togo
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a href={link.href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/30">
          <p>© {new Date().getFullYear()} Faktura. Tous droits réservés.</p>
          <p>Plateforme enregistrée au Togo • Support : <a href="tel:+22890001234" className="hover:text-white/60 transition-colors">+228 90 00 12 34</a> • <a href="mailto:support@faktura.io" className="hover:text-white/60 transition-colors">support@faktura.io</a></p>
        </div>
      </div>
    </footer>
  );
}
