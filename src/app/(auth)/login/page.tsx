"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useRateLimit } from "@/lib/use-rate-limit";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabase();
  const { isLocked, remainingMinutes, recordFailure, reset } = useRateLimit("login", 5, 15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      recordFailure();
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : error.message
      );
      setLoading(false);
      return;
    }

    reset();
    router.push("/dashboard");
  };

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
        <h1 className="text-2xl font-bold text-heading">Connexion</h1>
        <p className="text-sm text-body mt-1">
          Accédez à votre espace Faktura
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-heading">
                Mot de passe
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-500 font-medium hover:text-brand-600 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLocked}
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-body">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="text-brand-500 font-medium hover:text-brand-600 transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
