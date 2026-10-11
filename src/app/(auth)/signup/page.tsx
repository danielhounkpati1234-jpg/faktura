"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Check, Mail } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useRateLimit } from "@/lib/use-rate-limit";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<"confirmed" | "pending" | null>(null);
  const router = useRouter();
  const supabase = getSupabase();
  const { isLocked, remainingMinutes, recordFailure, reset } = useRateLimit("signup", 5, 15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      recordFailure();
      setError(
        error.message === "Database error saving new user"
          ? "Erreur lors de la création du compte. Veuillez réessayer."
          : error.message
      );
      setLoading(false);
      return;
    }

    reset();
    setLoading(false);

    if (data.session) {
      setSuccess("confirmed");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setSuccess("pending");
    }
  };

  if (success === "confirmed") {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-card rounded-2xl shadow-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-status-paid/10 text-status-paid flex items-center justify-center mx-auto mb-4">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-semibold text-heading mb-2">
            Compte créé !
          </h2>
          <p className="text-sm text-body">
            Votre compte a été créé avec succès. Redirection vers le tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  if (success === "pending") {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-card rounded-2xl shadow-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-semibold text-heading mb-2">
            Vérifiez votre email
          </h2>
          <p className="text-sm text-body mb-4">
            Un email de confirmation a été envoyé à <strong className="text-heading">{email}</strong>. Cliquez sur le lien dans l&apos;email pour activer votre compte.
          </p>
          <p className="text-xs text-muted">
            Vous ne l&apos;avez pas reçu ? Vérifiez vos spams ou{" "}
            <button
              onClick={() => setSuccess(null)}
              className="text-brand-500 font-medium hover:text-brand-600 transition-colors"
            >
              réessayez
            </button>
          </p>
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
        <h1 className="text-2xl font-bold text-heading">Créer un compte</h1>
        <p className="text-sm text-body mt-1">
          Commencez à facturer en quelques minutes
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Daniel"
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Hounkpati"
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent"
              />
            </div>
          </div>

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
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Mot de passe
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

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Création...
              </>
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-body">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-brand-500 font-medium hover:text-brand-600 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
