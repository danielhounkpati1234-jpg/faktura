import { Invoice, InvoiceLine, Client, Transaction, WalletAccount } from "@/types";
import { ProfileInfo, CompanyInfo, RegionalSettings } from "./app-store";
import { getSupabase } from "./supabase";
import {
  mapProfile, mapCompany, mapRegional, mapClient, mapInvoice,
  mapTransaction, mapWalletAccount,
  profileToDb, companyToDb, regionalToDb, invoiceToDb, invoiceLineToDb,
  clientToDb, transactionToDb,
} from "./mappers";

function sb() {
  return getSupabase();
}

// ---- Profile ----

export async function fetchProfile(): Promise<ProfileInfo> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return mapProfile(data);
}

export async function updateProfile(profile: ProfileInfo): Promise<void> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await sb()
    .from("profiles")
    .update(profileToDb(profile))
    .eq("id", user.id);

  if (error) throw error;
}

// ---- Company ----

export async function fetchCompany(): Promise<CompanyInfo> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return mapCompany(data);
}

export async function updateCompany(company: CompanyInfo): Promise<void> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await sb()
    .from("companies")
    .update(companyToDb(company))
    .eq("user_id", user.id);

  if (error) throw error;
}

// ---- Regional Settings ----

export async function fetchRegional(): Promise<RegionalSettings> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("regional_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return mapRegional(data);
}

export async function updateRegional(regional: RegionalSettings): Promise<void> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await sb()
    .from("regional_settings")
    .update(regionalToDb(regional))
    .eq("user_id", user.id);

  if (error) throw error;
}

// ---- Clients ----

export async function fetchClients(): Promise<Client[]> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapClient);
}

export async function createClient(client: Omit<Client, "id">): Promise<Client> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("clients")
    .insert(clientToDb(client, user.id))
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
}

export async function updateClientDb(id: string, client: Partial<Client>): Promise<void> {
  const updates: Record<string, unknown> = {};
  if (client.name !== undefined) updates.name = client.name;
  if (client.email !== undefined) updates.email = client.email;
  if (client.phone !== undefined) updates.phone = client.phone;
  if (client.address !== undefined) updates.address = client.address;

  const { error } = await sb()
    .from("clients")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteClientDb(id: string): Promise<void> {
  const { error } = await sb()
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ---- Invoices ----

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("invoices")
    .select("*, invoice_lines(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapInvoice);
}

export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("invoices")
    .insert(invoiceToDb(invoice, user.id))
    .select()
    .single();

  if (error) throw error;

  if (invoice.lines.length > 0) {
    const lines = invoice.lines.map((line, i) =>
      invoiceLineToDb(line, data.id, i)
    );
    const { error: linesError } = await sb()
      .from("invoice_lines")
      .insert(lines);

    if (linesError) throw linesError;
  }

  const created = await sb()
    .from("invoices")
    .select("*, invoice_lines(*)")
    .eq("id", data.id)
    .single();

  if (created.error) throw created.error;
  return mapInvoice(created.data);
}

export async function updateInvoiceDb(
  id: string,
  updates: Partial<Invoice>,
  lines?: InvoiceLine[]
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.number !== undefined) dbUpdates.number = updates.number;
  if (updates.clientId !== undefined) dbUpdates.client_id = updates.clientId || null;
  if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
  if (updates.clientEmail !== undefined) dbUpdates.client_email = updates.clientEmail;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.issueDate !== undefined) dbUpdates.issue_date = updates.issueDate;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;

  if (Object.keys(dbUpdates).length > 0) {
    const { error } = await sb()
      .from("invoices")
      .update(dbUpdates)
      .eq("id", id);

    if (error) throw error;
  }

  if (lines) {
    const { error: delError } = await sb()
      .from("invoice_lines")
      .delete()
      .eq("invoice_id", id);

    if (delError) throw delError;

    if (lines.length > 0) {
      const dbLines = lines.map((line, i) => invoiceLineToDb(line, id, i));
      const { error: insError } = await sb()
        .from("invoice_lines")
        .insert(dbLines);

      if (insError) throw insError;
    }
  }
}

export async function deleteInvoiceDb(id: string): Promise<void> {
  const { error } = await sb()
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ---- Transactions ----

export async function createTransaction(tx: Omit<Transaction, "id">): Promise<Transaction> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("transactions")
    .insert(transactionToDb(tx, user.id))
    .select()
    .single();

  if (error) throw error;
  return mapTransaction(data);
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapTransaction);
}

// ---- Wallet Accounts ----

export async function fetchWalletAccounts(): Promise<WalletAccount[]> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb()
    .from("wallet_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapWalletAccount);
}
