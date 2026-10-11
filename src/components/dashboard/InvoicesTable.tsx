"use client";

import { useState, useCallback } from "react";
import { ArrowRight, MoreHorizontal, Trash2, Download, Edit3 } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { formatFCFA, formatDate, cn } from "@/lib/utils";
import { downloadInvoicePDF } from "@/lib/download-invoice-pdf";
import StatusBadge from "./StatusBadge";
import Link from "next/link";
import { Invoice, InvoiceStatus, Transaction } from "@/types";
import PaymentModal from "@/components/PaymentModal";

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyée" },
  { value: "paid", label: "Payée" },
  { value: "overdue", label: "En retard" },
];

export default function InvoicesTable() {
  const { invoices, updateInvoice, deleteInvoice, addTransaction, company, regional, profile } = useAppStore();
  const displayed = invoices.slice(0, 10);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const closeMenus = useCallback(() => {
    setOpenMenuId(null);
    setStatusMenuId(null);
  }, []);

  const toggleMenu = (invoiceId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenuId === invoiceId) {
      closeMenus();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      setOpenMenuId(invoiceId);
      setStatusMenuId(null);
    }
  };

  const handleStatusChange = (invoiceId: string, status: InvoiceStatus) => {
    if (status === "paid") {
      const inv = invoices.find((i) => i.id === invoiceId);
      if (inv) {
        setPaymentInvoice(inv);
        closeMenus();
        return;
      }
    }
    updateInvoice(invoiceId, { status });
    closeMenus();
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

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setDeleteConfirm(null);
  };

  const handleDownload = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (inv) {
      downloadInvoicePDF(inv, company, regional, profile);
      closeMenus();
    }
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-card animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-base font-semibold text-heading">
            Factures récentes
          </h2>
          <Link
            href="/invoices"
            className="group text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1 transition-colors duration-200"
          >
            Voir tout ({invoices.length})
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-gray-100">
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Numéro
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Client
                </th>
                <th className="text-right px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Montant
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Statut
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-[11px] text-muted uppercase tracking-wider font-medium">
                  Échéance
                </th>
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted">
                    Aucune facture pour le moment.
                  </td>
                </tr>
              ) : (
                displayed.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <Link href={`/invoices/${invoice.id}`} className="text-sm font-medium text-brand-500 hover:text-brand-600">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-heading">
                          {invoice.clientName}
                        </p>
                        <p className="text-xs text-muted mt-0.5">{invoice.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-heading whitespace-nowrap">
                        {formatFCFA(invoice.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-body">
                        {formatDate(invoice.issueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-body">
                        {formatDate(invoice.dueDate)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={(e) => toggleMenu(invoice.id, e)}
                        className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-gray-100 transition-colors duration-150"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu dropdown fixe (hors du flux de la table) */}
      {openMenuId && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMenus} />
          <div
            className="fixed w-48 bg-card border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-fade-in"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <Link
              href={`/invoices/${openMenuId}`}
              onClick={() => closeMenus()}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-body hover:bg-gray-50 transition-colors"
            >
              <Edit3 size={15} />
              Voir / Modifier
            </Link>

            <button
              onClick={() => setStatusMenuId(statusMenuId === openMenuId ? null : openMenuId)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-body hover:bg-gray-50 transition-colors"
            >
              <span className="w-[15px] h-[15px] rounded-full border-2 border-current flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </span>
              Changer le statut
            </button>

            {statusMenuId === openMenuId && (
              <div className="border-t border-b border-gray-100 py-1 my-1 bg-gray-50/50">
                {statusOptions.map((opt) => {
                  const inv = invoices.find((i) => i.id === openMenuId);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(openMenuId, opt.value)}
                      className={cn(
                        "w-full text-left px-8 py-2 text-sm transition-colors",
                        inv?.status === opt.value
                          ? "bg-brand-50 text-brand-600 font-medium"
                          : "text-body hover:bg-gray-100"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => handleDownload(openMenuId)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-body hover:bg-gray-50 transition-colors"
            >
              <Download size={15} />
              Télécharger PDF
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={() => {
                setDeleteConfirm(openMenuId);
                closeMenus();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-status-overdue hover:bg-status-overdue-bg transition-colors"
            >
              <Trash2 size={15} />
              Supprimer
            </button>
          </div>
        </>
      )}

      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onConfirm={handlePaymentConfirm}
          onSkip={handlePaymentSkip}
          onClose={() => setPaymentInvoice(null)}
        />
      )}

      {/* Modale de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-md w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-heading mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-body mb-6">
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action
              est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 bg-status-overdue text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
