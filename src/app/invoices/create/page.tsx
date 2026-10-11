"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  ArrowLeft,
  UserPlus,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  FileText,
  Download,
  ArrowRight,
  Check,
  Search,
  Send,
  Save,
} from "lucide-react";
import Link from "next/link";
import { formatFCFA, formatDate, cn } from "@/lib/utils";
import { useAppStore } from "@/lib/app-store";
import { downloadInvoicePDF } from "@/lib/download-invoice-pdf";
import { Invoice, InvoiceStatus } from "@/types";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function todayISO() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function in30DaysISO() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

const statusLabels: Record<InvoiceStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
};

const emptyClientForm = { name: "", email: "", phone: "", address: "" };

export default function CreateInvoicePage() {
  const router = useRouter();
  const { invoices, addInvoice, updateInvoice, company, regional, clients: clientsList, addClient, profile } = useAppStore();
  const [clientId, setClientId] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState(emptyClientForm);
  const [issueDate, setIssueDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(in30DaysISO());
  const [showPreview, setShowPreview] = useState(true);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineItem[]>([
    { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [linkedInvoice, setLinkedInvoice] = useState<Invoice | null>(null);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>("draft");
  const [showInvoicePicker, setShowInvoicePicker] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInvoiceNumber, setSuccessInvoiceNumber] = useState("");
  const [successAction, setSuccessAction] = useState<"save" | "download" | "send">("save");
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  const selectedClient = clientsList.find((c) => c.id === clientId);

  const filteredClients = clientsList.filter(
    (c) =>
      clientSearch === "" ||
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );
  const tvaRate = regional.tvaRate;

  const addLine = () => {
    setLines([
      ...lines,
      { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length === 1) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const updateLine = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const lineTotal = (line: LineItem) =>
    Math.round(line.quantity * line.unitPrice);
  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);
  const tva = Math.round(subtotal * (tvaRate / 100));
  const total = subtotal + tva;

  const invoiceNumber = useMemo(() => {
    if (linkedInvoice) return linkedInvoice.number;
    const prefix = regional.invoicePrefix;
    const year = new Date().getFullYear();
    const nextNum = invoices.length + 1;
    return `${prefix}-${year}-${String(nextNum).padStart(4, "0")}`;
  }, [linkedInvoice, regional.invoicePrefix, invoices.length]);

  const loadInvoice = (invoice: Invoice) => {
    setLinkedInvoice(invoice);
    setInvoiceStatus(invoice.status);
    setClientId(invoice.clientId);
    setIssueDate(invoice.issueDate);
    setDueDate(invoice.dueDate);
    setNotes(invoice.notes || "");
    setLines(
      invoice.lines.map((l) => ({
        id: l.id,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      }))
    );
    setShowInvoicePicker(false);
    setInvoiceSearch("");
  };

  const clearLinkedInvoice = () => {
    setLinkedInvoice(null);
    setInvoiceStatus("draft");
    setClientId("");
    setIssueDate(todayISO());
    setDueDate(in30DaysISO());
    setNotes("");
    setLines([
      { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      invoiceSearch === "" ||
      inv.number.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(invoiceSearch.toLowerCase())
  );

  const handleDownloadPDF = useCallback(() => {
    const tempInvoice: Invoice = {
      id: "temp",
      number: invoiceNumber,
      clientId: selectedClient?.id || "",
      clientName: selectedClient?.name || "—",
      clientEmail: selectedClient?.email || "",
      amount: total,
      status: invoiceStatus,
      issueDate,
      dueDate,
      lines: lines.map((l) => ({ id: l.id, description: l.description, quantity: l.quantity, unitPrice: l.unitPrice })),
      notes,
    };
    downloadInvoicePDF(tempInvoice, company, regional, profile);
  }, [lines, invoiceNumber, company, regional, profile, selectedClient, issueDate, dueDate, total, notes, invoiceStatus]);

  const handleSubmit = (action: "save" | "download" | "send") => {
    if (!selectedClient) return;

    const id = linkedInvoice ? linkedInvoice.id : generateId();
    const invoiceData: Invoice = {
      id,
      number: invoiceNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      amount: total,
      status: action === "send" ? "sent" : (linkedInvoice?.status || "draft"),
      issueDate,
      dueDate,
      lines: lines.map((l) => ({
        id: l.id,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
      notes: notes || undefined,
    };

    if (linkedInvoice) {
      updateInvoice(linkedInvoice.id, invoiceData);
      setInvoiceStatus(invoiceData.status);
    } else {
      addInvoice(invoiceData);
      setLinkedInvoice(invoiceData);
      setInvoiceStatus(invoiceData.status);
    }

    setSuccessInvoiceNumber(invoiceNumber);
    setSuccessAction(action);
    setShowSuccessModal(true);

    if (action === "download") {
      handleDownloadPDF();
    }
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
            <h1 className="text-2xl font-semibold text-heading">
              {linkedInvoice ? "Modifier la facture" : "Créer une facture"}
            </h1>
            <p className="text-sm text-muted mt-1">
              {linkedInvoice
                ? `Modification de ${linkedInvoice.number} — ${linkedInvoice.clientName}`
                : "Remplissez les informations ci-dessous pour créer une nouvelle facture."}
            </p>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? "Masquer aperçu" : "Afficher aperçu"}
          </button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${showPreview ? "grid-cols-1 xl:grid-cols-5" : "grid-cols-1"}`}
      >
        <div className={showPreview ? "xl:col-span-3" : ""}>
          <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8 animate-fade-in-up">
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Client *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowClientPicker(!showClientPicker);
                        setClientSearch("");
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm transition-all duration-200",
                        selectedClient
                          ? "border-gray-200 text-heading bg-card"
                          : "border-gray-200 text-muted bg-card"
                      )}
                    >
                      <span className="truncate">
                        {selectedClient
                          ? selectedClient.name
                          : "Sélectionner un client"}
                      </span>
                      <ChevronDown
                        size={15}
                        className={cn(
                          "shrink-0 ml-2 transition-transform duration-200",
                          showClientPicker && "rotate-180"
                        )}
                      />
                    </button>

                    {showClientPicker && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-gray-200 rounded-lg shadow-lg z-30 animate-fade-in overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search
                              size={15}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                              type="text"
                              placeholder="Rechercher un client..."
                              value={clientSearch}
                              onChange={(e) =>
                                setClientSearch(e.target.value)
                              }
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                          {filteredClients.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-muted text-center">
                              Aucun client trouvé
                            </p>
                          ) : (
                            filteredClients.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setClientId(c.id);
                                  setShowClientPicker(false);
                                  setClientSearch("");
                                }}
                                className={cn(
                                  "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                                  clientId === c.id
                                    ? "bg-brand-50 text-brand-600"
                                    : "text-body hover:bg-gray-50"
                                )}
                              >
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={cn(
                                      "text-sm truncate",
                                      clientId === c.id
                                        ? "font-semibold"
                                        : "font-medium text-heading"
                                    )}
                                  >
                                    {c.name}
                                  </p>
                                  <p className="text-xs text-muted truncate">
                                    {c.email}
                                  </p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                        <div className="border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => {
                              setShowClientPicker(false);
                              setShowNewClient(true);
                              setClientSearch("");
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-500 font-medium hover:bg-brand-50 transition-colors"
                          >
                            <Plus size={14} />
                            Nouveau client
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewClient(true)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50 hover:border-brand-200 transition-all duration-200"
                    title="Ajouter un client"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Date d&apos;émission *
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Date d&apos;échéance *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mb-8">
              <h2 className="text-base font-semibold text-heading mb-4">
                Lignes de facture
              </h2>

              <div className="hidden md:grid grid-cols-[1fr_100px_140px_140px_40px] gap-3 mb-3">
                <span className="text-[11px] text-muted uppercase tracking-wider font-medium px-1">
                  Description
                </span>
                <span className="text-[11px] text-muted uppercase tracking-wider font-medium px-1">
                  Quantité
                </span>
                <span className="text-[11px] text-muted uppercase tracking-wider font-medium px-1">
                  Prix unitaire
                </span>
                <span className="text-[11px] text-muted uppercase tracking-wider font-medium px-1 text-right">
                  Total
                </span>
                <span />
              </div>

              <div className="space-y-3">
                {lines.map((line, index) => (
                  <div
                    key={line.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_140px_40px] gap-3 p-4 md:p-0 bg-gray-50/60 md:bg-transparent rounded-xl md:rounded-none"
                  >
                    <div>
                      <label className="md:hidden text-xs text-muted font-medium mb-1 block">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder={`Article ${index + 1}`}
                        value={line.description}
                        onChange={(e) =>
                          updateLine(line.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                    <div>
                      <label className="md:hidden text-xs text-muted font-medium mb-1 block">
                        Quantité
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity === 0 ? "" : line.quantity}
                        onChange={(e) =>
                          updateLine(
                            line.id,
                            "quantity",
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                    <div>
                      <label className="md:hidden text-xs text-muted font-medium mb-1 block">
                        Prix unitaire (FCFA)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={line.unitPrice === 0 ? "" : line.unitPrice}
                        placeholder="0"
                        onChange={(e) =>
                          updateLine(
                            line.id,
                            "unitPrice",
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="md:hidden text-xs text-muted font-medium mr-auto">
                        Total :
                      </span>
                      <span className="text-sm font-semibold text-heading whitespace-nowrap py-2.5">
                        {formatFCFA(lineTotal(line))}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length === 1}
                        className="p-2 rounded-lg text-muted hover:text-status-overdue hover:bg-status-overdue-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Supprimer la ligne"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addLine}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-200 rounded-lg text-sm font-medium text-brand-500 hover:bg-brand-50 hover:border-brand-200 transition-all duration-200"
              >
                <Plus size={16} />
                Ajouter une ligne
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <label className="block text-sm font-medium text-heading mb-1.5">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Conditions de paiement, remarques..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card resize-none"
              />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-end">
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

            <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => router.push("/invoices")}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200 inline-flex items-center gap-2"
              >
                <X size={16} />
                Annuler
              </button>
              <button
                onClick={() => handleSubmit("save")}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200 inline-flex items-center gap-2"
              >
                <Save size={16} />
                Enregistrer
              </button>
              <button
                onClick={() => handleSubmit("download")}
                className="px-5 py-2.5 border border-brand-200 bg-brand-50 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-100 transition-all duration-200 inline-flex items-center gap-2"
              >
                <Download size={16} />
                Télécharger PDF
              </button>
              <button
                onClick={() => handleSubmit("send")}
                className="px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200 inline-flex items-center gap-2"
              >
                <Send size={16} />
                {linkedInvoice ? "Mettre à jour" : "Envoyer"}
              </button>
            </div>
          </div>
        </div>

        {/* ── PREVIEW PANEL ── */}
        {showPreview && (
          <div className="xl:col-span-2">
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-6 animate-fade-in-up stagger-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-heading">
                  Aperçu
                </h3>
                <StatusBadge status={invoiceStatus} />
              </div>

              <div className="mb-5">
                <div className="relative">
                  <button
                    onClick={() => setShowInvoicePicker(!showInvoicePicker)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm transition-all duration-200",
                      linkedInvoice
                        ? "border-brand-200 bg-brand-50 text-brand-600"
                        : "border-gray-200 text-body hover:bg-gray-50"
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileText size={15} className="shrink-0" />
                      {linkedInvoice
                        ? `${linkedInvoice.number} — ${linkedInvoice.clientName}`
                        : "Nouvelle facture"}
                    </span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        "shrink-0 transition-transform duration-200",
                        showInvoicePicker && "rotate-180"
                      )}
                    />
                  </button>

                  {showInvoicePicker && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-gray-200 rounded-lg shadow-lg z-30 animate-fade-in overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder="Rechercher une facture..."
                          value={invoiceSearch}
                          onChange={(e) => setInvoiceSearch(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => {
                          clearLinkedInvoice();
                          setShowInvoicePicker(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                          !linkedInvoice
                            ? "bg-brand-50 text-brand-600 font-medium"
                            : "text-body hover:bg-gray-50"
                        )}
                      >
                        <Plus size={14} className="shrink-0" />
                        <span>Nouvelle facture</span>
                      </button>
                      <div className="border-t border-gray-100" />
                      <div className="max-h-64 overflow-y-auto">
                        {filteredInvoices.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-muted text-center">
                            Aucune facture trouvée
                          </p>
                        ) : (
                          filteredInvoices.map((inv) => (
                            <button
                              key={inv.id}
                              onClick={() => loadInvoice(inv)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                                linkedInvoice?.id === inv.id
                                  ? "bg-brand-50 text-brand-600"
                                  : "text-body hover:bg-gray-50"
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    "text-sm truncate",
                                    linkedInvoice?.id === inv.id
                                      ? "font-semibold"
                                      : "font-medium text-heading"
                                  )}
                                >
                                  {inv.number}
                                </p>
                                <p className="text-xs text-muted truncate">
                                  {inv.clientName} &middot;{" "}
                                  {formatFCFA(inv.amount)}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  "shrink-0 ml-3 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                  inv.status === "paid" &&
                                    "bg-status-paid-bg text-status-paid",
                                  inv.status === "sent" &&
                                    "bg-status-sent-bg text-status-sent",
                                  inv.status === "draft" &&
                                    "bg-status-draft-bg text-status-draft",
                                  inv.status === "overdue" &&
                                    "bg-status-overdue-bg text-status-overdue"
                                )}
                              >
                                {statusLabels[inv.status]}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview document */}
              <div className="bg-page rounded-xl p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-heading">FACTURE</h4>
                    <p className="text-xs text-muted mt-1">
                      N° {invoiceNumber}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                  <div>
                    <p className="text-muted font-medium mb-1">Émis par :</p>
                    <p className="font-semibold text-heading">
                      {company.name || [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—"}
                    </p>
                    {(company.address) && (
                      <p className="text-muted">{company.address}</p>
                    )}
                    <p className="text-muted">{company.billingEmail || profile.email}</p>
                    <p className="text-muted">{company.phone || profile.phone}</p>
                    {company.nif && (
                      <p className="text-muted">NIF : {company.nif}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted font-medium mb-1">Facturé à :</p>
                    {selectedClient ? (
                      <>
                        <p className="font-semibold text-heading">
                          {selectedClient.name}
                        </p>
                        <p className="text-muted">{selectedClient.email}</p>
                        <p className="text-muted">{selectedClient.address}</p>
                      </>
                    ) : (
                      <p className="text-muted italic">
                        Sélectionnez un client
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                  <div>
                    <p className="text-muted font-medium">
                      Date d&apos;émission :
                    </p>
                    <p className="font-semibold text-heading">
                      {issueDate ? formatDate(issueDate) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted font-medium">
                      Date d&apos;échéance :
                    </p>
                    <p className="font-semibold text-heading">
                      {dueDate ? formatDate(dueDate) : "—"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-[10px] text-muted uppercase tracking-wider font-medium mb-2">
                    <span>Article</span>
                    <span className="w-10 text-center">Qté</span>
                    <span className="w-20 text-right">P.U.</span>
                    <span className="w-20 text-right">Total</span>
                  </div>
                  {lines
                    .filter((l) => l.description)
                    .map((line) => (
                      <div
                        key={line.id}
                        className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs py-1.5 border-b border-gray-50 last:border-b-0"
                      >
                        <span className="text-heading truncate">
                          {line.description}
                        </span>
                        <span className="w-10 text-center text-body">
                          {line.quantity}
                        </span>
                        <span className="w-20 text-right text-body whitespace-nowrap">
                          {formatFCFA(line.unitPrice)}
                        </span>
                        <span className="w-20 text-right font-medium text-heading whitespace-nowrap">
                          {formatFCFA(lineTotal(line))}
                        </span>
                      </div>
                    ))}
                  {lines.filter((l) => l.description).length === 0 && (
                    <p className="text-xs text-muted italic py-2">
                      Aucun article ajouté
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-body">Sous-total</span>
                    <span className="font-medium text-heading">
                      {formatFCFA(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">TVA ({tvaRate}%)</span>
                    <span className="font-medium text-heading">
                      {formatFCFA(tva)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="font-bold text-heading">Total TTC</span>
                    <span className="font-bold text-heading">
                      {formatFCFA(total)}
                    </span>
                  </div>
                </div>

                {notes && (
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <p className="text-[10px] text-muted uppercase tracking-wider font-medium mb-1">
                      Notes
                    </p>
                    <p className="text-xs text-body">{notes}</p>
                  </div>
                )}

                {company.legalText && (
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <p className="text-[10px] text-muted italic leading-relaxed">
                      {company.legalText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-md w-full p-6 animate-fade-in-up text-center">
            <div className="w-14 h-14 rounded-full bg-status-paid-bg text-status-paid flex items-center justify-center mx-auto mb-4">
              <Check size={28} />
            </div>
            <h3 className="text-lg font-semibold text-heading mb-1">
              {successAction === "save"
                ? "Facture enregistrée !"
                : successAction === "download"
                  ? "PDF prêt au téléchargement !"
                  : linkedInvoice
                    ? "Facture mise à jour !"
                    : "Facture envoyée !"}
            </h3>
            <p className="text-sm text-muted mb-6">
              La facture{" "}
              <span className="font-semibold text-heading">
                {successInvoiceNumber}
              </span>{" "}
              a été{" "}
              {successAction === "save"
                ? "enregistrée avec succès"
                : successAction === "download"
                  ? "enregistrée. Votre PDF est prêt"
                  : linkedInvoice
                    ? "mise à jour avec succès"
                    : "envoyée avec succès"}
              .
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-200 bg-brand-50 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-100 transition-all duration-200"
              >
                <Download size={16} />
                Télécharger le PDF
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/invoices");
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
              >
                <ArrowRight size={16} />
                Voir mes factures
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    clearLinkedInvoice();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
                >
                  <Plus size={16} />
                  Nouvelle facture
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
                >
                  <X size={16} />
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New client modal */}
      {showNewClient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-lg w-full p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-heading">
                  Nouveau client
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  Ajoutez un client pour cette facture
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNewClient(false);
                  setNewClient(emptyClientForm);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Nom *
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  placeholder="Nom de l'entreprise ou du client"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  placeholder="client@exemple.com"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    placeholder="+228 90 00 00 00"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: e.target.value })
                    }
                    placeholder="Ville, Pays"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowNewClient(false);
                  setNewClient(emptyClientForm);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (!newClient.name || !newClient.email) return;
                  const created = await addClient(newClient);
                  setClientId(created.id);
                  setShowNewClient(false);
                  setNewClient(emptyClientForm);
                }}
                className="px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
              >
                Ajouter le client
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
