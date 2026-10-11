import { Invoice, InvoiceLine, Client, Transaction, WalletAccount } from "@/types";
import { ProfileInfo, CompanyInfo, RegionalSettings } from "./app-store";

// ---- DB row types (snake_case) ----

interface DbProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

interface DbCompany {
  id: string;
  user_id: string;
  name: string;
  nif: string;
  address: string;
  sector: string;
  website: string;
  billing_email: string;
  phone: string;
  legal_text: string;
}

interface DbRegional {
  id: string;
  user_id: string;
  country: string;
  tva_rate: number;
  currency: string;
  invoice_prefix: string;
  payment_delay: string;
}

interface DbClient {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface DbInvoice {
  id: string;
  user_id: string;
  number: string;
  client_id: string | null;
  client_name: string;
  client_email: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  notes: string | null;
}

interface DbInvoiceLine {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

interface DbTransaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  client_name: string | null;
  invoice_number: string | null;
  payment_method: string;
}

interface DbWalletAccount {
  id: string;
  user_id: string;
  name: string;
  bank: string;
  balance: number;
  account_number: string;
  type: string;
}

// ---- FROM DB ----

export function mapProfile(row: DbProfile): ProfileInfo {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
  };
}

export function mapCompany(row: DbCompany): CompanyInfo {
  return {
    name: row.name,
    nif: row.nif,
    address: row.address,
    sector: row.sector,
    website: row.website,
    billingEmail: row.billing_email,
    phone: row.phone,
    legalText: row.legal_text,
  };
}

export function mapRegional(row: DbRegional): RegionalSettings {
  return {
    country: row.country,
    tvaRate: row.tva_rate,
    currency: row.currency,
    invoicePrefix: row.invoice_prefix,
    paymentDelay: row.payment_delay,
  };
}

export function mapClient(row: DbClient): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
  };
}

export function mapInvoiceLine(row: DbInvoiceLine): InvoiceLine {
  return {
    id: row.id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
  };
}

export function mapInvoice(row: DbInvoice & { invoice_lines?: DbInvoiceLine[] }): Invoice {
  const lines = (row.invoice_lines || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapInvoiceLine);

  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id || "",
    clientName: row.client_name,
    clientEmail: row.client_email,
    amount: row.amount,
    status: row.status as Invoice["status"],
    issueDate: row.issue_date,
    dueDate: row.due_date,
    lines,
    notes: row.notes || undefined,
  };
}

export function mapTransaction(row: DbTransaction): Transaction {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    type: row.type as Transaction["type"],
    category: row.category,
    date: row.date,
    clientName: row.client_name || undefined,
    invoiceNumber: row.invoice_number || undefined,
    paymentMethod: row.payment_method,
  };
}

export function mapWalletAccount(row: DbWalletAccount): WalletAccount {
  return {
    id: row.id,
    name: row.name,
    bank: row.bank,
    balance: row.balance,
    accountNumber: row.account_number,
    type: row.type as WalletAccount["type"],
  };
}

// ---- TO DB ----

export function profileToDb(p: ProfileInfo) {
  return {
    first_name: p.firstName,
    last_name: p.lastName,
    email: p.email,
    phone: p.phone,
    role: p.role,
  };
}

export function companyToDb(c: CompanyInfo) {
  return {
    name: c.name,
    nif: c.nif,
    address: c.address,
    sector: c.sector,
    website: c.website,
    billing_email: c.billingEmail,
    phone: c.phone,
    legal_text: c.legalText,
  };
}

export function regionalToDb(r: RegionalSettings) {
  return {
    country: r.country,
    tva_rate: r.tvaRate,
    currency: r.currency,
    invoice_prefix: r.invoicePrefix,
    payment_delay: r.paymentDelay,
  };
}

export function invoiceToDb(inv: Invoice, userId: string) {
  return {
    user_id: userId,
    number: inv.number,
    client_id: inv.clientId || null,
    client_name: inv.clientName,
    client_email: inv.clientEmail,
    amount: inv.amount,
    status: inv.status,
    issue_date: inv.issueDate,
    due_date: inv.dueDate,
    notes: inv.notes || null,
  };
}

export function invoiceLineToDb(line: InvoiceLine, invoiceId: string, sortOrder: number) {
  return {
    invoice_id: invoiceId,
    description: line.description,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    sort_order: sortOrder,
  };
}

export function clientToDb(client: Omit<Client, "id">, userId: string) {
  return {
    user_id: userId,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
  };
}

export function transactionToDb(t: Omit<Transaction, "id">, userId: string) {
  return {
    user_id: userId,
    description: t.description,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: t.date,
    client_name: t.clientName || null,
    invoice_number: t.invoiceNumber || null,
    payment_method: t.paymentMethod,
  };
}
