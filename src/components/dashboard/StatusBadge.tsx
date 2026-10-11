import { InvoiceStatus } from "@/types";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  paid: { label: "Payée", dot: "bg-status-paid", bg: "bg-status-paid-bg", text: "text-status-paid" },
  sent: { label: "Envoyée", dot: "bg-status-sent", bg: "bg-status-sent-bg", text: "text-status-sent" },
  draft: { label: "Brouillon", dot: "bg-status-draft", bg: "bg-status-draft-bg", text: "text-status-draft" },
  overdue: { label: "En retard", dot: "bg-status-overdue", bg: "bg-status-overdue-bg", text: "text-status-overdue" },
};

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}
      aria-label={config.label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
