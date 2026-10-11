export type InvoiceStatus = "paid" | "sent" | "draft" | "overdue";
export type TransactionType = "income" | "expense";

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  clientName?: string;
  invoiceNumber?: string;
  paymentMethod: string;
}

export interface WalletAccount {
  id: string;
  name: string;
  bank: string;
  balance: number;
  accountNumber: string;
  type: "checking" | "savings";
}

export interface Stat {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarInitials: string;
}
