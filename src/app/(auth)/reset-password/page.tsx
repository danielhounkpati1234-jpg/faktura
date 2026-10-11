"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Check, ArrowLeft } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  if (success) {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-card rounded-2xl shadow-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-status-paid/10 text-status-paid flex items-center justify-center mx-auto mb-4">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-semibold text-heading mb-2">
            Mot de passe modifié
          </h2>
          <p className="text-sm text-body">
            Votre mot de passe a été mis à jour. Redirection...
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-card rounded-2xl shadow-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <Loader2 size={28} className="animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-heading mb-2">
            Vérification en cours...
          </h2>
          <p className="text-sm text-body mb-6">
            Veuillez patienter pendant la vérification de votre lien.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-brand-500 font-medium hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4">
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
        </div>
        <h1 className="text-2xl font-bold text-heading">Nouveau mot de passe</h1>
        <p className="text-sm text-body mt-1">
          Choisissez un nouveau mot de passe sécurisé
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-status-overdue-bg text-status-overdue text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retapez le mot de passe"
              required
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
