import Link from "next/link";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
          <FileQuestion size={40} className="text-brand-500" />
        </div>

        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-2">
          Erreur 404
        </p>
        <h1 className="text-3xl font-bold text-heading mb-3">
          Page introuvable
        </h1>
        <p className="text-body text-sm leading-relaxed mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
          Vérifiez l&apos;URL ou retournez à l&apos;accueil.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            <Home size={16} />
            Retour au tableau de bord
          </Link>
          <Link
            href="/invoices"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Voir les factures
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100">
          <p className="text-xs text-muted">
            Faktura — Facturation simplifiée pour l&apos;Afrique de l&apos;Ouest
          </p>
        </div>
      </div>
    </div>
  );
}
