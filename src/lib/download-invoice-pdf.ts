import { Invoice } from "@/types";
import { formatFCFA, formatDate } from "./utils";
import { CompanyInfo, ProfileInfo, RegionalSettings } from "./app-store";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function downloadInvoicePDF(
  invoice: Invoice,
  company: CompanyInfo,
  regional: RegionalSettings,
  profile?: ProfileInfo
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const emitterName = company.name || [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—";
  const emitterEmail = company.billingEmail || profile?.email || "";
  const emitterPhone = company.phone || profile?.phone || "";
  const emitterAddress = company.address || "";
  const emitterNif = company.nif || "";

  const subtotal = invoice.lines.reduce(
    (sum, l) => sum + l.quantity * l.unitPrice,
    0
  );
  const tvaRate = regional.tvaRate;
  const tva = Math.round(subtotal * (tvaRate / 100));
  const total = subtotal + tva;

  const lineRows = invoice.lines
    .filter((l) => l.description || l.quantity > 0)
    .map(
      (l) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px">${escapeHtml(l.description || "Article")}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:13px">${l.quantity}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap;font-size:13px">${formatFCFA(l.unitPrice)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;white-space:nowrap;font-size:13px">${formatFCFA(Math.round(l.quantity * l.unitPrice))}</td>
      </tr>`
    )
    .join("");

  const noLines = lineRows === "";

  const initials = emitterName !== "—"
    ? emitterName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "FK";

  const statusLabel: Record<string, string> = {
    draft: "Brouillon",
    sent: "Envoyée",
    paid: "Payée",
    overdue: "En retard",
  };
  const statusColor: Record<string, string> = {
    draft: "#6B7280",
    sent: "#EA580C",
    paid: "#16A34A",
    overdue: "#DC2626",
  };

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Facture ${invoice.number}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,sans-serif;color:#1e293b;padding:0;font-size:13px;background:#fff}
  .page{max-width:800px;margin:0 auto;padding:48px 40px}

  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #1A7A6D}
  .header-left h1{font-size:28px;font-weight:800;color:#1A7A6D;letter-spacing:-0.5px}
  .header-left .invoice-num{font-size:14px;color:#64748b;margin-top:4px}
  .header-right{text-align:right}
  .logo{width:56px;height:56px;background:#1A7A6D;border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:20px;margin-left:auto;margin-bottom:8px}
  .status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}

  .parties{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:32px}
  .party{padding:20px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}
  .party-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1A7A6D;margin-bottom:10px}
  .party-name{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px}
  .party-detail{font-size:12px;color:#64748b;line-height:1.6}

  .dates{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:32px}
  .date-block{padding:14px 20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
  .date-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:4px}
  .date-value{font-size:14px;font-weight:600;color:#0f172a}

  .items-table{width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0}
  .items-table thead{background:#f8fafc}
  .items-table th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:700;padding:12px 16px;border-bottom:2px solid #e2e8f0}
  .items-table th:nth-child(2){text-align:center}
  .items-table th:nth-child(3),.items-table th:nth-child(4){text-align:right}
  .empty-row{padding:20px 16px;text-align:center;color:#94a3b8;font-style:italic;font-size:13px}

  .summary{display:flex;justify-content:flex-end;margin-bottom:32px}
  .summary-table{width:280px}
  .summary-table tr td{padding:8px 0;font-size:13px}
  .summary-table tr td:first-child{color:#64748b}
  .summary-table tr td:last-child{text-align:right;font-weight:500}
  .summary-table .total-row td{border-top:2px solid #1A7A6D;padding-top:12px;font-weight:700;font-size:16px;color:#1A7A6D}
  .summary-table .total-row td:first-child{color:#0f172a}

  .notes{margin-bottom:24px;padding:16px 20px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a}
  .notes-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#92400e;margin-bottom:6px}
  .notes-text{font-size:12px;color:#78350f;line-height:1.6}

  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center}
  .footer p{font-size:11px;color:#94a3b8;line-height:1.6}
  .footer .brand{color:#1A7A6D;font-weight:600}

  @media print{
    body{padding:0}
    .page{padding:24px 20px}
    @page{margin:12mm;size:A4}
  }
</style></head><body>
<div class="page">
  <div class="header">
    <div class="header-left">
      <h1>FACTURE</h1>
      <p class="invoice-num">N° ${escapeHtml(invoice.number)}</p>
    </div>
    <div class="header-right">
      <div class="logo">${escapeHtml(initials)}</div>
      <span class="status" style="background:${statusColor[invoice.status] || "#6B7280"}20;color:${statusColor[invoice.status] || "#6B7280"}">${statusLabel[invoice.status] || invoice.status}</span>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <p class="party-label">Émis par</p>
      <p class="party-name">${escapeHtml(emitterName)}</p>
      <div class="party-detail">
        ${emitterAddress ? `<p>${escapeHtml(emitterAddress)}</p>` : ""}
        ${emitterEmail ? `<p>${escapeHtml(emitterEmail)}</p>` : ""}
        ${emitterPhone ? `<p>${escapeHtml(emitterPhone)}</p>` : ""}
        ${emitterNif ? `<p>NIF : ${escapeHtml(emitterNif)}</p>` : ""}
      </div>
    </div>
    <div class="party">
      <p class="party-label">Facturé à</p>
      <p class="party-name">${escapeHtml(invoice.clientName || "—")}</p>
      <div class="party-detail">
        ${invoice.clientEmail ? `<p>${escapeHtml(invoice.clientEmail)}</p>` : ""}
      </div>
    </div>
  </div>

  <div class="dates">
    <div class="date-block">
      <p class="date-label">Date d'émission</p>
      <p class="date-value">${formatDate(invoice.issueDate)}</p>
    </div>
    <div class="date-block">
      <p class="date-label">Date d'échéance</p>
      <p class="date-value">${formatDate(invoice.dueDate)}</p>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Article</th>
        <th style="text-align:center">Qté</th>
        <th style="text-align:right">Prix unitaire</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${noLines ? `<tr><td colspan="4" class="empty-row">Aucun article</td></tr>` : lineRows}
    </tbody>
  </table>

  <div class="summary">
    <table class="summary-table">
      <tr>
        <td>Sous-total HT</td>
        <td>${formatFCFA(subtotal)}</td>
      </tr>
      <tr>
        <td>TVA (${tvaRate}%)</td>
        <td>${formatFCFA(tva)}</td>
      </tr>
      <tr class="total-row">
        <td>Total TTC</td>
        <td>${formatFCFA(total)}</td>
      </tr>
    </table>
  </div>

  ${invoice.notes ? `<div class="notes"><p class="notes-label">Notes</p><p class="notes-text">${escapeHtml(invoice.notes)}</p></div>` : ""}

  <div class="footer">
    ${company.legalText ? `<p>${escapeHtml(company.legalText)}</p>` : ""}
    <p class="brand">Généré avec Faktura</p>
  </div>
</div>
</body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
