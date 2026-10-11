import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Literata } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  weight: ["500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FAKTURA — Facturation moderne & intelligente pour entrepreneurs ouest-africains",
  description:
    "Générez des factures professionnelles conformes UEMOA en quelques clics. Calcul TVA 18% automatique, paiements TMoney & Flooz intégrés. Solution SaaS en FCFA.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${jakarta.variable} ${literata.variable}`}>
      {children}
    </div>
  );
}
