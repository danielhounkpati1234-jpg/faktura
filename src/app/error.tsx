"use client";

import { useEffect } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-status-overdue-bg flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-status-overdue" />
        </div>

        <p className="text-sm font-semibold text-status-overdue uppercase tracking-wider mb-2">
          Erreur
        </p>
        <h1 className="text-3xl font-bold text-heading mb-3">
          Quelque chose s&apos;est mal passé
        </h1>
        <p className="text-body text-sm leading-relaxed mb-8">
          Une erreur inattendue est survenue. Vous pouvez réessayer ou
          retourner au tableau de bord.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
          >
            <Home size={16} />
            Tableau de bord
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
