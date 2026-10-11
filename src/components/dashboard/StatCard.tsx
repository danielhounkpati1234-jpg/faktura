import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  index?: number;
}

export default function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  index = 0,
}: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div
      className={`group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 ease-out p-6 hover:-translate-y-0.5 animate-fade-in-up stagger-${index + 1}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <p className="text-[13px] text-muted font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-heading tracking-tight mb-3">{value}</p>
      <div className="flex items-center gap-1.5">
        <div
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium ${
            isPositive
              ? "text-status-paid bg-status-paid-bg"
              : "text-status-overdue bg-status-overdue-bg"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </div>
        <span className="text-[11px] text-muted">{changeLabel}</span>
      </div>
    </div>
  );
}
