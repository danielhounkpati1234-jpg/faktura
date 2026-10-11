"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Invoice, Client, Transaction, WalletAccount } from "@/types";
import { recentInvoices as fallbackInvoices } from "@/lib/data";
import { useAuth } from "./auth-context";
import {
  fetchProfile, updateProfile as updateProfileDb,
  fetchCompany, updateCompany as updateCompanyDb,
  fetchRegional, updateRegional as updateRegionalDb,
  fetchClients, createClient as createClientDb, updateClientDb, deleteClientDb,
  fetchInvoices, createInvoice as createInvoiceDb, updateInvoiceDb, deleteInvoiceDb,
  fetchTransactions, fetchWalletAccounts,
  createTransaction as createTransactionDb,
} from "./supabase-queries";

export interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export interface CompanyInfo {
  name: string;
  nif: string;
  address: string;
  sector: string;
  website: string;
  billingEmail: string;
  phone: string;
  legalText: string;
}

export interface RegionalSettings {
  country: string;
  tvaRate: number;
  currency: string;
  invoicePrefix: string;
  paymentDelay: string;
}

const countryTvaRates: Record<string, number> = {
  "Togo": 18,
  "Bénin": 18,
  "Côte d'Ivoire": 18,
  "Sénégal": 18,
  "Burkina Faso": 18,
  "Mali": 18,
  "Niger": 19,
  "Guinée": 18,
  "Ghana": 15,
  "Nigeria": 7.5,
  "Cameroun": 19.25,
  "France": 20,
};

interface AppState {
  loading: boolean;
  profile: ProfileInfo;
  setProfile: (info: ProfileInfo) => Promise<void>;
  company: CompanyInfo;
  setCompany: (info: CompanyInfo) => Promise<void>;
  regional: RegionalSettings;
  setRegional: (settings: RegionalSettings) => Promise<void>;
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => Promise<Client>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>;
  walletAccounts: WalletAccount[];
  countryTvaRates: Record<string, number>;
}

const AppContext = createContext<AppState | null>(null);

const defaultProfile: ProfileInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
};

const defaultCompany: CompanyInfo = {
  name: "",
  nif: "",
  address: "",
  sector: "",
  website: "",
  billingEmail: "",
  phone: "",
  legalText: "",
};

