"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Download,
  Calendar,
} from "lucide-react";
import { formatFCFA, formatDate, cn } from "@/lib/utils";
import { useAppStore } from "@/lib/app-store";
import { downloadInvoicePDF } from "@/lib/download-invoice-pdf";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { Invoice, InvoiceLine, InvoiceStatus, Transaction } from "@/types";
import PaymentModal from "@/components/PaymentModal";
import InvoicesLoading from "./loading";

const filters: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Brouillon", value: "draft" },
  { label: "Envoyée", value: "sent" },
  { label: "Payée", value: "paid" },
  { label: "En retard", value: "overdue" },
];

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyée" },
  { value: "paid", label: "Payée" },
  { value: "overdue", label: "En retard" },
];

const ITEMS_PER_PAGE = 8;

export default function InvoicesPage() {
  const { loading, invoices: invoicesList, updateInvoice, deleteInvoice: removeInvoice, addTransaction, regional, company, profile } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    issueDate: string;
    dueDate: string;
    lines: InvoiceLine[];
    notes: string;
  }>({ issueDate: "", dueDate: "", lines: [], notes: "" });
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const closeMenus = useCallback(() => {
    setOpenMenuId(null);
    setStatusMenuId(null);
  }, []);

  const filtered = invoicesList.filter((inv) => {
    const matchesStatus = activeFilter === "all" || inv.status === activeFilter;
    const matchesSearch =
      search === "" ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase());
    const matchesDate =
      (!dateFrom || inv.issueDate >= dateFrom) &&
      (!dateTo || inv.issueDate <= dateTo);
    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setEditForm({
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      lines: invoice.lines.map((l) => ({ ...l })),
      notes: invoice.notes || "",
    });
    closeMenus();
  };

  const handleEditSave = () => {
    if (!editingInvoice) return;
    const newAmount = editForm.lines.reduce(
      (sum, l) => sum + l.quantity * l.unitPrice,
      0
    );
    const tva = Math.round(newAmount * (regional.tvaRate / 100));
    updateInvoice(editingInvoice.id, {
      issueDate: editForm.issueDate,
      dueDate: editForm.dueDate,
      lines: editForm.lines,
      notes: editForm.notes,
      amount: newAmount + tva,
    });
    setEditingInvoice(null);
  };

  const handleStatusChange = (invoiceId: string, status: InvoiceStatus) => {
    if (status === "paid") {
      const inv = invoicesList.find((i) => i.id === invoiceId);
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
    removeInvoice(id);
    setDeleteConfirm(null);
  };

  const handleDownload = (invoice: Invoice) => {
    downloadInvoicePDF(invoice, company, regional, profile);
    closeMenus();
  };

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

  const addLine = () => {
    setEditForm({
      ...editForm,
      lines: [
        ...editForm.lines,
        {
          id: "l" + Math.random().toString(36).substring(2, 9),
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
  };

  const updateLine = (
    index: number,
    field: keyof InvoiceLine,
    value: string | number
  ) => {
    const updated = editForm.lines.map((l, i) =>
      i === index ? { ...l, [field]: value } : l
    );
    setEditForm({ ...editForm, lines: updated });
  };

  const removeLine = (index: number) => {
    setEditForm({
      ...editForm,
      lines: editForm.lines.filter((_, i) => i !== index),
    });
  };

  if (loading) return <InvoicesLoading />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Factures</h1>
          <p className="text-sm text-muted mt-1">
            Gérez toutes vos factures en un seul endroit.
          </p>
        </div>
        <Link
          href="/invoices/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus size={18} />
          Nouvelle facture
        </Link>
      </div>

      <div className="bg-card rounded-2xl shadow-card">
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Rechercher par client ou numéro..."
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
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
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
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-muted"
                  >
                    Aucune facture trouvée.
                  </td>
                </tr>
              ) : (
                paginated.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-heading">
                          {invoice.clientName}
                        </p>
                        <p className="text-xs text-muted">
                          {invoice.clientEmail}
                        </p>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Menu dropdown fixe (hors du flux de la table) */}
      {openMenuId && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMenus} />
          <div
            className="fixed w-48 bg-card border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-fade-in"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              onClick={() => {
                const inv = invoicesList.find((i) => i.id === openMenuId);
                if (inv) openEdit(inv);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-body hover:bg-gray-50 transition-colors"
            >
              <Edit3 size={15} />
              Modifier
            </button>

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
                  const inv = invoicesList.find((i) => i.id === openMenuId);
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
              onClick={() => {
                const inv = invoicesList.find((i) => i.id === openMenuId);
                if (inv) handleDownload(inv);
              }}
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

      {/* Modale d'édition */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-heading">
                  Modifier la facture
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  {editingInvoice.number} — {editingInvoice.clientName}
                </p>
              </div>
              <button
                onClick={() => setEditingInvoice(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Date d&apos;émission
                  </label>
                  <input
                    type="date"
                    value={editForm.issueDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, issueDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Date d&apos;échéance
                  </label>
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-heading">
                    Lignes de facture
                  </label>
                  <span className="text-xs text-muted">
                    {editForm.lines.length} article{editForm.lines.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {editForm.lines.map((line, i) => (
                    <div
                      key={line.id}
                      className="flex flex-col sm:flex-row gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => updateLine(i, "description", e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                        />
                      </div>
                      <div className="w-full sm:w-20">
                        <input
                          type="number"
                          value={line.quantity === 0 ? "" : line.quantity}
                          onChange={(e) => updateLine(i, "quantity", e.target.value === "" ? 0 : Number(e.target.value))}
                          min={1}
                          placeholder="Qté"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-heading text-center focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                        />
                      </div>
                      <div className="w-full sm:w-32">
                        <input
                          type="number"
                          value={line.unitPrice === 0 ? "" : line.unitPrice}
                          onChange={(e) => updateLine(i, "unitPrice", e.target.value === "" ? 0 : Number(e.target.value))}
                          min={0}
                          placeholder="Prix unitaire"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-heading text-right focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                        />
                      </div>
                      <div className="flex items-center gap-2 sm:w-auto">
                        <span className="text-sm font-medium text-heading whitespace-nowrap sm:w-28 text-right">
                          {formatFCFA(Math.round(line.quantity * line.unitPrice))}
                        </span>
                        <button
                          onClick={() => removeLine(i)}
                          className="p-1.5 rounded-lg text-muted hover:text-status-overdue hover:bg-status-overdue-bg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addLine}
                  className="mt-3 w-full py-2.5 border border-dashed border-gray-200 rounded-lg text-sm font-medium text-brand-500 hover:bg-brand-50 hover:border-brand-200 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter une ligne
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Notes ou conditions..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-body">Sous-total HT</span>
                  <span className="font-medium text-heading">
                    {formatFCFA(editForm.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-body">TVA ({regional.tvaRate}%)</span>
                  <span className="font-medium text-heading">
                    {formatFCFA(Math.round(editForm.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0) * (regional.tvaRate / 100)))}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-heading">Total TTC</span>
                  <span className="text-sm font-bold text-heading">
                    {formatFCFA(Math.round(editForm.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0) * (1 + regional.tvaRate / 100)))}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setEditingInvoice(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
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
