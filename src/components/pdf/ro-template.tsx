/**
 * Premium Release Order PDF template.
 *
 * Renders a print-ready A4 document using Tailwind.
 * Accepts structured props so it can be driven from any data source.
 *
 * Usage:
 *   <ROTemplate ro={ro} client={client} agency={agency} />
 *
 * The component uses only static styles — no hover/focus/active states —
 * so it is safe for server rendering and HTML-to-PDF conversion.
 */

/* ── Types ── */

export interface ROData {
  ro_number: string;
  date: string;
  publishing_date: string;
  publication: string;
  edition: string;
  advertisement_category: string;
  caption: string;
  size: string;
  rate: number;
  card_rate: number;
  discount: number;
  net_amount: number;
  gst: number;
  total_amount: number;
  special_comment?: string;
}

export interface ClientData {
  name: string;
  gst_number?: string;
  phone?: string;
  address?: string;
}

export interface AgencyData {
  firm_name: string;
  gst_number?: string;
  address?: string;
  phone?: string;
  bank_account?: string;
  ifsc?: string;
  branch?: string;
  upi_id?: string;
}

/* ── Helpers ── */

function fmt(value: number | string): string {
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function verificationKey(ro_number: string, date: string): string {
  const raw = `${ro_number}-${date}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(8, "0").slice(0, 8);
}

/* ── Component ── */

export function ROTemplate({
  ro,
  client,
  agency,
}: {
  ro: ROData;
  client: ClientData;
  agency: AgencyData;
}) {
  const vKey = verificationKey(ro.ro_number, ro.date);

  return (
    <div
      className="mx-auto max-w-[794px] bg-white text-[#1a1a1a] font-[system-ui,-apple-system,sans-serif]"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      {/* ─────────────────── HEADER ─────────────────── */}
      <header className="px-10 pt-12 pb-8">
        <div className="flex items-start justify-between">
          {/* Left: Brand mark + Agency info */}
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#111] text-[10px] font-bold text-white">
                A
              </div>
              <h1 className="text-[22px] font-bold tracking-[0.01em] text-[#0a0a0a]">
                {agency.firm_name}
              </h1>
            </div>
            {agency.address && (
              <p className="mt-1.5 text-[11px] leading-[1.6] text-[#777] max-w-[280px]">
                {agency.address}
              </p>
            )}
            {agency.phone && (
              <p className="mt-0.5 text-[11px] text-[#777]">
                Tel: {agency.phone}
              </p>
            )}
            {agency.gst_number && (
              <p className="mt-0.5 text-[11px] text-[#777]">
                GSTIN: <span className="text-[#555]">{agency.gst_number}</span>
              </p>
            )}
          </div>

          {/* Right: RO badge + meta */}
          <div className="text-right pt-0.5">
            <div className="inline-flex items-center rounded-md bg-[#0a0a0a] px-3.5 py-1.5">
              <span className="text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                Release Order
              </span>
            </div>
            <p className="mt-3 text-[15px] font-bold text-[#0a0a0a] tabular-nums tracking-tight">
              {ro.ro_number}
            </p>
            <p className="mt-0.5 text-[11px] text-[#999]">
              {fmtDate(ro.date)}
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-8 h-px bg-[#eaeaea]" />
      </header>

      {/* ─────────────────── CLIENT INFO ─────────────────── */}
      <section className="px-10 pb-7">
        <div className="rounded-lg border border-[#f3f3f3] bg-[#fafafa] px-6 py-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#aaa] mb-3">
            Bill To
          </p>
          <p className="text-[15px] font-bold text-[#0a0a0a] tracking-tight">
            {client.name}
          </p>
          {client.address && (
            <p className="mt-1.5 text-[11px] leading-[1.6] text-[#777] max-w-[340px]">
              {client.address}
            </p>
          )}
          <div className="mt-3 flex items-center gap-6 text-[11px]">
            {client.gst_number && (
              <p className="text-[#555]">
                <span className="text-[#aaa]">GSTIN</span> &nbsp;{client.gst_number}
              </p>
            )}
            {client.phone && (
              <p className="text-[#555]">
                <span className="text-[#aaa]">Tel</span> &nbsp;{client.phone}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────── PUBLICATION DETAILS ─────────────────── */}
      <section className="px-10 pb-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#aaa] mb-3.5">
          Publication Details
        </p>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[#ddd]">
              <th className="pb-2.5 text-left font-semibold text-[#555] pr-4">Publication</th>
              <th className="pb-2.5 text-left font-semibold text-[#555] pr-4">Edition</th>
              <th className="pb-2.5 text-left font-semibold text-[#555] pr-4">Category</th>
              <th className="pb-2.5 text-left font-semibold text-[#555] pr-4">Size</th>
              <th className="pb-2.5 text-right font-semibold text-[#555]">Publish Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#f0f0f0]">
              <td className="py-3 pr-4 text-[#222] font-medium">{ro.publication}</td>
              <td className="py-3 pr-4 text-[#555]">{ro.edition}</td>
              <td className="py-3 pr-4 text-[#555]">{ro.advertisement_category}</td>
              <td className="py-3 pr-4 text-[#555]">{ro.size}</td>
              <td className="py-3 text-right text-[#555] tabular-nums">{fmtDate(ro.publishing_date)}</td>
            </tr>
          </tbody>
        </table>
        {ro.caption && (
          <p className="mt-3 text-[11px] text-[#888]">
            <span className="text-[#aaa]">Caption:</span> &nbsp;{ro.caption}
          </p>
        )}
      </section>

      {/* ─────────────────── SPECIAL INSTRUCTIONS ─────────────────── */}
      {ro.special_comment && (
        <section className="px-10 pb-6">
          <div className="flex gap-4">
            <div className="w-[3px] rounded-full bg-[#c4b5fd] flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#999] mb-1.5">
                Special Instructions
              </p>
              <p className="text-[11px] leading-relaxed text-[#555] whitespace-pre-wrap max-w-[500px]">
                {ro.special_comment}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── FINANCIAL SUMMARY ─────────────────── */}
      <section className="px-10 pb-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#aaa] mb-3.5">
          Financial Summary
        </p>
        <div className="flex justify-end">
          <div className="w-full max-w-[340px]">
            {/* Line items */}
            <div className="text-[11px]">
              <div className="flex justify-between py-[5px]">
                <span className="text-[#888]">Card Rate</span>
                <span className="tabular-nums text-[#555] text-right min-w-[100px]">{fmt(ro.card_rate)}</span>
              </div>
              <div className="flex justify-between py-[5px]">
                <span className="text-[#888]">Rate</span>
                <span className="tabular-nums text-[#555] text-right min-w-[100px]">{fmt(ro.rate)}</span>
              </div>
              {ro.discount > 0 && (
                <div className="flex justify-between py-[5px]">
                  <span className="text-[#888]">Discount</span>
                  <span className="tabular-nums text-[#c0392b] text-right min-w-[100px]">
                    &minus; {fmt(ro.discount)}
                  </span>
                </div>
              )}

              <div className="h-px bg-[#e5e5e5] my-2" />

              <div className="flex justify-between py-[5px] font-medium">
                <span className="text-[#444]">Net Amount</span>
                <span className="tabular-nums text-[#222] text-right min-w-[100px]">{fmt(ro.net_amount)}</span>
              </div>
              <div className="flex justify-between py-[5px]">
                <span className="text-[#888]">GST (5%)</span>
                <span className="tabular-nums text-[#555] text-right min-w-[100px]">{fmt(ro.gst)}</span>
              </div>
            </div>

            {/* Total */}
            <div
              className="mt-4 rounded-lg bg-[#0a0a0a] px-5 py-4 flex justify-between items-baseline"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <span className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.12em]">
                Total Payable
              </span>
              <span className="text-[20px] font-bold text-white tabular-nums tracking-tight">
                &#8377;{fmt(ro.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── BANK DETAILS ─────────────────── */}
      {agency.bank_account && (
        <section className="px-10 pb-7">
          <div className="rounded-lg border border-[#f3f3f3] bg-[#fafafa] px-6 py-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#aaa] mb-3">
              Bank Details for Payment
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
              <div>
                <span className="text-[#999]">Account: </span>
                <span className="text-[#333] tabular-nums">{agency.bank_account}</span>
              </div>
              {agency.ifsc && (
                <div>
                  <span className="text-[#999]">IFSC: </span>
                  <span className="text-[#333]">{agency.ifsc}</span>
                </div>
              )}
              {agency.branch && (
                <div>
                  <span className="text-[#999]">Branch: </span>
                  <span className="text-[#333]">{agency.branch}</span>
                </div>
              )}
              {agency.upi_id && (
                <div>
                  <span className="text-[#999]">UPI: </span>
                  <span className="text-[#333]">{agency.upi_id}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="px-10 pt-6 pb-10">
        <div className="h-px bg-[#eaeaea] mb-8" />

        <div className="flex items-end justify-between">
          {/* Verification */}
          <div>
            <p className="text-[8px] text-[#ccc] uppercase tracking-[0.12em]">
              Verification Key
            </p>
            <p className="mt-0.5 text-[10px] font-mono text-[#bbb] tracking-[0.08em]">
              {vKey}
            </p>
          </div>

          {/* Signature block */}
          <div className="text-right">
            <div className="mb-2.5 h-px w-[180px] bg-[#ddd] ml-auto" />
            <p className="text-[11px] font-medium text-[#555]">
              Authorized Signatory
            </p>
            <p className="text-[10px] text-[#aaa]">
              {agency.firm_name}
            </p>
          </div>
        </div>

        {/* Generated line */}
        <p className="mt-10 text-center text-[8px] text-[#ddd] tracking-wider">
          Generated by AdRelo
        </p>
      </footer>
    </div>
  );
}