const defaultRegional: RegionalSettings = {
  country: "Togo",
  tvaRate: 18,
  currency: "FCFA (XOF)",
  invoicePrefix: "FAK",
  paymentDelay: "30 jours",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfileState] = useState<ProfileInfo>(defaultProfile);
  const [company, setCompanyState] = useState<CompanyInfo>(defaultCompany);
  const [regional, setRegionalState] = useState<RegionalSettings>(defaultRegional);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletAccounts, setWalletAccounts] = useState<WalletAccount[]>([]);

  useEffect(() => {
    if (!user) {
      setInvoices(fallbackInvoices);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAll() {
      try {
        const [prof, comp, reg, invs, cls, txns, wallets] = await Promise.all([
          fetchProfile(),
          fetchCompany(),
          fetchRegional(),
          fetchInvoices(),
          fetchClients(),
          fetchTransactions(),
          fetchWalletAccounts(),
        ]);

        if (cancelled) return;

        setProfileState(prof);
        setCompanyState(comp);
        setRegionalState(reg);
        setInvoices(invs);
        setClients(cls);
        setTransactions(txns);
        setWalletAccounts(wallets);
      } catch (err) {
        console.error("Failed to load data from Supabase:", err);
        setInvoices(fallbackInvoices);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    loadAll();

    return () => { cancelled = true; };
  }, [user]);

  // ---- Profile ----
  const setProfile = useCallback(async (info: ProfileInfo) => {
    const prev = profile;
    setProfileState(info);
    try {
      if (user) await updateProfileDb(info);
    } catch {
      setProfileState(prev);
      throw new Error("Erreur lors de la sauvegarde du profil");
    }
  }, [user, profile]);

  // ---- Company ----
  const setCompany = useCallback(async (info: CompanyInfo) => {
    const prev = company;
    setCompanyState(info);
    try {
      if (user) await updateCompanyDb(info);
    } catch {
      setCompanyState(prev);
      throw new Error("Erreur lors de la sauvegarde de l'entreprise");
    }
  }, [user, company]);

  // ---- Regional ----
  const setRegional = useCallback(async (settings: RegionalSettings) => {
    const prev = regional;
    setRegionalState(settings);
    try {
      if (user) await updateRegionalDb(settings);
    } catch {
      setRegionalState(prev);
      throw new Error("Erreur lors de la sauvegarde des paramètres régionaux");
    }
  }, [user, regional]);

  // ---- Invoices ----
  const addInvoice = useCallback(async (invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev]);
    try {
      if (user) {
        const created = await createInvoiceDb(invoice);
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoice.id ? created : inv))
        );
      }
    } catch {
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
      throw new Error("Erreur lors de la création de la facture");
    }
  }, [user]);

  const updateInvoice = useCallback(async (id: string, data: Partial<Invoice>) => {
    const prev = invoices;
    setInvoices((curr) =>
      curr.map((inv) => (inv.id === id ? { ...inv, ...data } : inv))
    );
    try {
      if (user) await updateInvoiceDb(id, data, data.lines);
    } catch {
      setInvoices(prev);
      throw new Error("Erreur lors de la mise à jour de la facture");
    }
  }, [user, invoices]);

  const deleteInvoice = useCallback(async (id: string) => {
    const prev = invoices;
    setInvoices((curr) => curr.filter((inv) => inv.id !== id));
    try {
      if (user) await deleteInvoiceDb(id);
    } catch {
      setInvoices(prev);
      throw new Error("Erreur lors de la suppression de la facture");
    }
  }, [user, invoices]);

  // ---- Clients ----
  const addClient = useCallback(async (client: Omit<Client, "id">): Promise<Client> => {
    const tempId = crypto.randomUUID();
    const tempClient: Client = { id: tempId, ...client };
    setClients((prev) => [tempClient, ...prev]);
    try {
      if (user) {
        const created = await createClientDb(client);
        setClients((prev) =>
          prev.map((c) => (c.id === tempId ? created : c))
        );
        return created;
      }
      return tempClient;
    } catch {
      setClients((prev) => prev.filter((c) => c.id !== tempId));
      throw new Error("Erreur lors de la création du client");
    }
  }, [user]);

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
    const prev = clients;
    setClients((curr) =>
      curr.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    try {
      if (user) await updateClientDb(id, data);
    } catch {
      setClients(prev);
      throw new Error("Erreur lors de la mise à jour du client");
    }
  }, [user, clients]);

  // ---- Transactions ----
  const addTransaction = useCallback(async (tx: Omit<Transaction, "id">) => {
    const tempId = crypto.randomUUID();
    const tempTx: Transaction = { id: tempId, ...tx };
    setTransactions((prev) => [tempTx, ...prev]);
    try {
      if (user) {
        const created = await createTransactionDb(tx);
        setTransactions((prev) =>
          prev.map((t) => (t.id === tempId ? created : t))
        );
      }
    } catch {
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      throw new Error("Erreur lors de la création de la transaction");
    }
  }, [user]);

  const deleteClient = useCallback(async (id: string) => {
    const prev = clients;
    setClients((curr) => curr.filter((c) => c.id !== id));
    try {
      if (user) await deleteClientDb(id);
    } catch {
      setClients(prev);
      throw new Error("Erreur lors de la suppression du client");
    }
  }, [user, clients]);

  return (
    <AppContext.Provider
      value={{
        loading,
        profile,
        setProfile,
        company,
        setCompany,
        regional,
        setRegional,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        clients,
        addClient,
        updateClient,
        deleteClient,
        transactions,
        addTransaction,
        walletAccounts,
        countryTvaRates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
