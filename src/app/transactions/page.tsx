"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Landmark,
  Smartphone,
  TrendingUp,
  Plus,
  Wallet,
  Calendar,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { formatFCFA, formatDate, cn } from "@/lib/utils";
import Pagination from "@/components/ui/Pagination";
import { TransactionType } from "@/types";
import TransactionsLoading from "./loading";

const filters: { label: string; value: TransactionType | "all" }[] = [
  { label: "Toutes", value: "all" },
  { label: "Revenus", value: "income" },
  { label: "Dépenses", value: "expense" },
];

const iconMap: Record<string, React.ReactNode> = {
  checking: <Landmark size={20} />,
  savings: <TrendingUp size={20} />,
};

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const { loading, transactions, walletAccounts, invoices } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<TransactionType | "all">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const categories = Array.from(new Set(transactions.map((tx) => tx.category).filter(Boolean)));

  const totalBalance = walletAccounts.reduce((sum, a) => sum + a.balance, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const filtered = transactions.filter((tx) => {
    const matchesType = activeFilter === "all" || tx.type === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      tx.description.toLowerCase().includes(q) ||
      (tx.clientName && tx.clientName.toLowerCase().includes(q)) ||
      (tx.invoiceNumber && tx.invoiceNumber.toLowerCase().includes(q)) ||
      tx.category.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
    const matchesDate =
      (!dateFrom || tx.date >= dateFrom) &&
      (!dateTo || tx.date <= dateTo);
    return matchesType && matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <TransactionsLoading />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-heading">
            Transactions & Portefeuille
          </h1>
          <p className="text-sm text-muted mt-1">
            Suivez vos mouvements financiers et gérez vos comptes.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
          <Plus size={18} />
          Ajouter un compte
        </button>
      </div>

      {/* Wallet accounts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in-up">
        {/* Total balance card */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-card p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Solde total
            </p>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {formatFCFA(totalBalance)}
          </p>
          <p className="text-xs mt-1.5 opacity-70">
            {walletAccounts.length} comptes
          </p>
        </div>

        {walletAccounts.map((account, i) => (
          <div
            key={account.id}
            className={`group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 ease-out p-5 hover:-translate-y-0.5 animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {account.bank.includes("Flooz") ||
                account.bank.includes("Money") ? (
                  <Smartphone size={18} />
                ) : (
                  iconMap[account.type]
                )}
              </div>
              <span className="text-[10px] text-muted font-mono">
                {account.accountNumber}
              </span>
            </div>
            <p className="text-sm font-medium text-heading mb-0.5 truncate">
              {account.name}
            </p>
            <p className="text-[11px] text-muted mb-2">{account.bank}</p>
            <p className="text-lg font-bold text-heading tracking-tight">
              {formatFCFA(account.balance)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in-up stagger-2">
        <div className="bg-card rounded-2xl shadow-card p-5">
          <p className="text-[13px] text-muted font-medium mb-1">Solde net</p>
          <p className="text-xl font-bold text-heading tracking-tight">
            {formatFCFA(totalIncome - totalExpense)}
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft size={14} className="text-status-paid" />
            <p className="text-[13px] text-muted font-medium">Total revenus</p>
          </div>
          <p className="text-xl font-bold text-status-paid tracking-tight">
            {formatFCFA(totalIncome)}
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight size={14} className="text-status-overdue" />
            <p className="text-[13px] text-muted font-medium">
              Total dépenses
            </p>
          </div>
          <p className="text-xl font-bold text-status-overdue tracking-tight">
            {formatFCFA(totalExpense)}
          </p>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-card rounded-2xl shadow-card animate-fade-in-up stagger-3">
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Rechercher par description, client ou n° facture..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="w-[130px] px-2 py-2 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-card"
                title="Du"
              />
              <span className="text-xs text-muted">au</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="w-[130px] px-2 py-2 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-card"
                title="Au"
              />
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => { setDateFrom(""); setDateTo(""); setCurrentPage(1); }}
                  className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-gray-100 transition-colors"
                  title="Réinitialiser les dates"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-muted" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setActiveFilter(f.value);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeFilter === f.value
                    ? "bg-brand-500 text-white"
                    : "bg-gray-50 text-body hover:bg-gray-100"
                )}
              >
                {f.label}
              </button>
            ))}
            {categories.length > 0 && (
              <>
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-heading bg-card focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Description
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Ticket
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Catégorie
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Moyen
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Date
                </th>
                <th className="text-right px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted"
                  >
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
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
                            <p className="text-xs text-muted mt-0.5">
                              {tx.clientName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tx.invoiceNumber ? (() => {
                        const inv = invoices.find(i => i.number === tx.invoiceNumber);
                        return inv ? (
                          <Link
                            href={`/invoices/${inv.id}`}
                            className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                          >
                            {tx.invoiceNumber}
                          </Link>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-brand-50 text-brand-600">
                            {tx.invoiceNumber}
                          </span>
                        );
                      })() : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-body">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-body">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-body">
                        {formatDate(tx.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={cn(
                          "text-sm font-semibold whitespace-nowrap",
                          tx.type === "income"
                            ? "text-status-paid"
                            : "text-status-overdue"
                        )}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatFCFA(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
