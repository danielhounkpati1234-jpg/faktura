"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  BookOpen,
  FileQuestion,
  Zap,
  Shield,
  Send,
} from "lucide-react";

const faqs = [
  {
    question: "Comment créer une facture ?",
    answer: "Accédez à la page Factures, cliquez sur \"Nouvelle facture\", remplissez les informations du client, ajoutez vos articles et envoyez ou sauvegardez en brouillon.",
  },
  {
    question: "Comment ajouter un nouveau client ?",
    answer: "Vous pouvez ajouter un client depuis la page Clients en cliquant sur \"Ajouter un client\", ou directement lors de la création d'une facture via le bouton \"+\" à côté du sélecteur de client.",
  },
  {
    question: "Quels moyens de paiement sont acceptés ?",
    answer: "Faktura supporte les virements bancaires, Mobile Money (Flooz, T-Money), les chèques et les paiements en espèces. Vous pouvez configurer vos méthodes préférées dans les paramètres.",
  },
  {
    question: "Comment exporter mes factures en PDF ?",
    answer: "Sur la page de détail d'une facture, cliquez sur le bouton \"PDF\" pour générer et télécharger votre facture au format PDF, prête à être envoyée par email.",
  },
  {
    question: "La TVA est-elle calculée automatiquement ?",
    answer: "Oui, la TVA de 18% est automatiquement calculée sur le montant hors taxes de chaque facture. Vous pouvez modifier le taux par défaut dans Paramètres > Facturation.",
  },
  {
    question: "Comment changer le statut d'une facture ?",
    answer: "Ouvrez le détail d'une facture et utilisez le bouton \"Changer le statut\" pour passer entre Brouillon, Envoyée, Payée ou En retard.",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Guide de démarrage",
    desc: "Apprenez les bases de Faktura en 5 minutes",
  },
  {
    icon: Zap,
    title: "Astuces productivité",
    desc: "Optimisez votre flux de facturation",
  },
  {
    icon: Shield,
    title: "Sécurité & confidentialité",
    desc: "Comment nous protégeons vos données",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold text-heading">Aide et support</h1>
        <p className="text-sm text-muted mt-1">
          Trouvez des réponses ou contactez notre équipe.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7 animate-fade-in-up">
        {resources.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={i}
              className={`group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 ease-out p-6 hover:-translate-y-0.5 cursor-pointer animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <Icon size={22} />
              </div>
              <p className="text-sm font-semibold text-heading mb-1">{r.title}</p>
              <p className="text-xs text-muted">{r.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-card animate-fade-in-up stagger-3">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileQuestion size={18} className="text-brand-500" />
              <h2 className="text-base font-semibold text-heading">
                Questions fréquentes
              </h2>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/60 transition-colors duration-150"
                >
                  <span className="text-sm font-medium text-heading pr-4">
                    {faq.question}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-muted shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-muted shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 animate-fade-in">
                    <p className="text-sm text-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-brand-500" />
              <h3 className="text-base font-semibold text-heading">
                Envoyer un message
              </h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Notre équipe vous répond sous 24h.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre problème ou question..."
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card resize-none"
            />
            <button
              onClick={handleSend}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
            >
              <Send size={16} />
              {sent ? "Message envoyé !" : "Envoyer"}
            </button>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={18} className="text-brand-500" />
              <h3 className="text-base font-semibold text-heading">
                Contact direct
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted mb-0.5">Email support</p>
                <a href="mailto:support@faktura.io" className="text-sm text-brand-500 font-medium hover:text-brand-600 transition-colors">support@faktura.io</a>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Téléphone</p>
                <a href="tel:+22890001234" className="text-sm font-medium text-heading hover:text-brand-500 transition-colors">+228 90 00 12 34</a>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Horaires</p>
                <p className="text-sm text-body">Lun - Ven, 8h - 18h (GMT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
