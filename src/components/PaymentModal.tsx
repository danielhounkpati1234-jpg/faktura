"use client";

import { useState } from "react";
import { X, CreditCard } from "lucide-react";
import { formatFCFA } from "@/lib/utils";
import { Invoice, Transaction } from "@/types";

const paymentMethods = [
  "Virement bancaire",
  "Mobile Money",
  "Espèces",
  "Chèque",
  "Carte bancaire",
];

interface PaymentModalProps {
  invoice: Invoice;
  onConfirm: (tx: Omit<Transaction, "id">) => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function PaymentModal({ invoice, onConfirm, onSkip, onClose }: PaymentModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [amount, setAmount] = useState(invoice.amount);
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState(`Paiement facture ${invoice.number}`);
  const [paymentMethod, setPaymentMethod] = useState("Virement bancaire");
  const [category] = useState("Paiement facture");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm({
        description,
        amount,
        type: "income",
        category,
        date,
        clientName: invoice.clientName,
        invoiceNumber: invoice.number,
        paymentMethod,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-lg max-w-lg w-full p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <CreditCard size={20} className="text-brand-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-heading">
                Enregistrer le paiement
              </h3>
              <p className="text-sm text-muted">
                {invoice.number} — {invoice.clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">
                Montant
              </label>
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                onFocus={(e) => e.target.value === "0" && setAmount(0)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-card"
              />
              <p className="text-xs text-muted mt-1">{formatFCFA(amount)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">
                Date du paiement
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-card"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-card"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Méthode de paiement
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-card"
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-medium">Client</p>
              <p className="text-sm font-medium text-heading mt-0.5">{invoice.clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted uppercase tracking-wider font-medium">Facture</p>
              <p className="text-sm font-medium text-brand-500 mt-0.5">{invoice.number}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onSkip}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
          >
            Passer
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving || amount <= 0}
            className="px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Enregistrement..." : "Enregistrer le paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}
