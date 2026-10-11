"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useRateLimit } from "@/lib/use-rate-limit";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = getSupabase();
  const { isLocked, remainingMinutes, recordFailure, reset } = useRateLimit("forgot-password", 5, 15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      recordFailure();
      setError(error.message);
      setLoading(false);
      return;
    }

    reset();
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-card rounded-2xl shadow-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-semibold text-heading mb-2">
            Email envoyé
          </h2>
          <p className="text-sm text-body mb-4">
            Si un compte existe avec l&apos;adresse <strong className="text-heading">{email}</strong>,
            vous recevrez un lien de réinitialisation.
          </p>
          <p className="text-xs text-muted mb-6">
            Vérifiez vos spams si vous ne trouvez pas l&apos;email.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-brand-500 font-medium hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="text-center mb-8">
        <Link href="/" className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4 hover:bg-brand-600 transition-colors">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-heading">Mot de passe oublié</h1>
        <p className="text-sm text-body mt-1">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-status-overdue-bg text-status-overdue text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {isLocked && (
            <div className="bg-status-overdue-bg text-status-overdue text-sm rounded-lg px-4 py-3">
              Trop de tentatives. Réessayez dans {remainingMinutes} minute{remainingMinutes > 1 ? "s" : ""}.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              disabled={isLocked}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Envoi...
              </>
            ) : (
              "Envoyer le lien"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-brand-500 font-medium hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
