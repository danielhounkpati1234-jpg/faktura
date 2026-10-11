"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  ChevronDown,
  Download,
} from "lucide-react";
import { formatFCFA, formatDate, cn } from "@/lib/utils";
import { useAppStore } from "@/lib/app-store";
import { downloadInvoicePDF } from "@/lib/download-invoice-pdf";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Invoice, InvoiceStatus, Transaction } from "@/types";
import PaymentModal from "@/components/PaymentModal";

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyée" },
  { value: "paid", label: "Payée" },
  { value: "overdue", label: "En retard" },
];

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { invoices, updateInvoice, deleteInvoice, addTransaction, regional, company, profile } = useAppStore();
  const invoice = invoices.find((inv) => inv.id === params.id);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted">Facture introuvable.</p>
        <Link
          href="/invoices"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          Retour aux factures
        </Link>
      </div>
    );
  }

  const subtotal = invoice.lines.reduce(
    (sum, l) => sum + l.quantity * l.unitPrice,
    0
  );
  const tvaRate = regional.tvaRate;
  const tva = Math.round(subtotal * (tvaRate / 100));
  const total = subtotal + tva;

  const handleStatusChange = (status: InvoiceStatus) => {
    if (status === "paid") {
      setPaymentInvoice(invoice);
      setShowStatusMenu(false);
      return;
    }
    updateInvoice(invoice.id, { status });
    setShowStatusMenu(false);
  };

  const handlePaymentConfirm = async (tx: Omit<Transaction, "id">) => {
    if (!paymentInvoice) return;
    await addTransaction(tx);
    await updateInvoice(paymentInvoice.id, { status: "paid" });
    setPaymentInvoice(null);
  };

  const handlePaymentSkip = () => {
    if (!paymentInvoice) return;
    updateInvoice(paymentInvoice.id, { status: "paid" });
    setPaymentInvoice(null);
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    router.push("/invoices");
  };

  return (
    <>
      <div className="mb-8">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-heading transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Retour aux factures
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-heading">
                {invoice.number}
              </h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-sm text-muted mt-1">
              {invoice.clientName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
              >
                Changer le statut
                <ChevronDown size={16} />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(opt.value)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors",
                        invoice.status === opt.value
                          ? "bg-brand-50 text-brand-600 font-medium"
                          : "text-body hover:bg-gray-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/invoices/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
            >
              <Edit3 size={16} />
              Modifier
            </Link>

            <button
              onClick={() => downloadInvoicePDF(invoice, company, regional, profile)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
            >
              <Download size={16} />
              Télécharger PDF
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-status-overdue/30 rounded-lg text-sm font-medium text-status-overdue hover:bg-status-overdue-bg transition-colors"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onConfirm={handlePaymentConfirm}
          onSkip={handlePaymentSkip}
          onClose={() => setPaymentInvoice(null)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-md w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-heading mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-body mb-6">
              Êtes-vous sûr de vouloir supprimer la facture{" "}
              <span className="font-semibold">{invoice.number}</span> ? Cette
              action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-status-overdue text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-heading">
              Détails de la facture
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-1">
                  Date d&apos;émission
                </p>
                <p className="text-sm font-medium text-heading">
                  {formatDate(invoice.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-1">
                  Date d&apos;échéance
                </p>
                <p className="text-sm font-medium text-heading">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left pb-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                      Description
                    </th>
                    <th className="text-center pb-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                      Qté
                    </th>
                    <th className="text-right pb-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                      Prix unitaire
                    </th>
                    <th className="text-right pb-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr
                      key={line.id}
                      className="border-b border-gray-50 last:border-b-0"
                    >
                      <td className="py-3.5 text-sm text-heading">
                        {line.description}
                      </td>
                      <td className="py-3.5 text-sm text-body text-center">
                        {line.quantity}
                      </td>
                      <td className="py-3.5 text-sm text-body text-right whitespace-nowrap">
                        {formatFCFA(line.unitPrice)}
                      </td>
                      <td className="py-3.5 text-sm font-medium text-heading text-right whitespace-nowrap">
                        {formatFCFA(Math.round(line.quantity * line.unitPrice))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-body">Sous-total</span>
                  <span className="font-medium text-heading">
                    {formatFCFA(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-body">TVA ({tvaRate}%)</span>
                  <span className="font-medium text-heading">
                    {formatFCFA(tva)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-base font-semibold text-heading">
                    Total TTC
                  </span>
                  <span className="text-base font-bold text-heading">
                    {formatFCFA(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6">
            <h3 className="text-sm font-semibold text-heading mb-4">
              Informations client
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted mb-0.5">Nom</p>
                <p className="text-sm font-medium text-heading">
                  {invoice.clientName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Email</p>
                <p className="text-sm text-brand-500">{invoice.clientEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6">
            <h3 className="text-sm font-semibold text-heading mb-4">
              Émis par
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted mb-0.5">Entreprise</p>
                <p className="text-sm font-medium text-heading">
                  {company.name || [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Email</p>
                <p className="text-sm text-brand-500">{company.billingEmail || profile.email}</p>
              </div>
              {company.nif && (
                <div>
                  <p className="text-xs text-muted mb-0.5">NIF</p>
                  <p className="text-sm text-body">{company.nif}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6">
            <h3 className="text-sm font-semibold text-heading mb-4">
              Résumé
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-body">Articles</span>
                <span className="font-medium text-heading">
                  {invoice.lines.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-body">Sous-total HT</span>
                <span className="font-medium text-heading">
                  {formatFCFA(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-body">TVA {tvaRate}%</span>
                <span className="font-medium text-heading">
                  {formatFCFA(tva)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-heading">Total TTC</span>
                <span className="font-bold text-brand-500">
                  {formatFCFA(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
