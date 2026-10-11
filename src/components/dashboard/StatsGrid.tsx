"use client";

import {
  TrendingUp,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { formatFCFA } from "@/lib/utils";
import StatCard from "./StatCard";

export default function StatsGrid() {
  const { invoices } = useAppStore();

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const sentCount = invoices.filter((inv) => inv.status === "sent").length;
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

  const computed = [
    {
      label: "Revenu total",
      value: formatFCFA(totalRevenue),
      change: 0,
      changeLabel: "ce mois",
      icon: <TrendingUp size={22} />,
    },
    {
      label: "Factures envoyées",
      value: String(sentCount),
      change: 0,
      changeLabel: "en attente",
      icon: <Send size={22} />,
    },
    {
      label: "Factures payées",
      value: String(paidCount),
      change: 0,
      changeLabel: "total",
      icon: <CheckCircle size={22} />,
    },
    {
      label: "En retard",
      value: String(overdueCount),
      change: 0,
      changeLabel: "à relancer",
      icon: <Clock size={22} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {computed.map((stat, i) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeLabel={stat.changeLabel}
          icon={stat.icon}
          index={i}
        />
      ))}
    </div>
  );
}
