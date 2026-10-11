import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1A7A6D]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#1A7A6D]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#1A7A6D]/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-[#1A7A6D] rounded-xl flex items-center justify-center shadow-lg group-hover:bg-[#146358] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="white" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Faktura
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Facturez en toute
            <br />
            <span className="italic text-[#1A7A6D]">simplicité.</span>
          </h2>
          <p className="text-[15px] text-white/50 leading-relaxed">
            Créez des factures professionnelles, automatisez vos calculs et
            suivez vos paiements — le tout depuis une seule plateforme.
          </p>

          <div className="mt-12 flex items-center justify-center gap-8">
            <div>
              <div className="text-2xl font-extrabold text-white">10 000+</div>
              <div className="text-[11px] text-white/40 font-medium mt-0.5">Factures créées</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-2xl font-extrabold text-white">98%</div>
              <div className="text-[11px] text-white/40 font-medium mt-0.5">Satisfaction</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-2xl font-extrabold text-white">2 min</div>
              <div className="text-[11px] text-white/40 font-medium mt-0.5">Pour facturer</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 bg-white min-h-screen">
        {children}
      </div>
    </div>
  );
}
