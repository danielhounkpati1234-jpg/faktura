"use client";

import StatsGrid from "@/components/dashboard/StatsGrid";
import InvoicesTable from "@/components/dashboard/InvoicesTable";
import { useAppStore } from "@/lib/app-store";
import { useAuth } from "@/lib/auth-context";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  const { profile, loading } = useAppStore();
  const { user } = useAuth();

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "";

  if (loading) return <DashboardLoading />;

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-heading tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted mt-1.5">
          Bienvenue{displayName ? `, ${displayName}` : ""} ! Voici un aperçu de votre activité.
        </p>
      </div>

      <StatsGrid />

      <div className="mt-7">
        <InvoicesTable />
      </div>
    </>
  );
}
