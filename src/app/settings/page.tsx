"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Save,
  Camera,
  Check,
  LogOut,
  Smartphone,
  Mail,
  FileText,
  AlertTriangle,
  ExternalLink,
  Lock,
  Key,
  Receipt,
  Zap,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/app-store";
import SettingsLoading from "./loading";

const tabs = [
  { id: "profile", label: "Profil", icon: User, desc: "Vos informations" },
  { id: "company", label: "Entreprise", icon: Building2, desc: "Infos societe" },
  { id: "billing", label: "Facturation", icon: CreditCard, desc: "Plan & factures" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alertes email" },
  { id: "security", label: "Securite", icon: Shield, desc: "Mot de passe & 2FA" },
  { id: "locale", label: "Regional", icon: Globe, desc: "Langue & format" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState("");
  const { loading, profile, setProfile, company, setCompany, regional, setRegional, countryTvaRates } = useAppStore();

  const [profileForm, setProfileForm] = useState(profile);
  const [companyForm, setCompanyForm] = useState(company);
  const [regionalForm, setRegionalForm] = useState(regional);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    setCompanyForm(company);
  }, [company]);

  useEffect(() => {
    setRegionalForm(regional);
  }, [regional]);

  const showSaved = (message: string) => {
    setSaveModalMessage(message);
    setShowSaveModal(true);
  };

  const handleSaveProfile = async () => {
    await setProfile(profileForm);
    showSaved("Vos informations personnelles ont été mises à jour avec succès.");
  };

  const handleSaveCompany = async () => {
    await setCompany(companyForm);
    showSaved("Les informations de votre entreprise ont été enregistrées.");
  };

  const handleSaveRegional = async () => {
    await setRegional(regionalForm);
    showSaved("Vos paramètres régionaux ont été mis à jour.");
  };

  const handleSaveBilling = async () => {
    await setRegional(regionalForm);
    showSaved("Vos paramètres de facturation ont été enregistrés.");
  };

  const handleSave = () => {
    showSaved("Vos paramètres ont été enregistrés avec succès.");
  };

  const handleCountryChange = (country: string) => {
    const tva = countryTvaRates[country] ?? regionalForm.tvaRate;
    setRegionalForm((prev) => ({ ...prev, country, tvaRate: tva }));
  };

  if (loading) return <SettingsLoading />;

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold text-heading">Paramètres</h1>
        <p className="text-sm text-muted mt-1">
          Configurez votre compte, votre entreprise et vos préférences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up">
        {/* Sidebar navigation */}
        <div className="lg:w-60 shrink-0">
          <nav className="bg-card rounded-2xl shadow-card p-2 space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-left transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-brand-50 text-brand-600"
                      : "text-body hover:bg-gray-50 hover:text-heading"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      activeTab === tab.id
                        ? "bg-brand-500 text-white"
                        : "bg-gray-100 text-muted"
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm truncate",
                        activeTab === tab.id ? "font-semibold" : "font-medium"
                      )}
                    >
                      {tab.label}
                    </p>
                    <p className="text-[11px] text-muted truncate">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="bg-card rounded-2xl shadow-card p-4 mt-4 hidden lg:block">
            <div className="flex items-center gap-2 text-xs text-muted mb-2">
              <AlertTriangle size={13} />
              <span className="font-medium">Zone de danger</span>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-status-overdue hover:bg-status-overdue-bg transition-colors font-medium">
              <LogOut size={15} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-heading">
                      Photo de profil
                    </h2>
                    <p className="text-sm text-muted mt-0.5">
                      Personnalisez votre avatar visible sur vos factures.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center text-2xl font-bold">
                      {(profileForm.firstName[0] || "").toUpperCase()}
                      {(profileForm.lastName[0] || "").toUpperCase()}
                    </div>
                    <button className="absolute inset-0 rounded-2xl bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera size={20} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-heading">
                      {profileForm.firstName} {profileForm.lastName}
                    </p>
                    <p className="text-sm text-muted">{profileForm.email}</p>
                    <button className="mt-2 text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">
                      Changer la photo
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-heading">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-muted mt-0.5">
                    Ces informations apparaissent sur vos factures et
                    communications.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Email professionnel
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, email: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Smartphone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Poste / Fonction
                    </label>
                    <input
                      type="text"
                      value={profileForm.role}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, role: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                </div>
                <SaveBar onSave={handleSaveProfile} />
              </div>
            </div>
          )}

          {/* ── COMPANY ── */}
          {activeTab === "company" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-heading">
                    Identité de l&apos;entreprise
                  </h2>
                  <p className="text-sm text-muted mt-0.5">
                    Ces informations figurent sur l&apos;en-tête de vos
                    factures.
                  </p>
                </div>

                <div className="flex items-center gap-5 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-brand-500 text-white flex items-center justify-center text-lg font-bold shrink-0">
                    {companyForm.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading">
                      {companyForm.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {companyForm.sector} — {companyForm.address.split(",").pop()?.trim()}
                    </p>
                  </div>
                  <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors shrink-0">
                    Changer le logo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Nom de l&apos;entreprise
                    </label>
                    <input
                      type="text"
                      value={companyForm.name}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Numéro fiscal (NIF)
                    </label>
                    <input
                      type="text"
                      value={companyForm.nif}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, nif: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Adresse complète
                    </label>
                    <input
                      type="text"
                      value={companyForm.address}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Secteur d&apos;activité
                    </label>
                    <select
                      value={companyForm.sector}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          sector: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    >
                      <option>Design & Création</option>
                      <option>Informatique & Tech</option>
                      <option>Commerce général</option>
                      <option>Services & Conseil</option>
                      <option>BTP & Construction</option>
                      <option>Éducation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Site web
                    </label>
                    <div className="relative">
                      <ExternalLink
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="url"
                        value={companyForm.website}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            website: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Email de facturation
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="email"
                        value={companyForm.billingEmail}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            billingEmail: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Téléphone entreprise
                    </label>
                    <div className="relative">
                      <Smartphone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="tel"
                        value={companyForm.phone}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                </div>
                <SaveBar onSave={handleSaveCompany} />
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-heading">
                    Mentions légales
                  </h2>
                  <p className="text-sm text-muted mt-0.5">
                    Texte ajouté automatiquement en bas de vos factures.
                  </p>
                </div>
                <textarea
                  rows={3}
                  value={companyForm.legalText}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      legalText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card resize-none"
                />
                <SaveBar onSave={handleSaveCompany} />
              </div>
            </div>
          )}

          {/* ── BILLING ── */}
          {activeTab === "billing" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown size={18} />
                        <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                          Plan actuel
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold">Plan Pro</h2>
                      <p className="text-sm mt-1 opacity-80">
                        Factures illimitées &middot; 50 clients &middot; Support
                        prioritaire
                      </p>
                    </div>
                    <div className="text-white text-right">
                      <p className="text-3xl font-bold">
                        15 000{" "}
                        <span className="text-lg font-medium opacity-80">
                          FCFA
                        </span>
                      </p>
                      <p className="text-sm opacity-80">par mois</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:px-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Factures ce mois", value: "24", max: "Illimité" },
                      { label: "Clients actifs", value: "20", max: "50" },
                      { label: "Stockage", value: "1.2 Go", max: "5 Go" },
                      { label: "Prochaine facture", value: "01/11/2026", max: "" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 bg-gray-50 rounded-xl text-center"
                      >
                        <p className="text-lg font-bold text-heading">
                          {item.value}
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {item.label}
                        </p>
                        {item.max && (
                          <p className="text-[10px] text-brand-500 font-medium mt-0.5">
                            max: {item.max}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => showSaved("La mise à niveau vers le plan Business sera disponible prochainement. Nous vous notifierons dès que cette option sera active.")}
                      className="px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors inline-flex items-center gap-2"
                    >
                      <Zap size={15} />
                      Passer au plan Business
                    </button>
                    <button
                      onClick={() => showSaved("La gestion d'abonnement sera disponible prochainement. Votre plan actuel reste actif.")}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-colors"
                    >
                      Gérer l&apos;abonnement
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Receipt size={18} className="text-brand-500" />
                    <h2 className="text-lg font-semibold text-heading">
                      Paramètres de facturation
                    </h2>
                  </div>
                  <p className="text-sm text-muted mt-0.5">
                    Valeurs par défaut appliquées à chaque nouvelle facture.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Devise
                    </label>
                    <select
                      value={regionalForm.currency}
                      onChange={(e) =>
                        setRegionalForm({
                          ...regionalForm,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    >
                      <option>FCFA (XOF)</option>
                      <option>EUR (€)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      TVA par défaut
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={regionalForm.tvaRate}
                        onChange={(e) =>
                          setRegionalForm({
                            ...regionalForm,
                            tvaRate: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Préfixe facture
                    </label>
                    <div className="relative">
                      <FileText
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="text"
                        value={regionalForm.invoicePrefix}
                        onChange={(e) =>
                          setRegionalForm({
                            ...regionalForm,
                            invoicePrefix: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Délai de paiement par défaut
                  </label>
                  <select
                    value={regionalForm.paymentDelay}
                    onChange={(e) =>
                      setRegionalForm({
                        ...regionalForm,
                        paymentDelay: e.target.value,
                      })
                    }
                    className="w-full max-w-xs px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  >
                    <option>30 jours</option>
                    <option>15 jours</option>
                    <option>45 jours</option>
                    <option>60 jours</option>
                    <option>À réception</option>
                  </select>
                </div>
                <SaveBar onSave={handleSaveBilling} />
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-heading">
                    Notifications par email
                  </h2>
                  <p className="text-sm text-muted mt-0.5">
                    Choisissez les événements pour lesquels vous souhaitez être
                    notifié.
                  </p>
                </div>
                <div className="space-y-1">
                  {[
                    {
                      title: "Facture payée",
                      desc: "Quand un client règle une facture",
                      icon: Check,
                      defaultOn: true,
                    },
                    {
                      title: "Facture en retard",
                      desc: "Quand une facture dépasse son échéance",
                      icon: AlertTriangle,
                      defaultOn: true,
                    },
                    {
                      title: "Facture consultée",
                      desc: "Quand un client ouvre le lien de sa facture",
                      icon: FileText,
                      defaultOn: false,
                    },
                    {
                      title: "Nouveau client",
                      desc: "Lors de l'ajout d'un nouveau client",
                      icon: User,
                      defaultOn: false,
                    },
                    {
                      title: "Rapport hebdomadaire",
                      desc: "Résumé de votre activité chaque lundi",
                      icon: Receipt,
                      defaultOn: true,
                    },
                    {
                      title: "Rapport mensuel",
                      desc: "Bilan complet en fin de mois",
                      icon: Receipt,
                      defaultOn: true,
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-gray-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 text-muted flex items-center justify-center shrink-0">
                            <Icon size={15} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-heading">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch defaultOn={item.defaultOn} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-heading">
                    Rappels automatiques
                  </h2>
                  <p className="text-sm text-muted mt-0.5">
                    Envoyer un rappel automatique aux clients en retard de
                    paiement.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Premier rappel après
                    </label>
                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                      <option>3 jours</option>
                      <option>7 jours</option>
                      <option>14 jours</option>
                      <option>Désactivé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Deuxième rappel après
                    </label>
                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                      <option>7 jours</option>
                      <option>14 jours</option>
                      <option>30 jours</option>
                      <option>Désactivé</option>
                    </select>
                  </div>
                </div>
                <SaveBar onSave={handleSave} />
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-0.5">
                  <Lock size={18} className="text-brand-500" />
                  <h2 className="text-lg font-semibold text-heading">
                    Changer le mot de passe
                  </h2>
                </div>
                <p className="text-sm text-muted mb-6">
                  Utilisez un mot de passe fort avec au moins 8 caractères.
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1.5">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1.5">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                      />
                    </div>
                  </div>
                </div>
                <SaveBar
                  onSave={handleSave}
                  label="Mettre à jour"
                />
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-0.5">
                  <Key size={18} className="text-brand-500" />
                  <h2 className="text-lg font-semibold text-heading">
                    Authentification à deux facteurs (2FA)
                  </h2>
                </div>
                <p className="text-sm text-muted mb-6">
                  Protégez votre compte avec une vérification supplémentaire.
                </p>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-status-overdue-bg text-status-overdue flex items-center justify-center">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading">
                        2FA désactivé
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Votre compte est vulnérable sans la 2FA
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch defaultOn={false} />
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-heading mb-4">
                  Sessions actives
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      device: "Chrome — Windows 11",
                      location: "Lomé, Togo",
                      current: true,
                    },
                    {
                      device: "Safari — iPhone 15",
                      location: "Lomé, Togo",
                      current: false,
                    },
                  ].map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-muted flex items-center justify-center">
                          <Smartphone size={15} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-heading">
                            {session.device}
                          </p>
                          <p className="text-xs text-muted">
                            {session.location}
                          </p>
                        </div>
                      </div>
                      {session.current ? (
                        <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">
                          Session actuelle
                        </span>
                      ) : (
                        <button className="text-xs text-status-overdue hover:underline font-medium">
                          Révoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LOCALE ── */}
          {activeTab === "locale" && (
            <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-heading">
                  Paramètres régionaux
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  Personnalisez les formats d&apos;affichage selon votre région.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Langue de l&apos;interface
                  </label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                    <option>Français</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Fuseau horaire
                  </label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                    <option>GMT+0 — Lomé, Accra</option>
                    <option>GMT+1 — Lagos, Douala, Cotonou</option>
                    <option>GMT+1 — Paris, Bruxelles</option>
                    <option>GMT+2 — Le Caire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Format de date
                  </label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                    <option>JJ/MM/AAAA (10/10/2026)</option>
                    <option>MM/JJ/AAAA (10/10/2026)</option>
                    <option>AAAA-MM-JJ (2026-10-10)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Pays
                  </label>
                  <select
                    value={regionalForm.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                  >
                    {Object.keys(countryTvaRates).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1.5">
                    TVA automatique : {countryTvaRates[regionalForm.country] ?? regionalForm.tvaRate}%
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Format des nombres
                  </label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                    <option>1 000 000 (espace)</option>
                    <option>1,000,000 (virgule)</option>
                    <option>1.000.000 (point)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Premier jour de la semaine
                  </label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card">
                    <option>Lundi</option>
                    <option>Dimanche</option>
                  </select>
                </div>
              </div>
              <SaveBar onSave={handleSaveRegional} />
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-sm w-full p-6 animate-fade-in-up text-center">
            <div className="w-14 h-14 rounded-full bg-status-paid/10 text-status-paid flex items-center justify-center mx-auto mb-4">
              <Check size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-semibold text-heading mb-1.5">
              Enregistré !
            </h3>
            <p className="text-sm text-body mb-6">
              {saveModalMessage}
            </p>
            <button
              onClick={() => setShowSaveModal(false)}
              className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SaveBar({
  onSave,
  label = "Enregistrer",
}: {
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="border-t border-gray-100 mt-8 pt-5 flex items-center justify-between">
      <p className="text-xs text-muted hidden sm:block">
        Les modifications sont enregistrées pour votre compte.
      </p>
      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-brand-500 text-white hover:bg-brand-600"
      >
        <Save size={16} />
        {label}
      </button>
    </div>
  );
}

function ToggleSwitch({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        "w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0",
        on ? "bg-brand-500" : "bg-gray-200"
      )}
    >
      <div
        className={cn(
          "absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
          on ? "translate-x-[22px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}
