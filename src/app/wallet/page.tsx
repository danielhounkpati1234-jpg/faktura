"use client";

import {
  Landmark,
  Smartphone,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
} from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { formatFCFA, formatDate, cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  checking: <Landmark size={22} />,
  savings: <TrendingUp size={22} />,
};

export default function WalletPage() {
  const { walletAccounts, transactions } = useAppStore();
  const totalBalance = walletAccounts.reduce((sum, a) => sum + a.balance, 0);
  const recentTx = transactions.slice(0, 5);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Portefeuille</h1>
          <p className="text-sm text-muted mt-1">
            Gérez vos comptes et suivez vos soldes.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
          <Plus size={18} />
          Ajouter un compte
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8 mb-7 animate-fade-in-up">
        <p className="text-[13px] text-muted font-medium mb-1">Solde total</p>
        <p className="text-3xl font-bold text-heading tracking-tight">
          {formatFCFA(totalBalance)}
        </p>
        <p className="text-sm text-muted mt-2">
          Réparti sur {walletAccounts.length} comptes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {walletAccounts.map((account, i) => (
          <div
            key={account.id}
            className={`group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 ease-out p-6 hover:-translate-y-0.5 animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {account.bank.includes("Flooz") || account.bank.includes("Money") ? (
                  <Smartphone size={22} />
                ) : (
                  iconMap[account.type]
                )}
              </div>
              <span className="text-xs text-muted font-mono">{account.accountNumber}</span>
            </div>
            <p className="text-sm font-medium text-heading mb-0.5">{account.name}</p>
            <p className="text-xs text-muted mb-3">{account.bank}</p>
            <p className="text-xl font-bold text-heading tracking-tight">
              {formatFCFA(account.balance)}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-card animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-base font-semibold text-heading">
            Dernières transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-gray-100">
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Description
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Moyen
                </th>
                <th className="text-right px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          tx.type === "income"
                            ? "bg-status-paid-bg text-status-paid"
                            : "bg-status-overdue-bg text-status-overdue"
                        )}
                      >
                        {tx.type === "income" ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-heading truncate">
                          {tx.description}
                        </p>
                        {tx.clientName && (
                          <p className="text-xs text-muted mt-0.5">{tx.clientName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-body">{formatDate(tx.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-body">{tx.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={cn(
                        "text-sm font-semibold whitespace-nowrap",
                        tx.type === "income" ? "text-status-paid" : "text-status-overdue"
                      )}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatFCFA(tx.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
