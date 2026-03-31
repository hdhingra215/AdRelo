import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/print-button";

export default async function ROPrintPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order, error } = await supabase
    .from("release_orders")
    .select("*, clients(name)")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const { data: settings } = await supabase
    .from("agency_settings")
    .select(
      "firm_name, gst_number, bank_account, ifsc, branch, upi_id, payment_instructions, qr_code_url"
    )
    .eq("user_id", user.id)
    .single();

  const clientName =
    order.clients &&
    typeof order.clients === "object" &&
    !Array.isArray(order.clients)
      ? (order.clients as { name: string }).name
      : "\u2014";

  const firmName = settings?.firm_name || "Sai Kripa Publicity";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print { display: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; background-image: none !important; animation: none !important; }
            }
            .print-page { max-width: 794px; margin: 0 auto; padding: 48px; background: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #000; min-height: 100vh; }
            .print-page * { font-family: inherit; }
            .p-header { text-align: center; margin-bottom: 8px; }
            .p-firm { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
            .p-gst { font-size: 10px; color: #666; margin-top: 2px; }
            .p-title { background: #1a1a1a; color: #fff; text-align: center; padding: 7px 0; font-size: 12px; font-weight: 700; letter-spacing: 1px; margin: 12px 0; }
            .p-info { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 16px; }
            .p-info strong { font-weight: 600; }
            .p-sh { background: #f5f5f5; padding: 5px 12px; font-size: 10px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px; }
            .p-row { display: flex; justify-content: space-between; padding: 3px 12px; font-size: 11px; }
            .p-row .p-l { color: #555; }
            .p-row .p-v { color: #222; }
            .p-row .p-v.p-b { font-weight: 700; color: #000; }
            .p-ph { display: flex; justify-content: space-between; background: #fafafa; padding: 5px 12px; font-size: 9px; font-weight: 700; color: #666; text-transform: uppercase; }
            .p-pr { display: flex; justify-content: space-between; padding: 4px 12px; font-size: 11px; }
            .p-pr .p-pv { text-align: right; min-width: 100px; }
            .p-pr .p-pv.p-b { font-weight: 700; }
            .p-pr .p-pv.p-red { color: #cc0000; }
            .p-hr { border: none; border-top: 0.5px solid #e0e0e0; margin: 4px 12px; }
            .p-total { background: #1a1a1a; color: #fff; display: flex; justify-content: space-between; padding: 9px 12px; font-size: 12px; font-weight: 700; margin-top: 4px; }
            .p-comment { font-size: 11px; color: #333; padding: 4px 12px; line-height: 1.5; white-space: pre-wrap; }
            .p-bank { display: flex; gap: 24px; padding: 4px 12px; }
            .p-bank-col { flex: 1; }
            .p-bank-title { font-size: 9px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 6px; }
            .p-bank-body { font-size: 11px; color: #222; line-height: 1.6; }
            .p-pay-note { font-size: 10px; color: #666; padding: 8px 12px; }
            .p-qr { text-align: center; margin-top: 8px; }
            .p-qr img { width: 80px; height: 80px; }
            .p-qr-label { font-size: 9px; color: #888; margin-top: 2px; }
            .p-sig { text-align: right; margin-top: 40px; padding-right: 12px; }
            .p-sig-line { width: 150px; border-top: 0.5px solid #ccc; margin-left: auto; margin-bottom: 4px; }
            .p-sig-label { font-size: 10px; color: #666; }
            .p-sig-for { font-size: 11px; color: #333; margin-bottom: 24px; }
            .p-footer { text-align: center; font-size: 9px; color: #aaa; margin-top: 40px; padding-top: 12px; border-top: 0.5px solid #eee; }
          `,
        }}
      />
      <div className="print-page">
        <div className="p-header">
          <div className="p-firm">{firmName.toUpperCase()}</div>
          {settings?.gst_number && (
            <div className="p-gst">GSTIN: {settings.gst_number}</div>
          )}
        </div>

        <div className="p-title">RELEASE ORDER</div>

        <div className="p-info">
          <div>
            <strong>RO No:</strong> {order.ro_number}
          </div>
          <div>
            <strong>Date:</strong> {order.date}
          </div>
        </div>

        <div className="p-sh">Client</div>
        <div className="p-row">
          <span className="p-l">Client Name</span>
          <span className="p-v p-b">{clientName}</span>
        </div>

        <div className="p-sh">Publication Details</div>
        <div className="p-row">
          <span className="p-l">Publication</span>
          <span className="p-v p-b">{String(order.publication ?? "\u2014")}</span>
        </div>
        <div className="p-row">
          <span className="p-l">Edition</span>
          <span className="p-v">{String(order.edition ?? "\u2014")}</span>
        </div>
        <div className="p-row">
          <span className="p-l">Category</span>
          <span className="p-v">
            {String(order.advertisement_category ?? "\u2014")}
          </span>
        </div>
        <div className="p-row">
          <span className="p-l">Caption</span>
          <span className="p-v">{String(order.caption ?? "\u2014")}</span>
        </div>
        <div className="p-row">
          <span className="p-l">Size</span>
          <span className="p-v">{String(order.size ?? "\u2014")}</span>
        </div>
        <div className="p-row">
          <span className="p-l">Publishing Date</span>
          <span className="p-v">
            {String(order.publishing_date ?? "\u2014")}
          </span>
        </div>

        <div className="p-sh">Pricing</div>
        <div className="p-ph">
          <span>Description</span>
          <span>Amount</span>
        </div>
        <div className="p-pr">
          <span>Rate (Size x Card Rate)</span>
          <span className="p-pv">{fmt(order.rate)}</span>
        </div>
        <div className="p-pr">
          <span>Card Rate: {fmt(order.card_rate)} per sq cm</span>
          <span className="p-pv" />
        </div>
        <hr className="p-hr" />
        <div className="p-pr">
          <span>Discount</span>
          <span className="p-pv p-red">- {fmt(order.discount)}</span>
        </div>
        <hr className="p-hr" />
        <div className="p-pr">
          <span>Net Amount</span>
          <span className="p-pv p-b">{fmt(order.net_amount)}</span>
        </div>
        <div className="p-pr">
          <span>GST (5%)</span>
          <span className="p-pv">{fmt(order.gst)}</span>
        </div>
        <div className="p-total">
          <span>TOTAL AMOUNT</span>
          <span>{fmt(order.total_amount)}</span>
        </div>

        {order.special_comment && (
          <>
            <div className="p-sh">Special Instructions</div>
            <div className="p-comment">{String(order.special_comment)}</div>
          </>
        )}

        {settings && (
          <>
            <div className="p-sh">Agency &amp; Bank Details</div>
            <div className="p-bank">
              <div className="p-bank-col">
                <div className="p-bank-title">Agency</div>
                <div className="p-bank-body">
                  {settings.firm_name && <div>{settings.firm_name}</div>}
                  {settings.gst_number && (
                    <div style={{ fontSize: 10, color: "#666" }}>
                      GSTIN: {settings.gst_number}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-bank-col">
                <div className="p-bank-title">Bank Details</div>
                <div className="p-bank-body">
                  {settings.bank_account && (
                    <div>A/C: {settings.bank_account}</div>
                  )}
                  {settings.ifsc && <div>IFSC: {settings.ifsc}</div>}
                  {settings.branch && <div>Branch: {settings.branch}</div>}
                  {settings.upi_id && <div>UPI: {settings.upi_id}</div>}
                </div>
              </div>
            </div>
            {settings.payment_instructions && (
              <div className="p-pay-note">{settings.payment_instructions}</div>
            )}
            {settings.qr_code_url && (
              <div className="p-qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.qr_code_url} alt="QR Code" />
                <div className="p-qr-label">Scan to Pay</div>
              </div>
            )}
          </>
        )}

        <div className="p-sig">
          <div className="p-sig-for">For {firmName}</div>
          <div className="p-sig-line" />
          <div className="p-sig-label">Authorized Signatory</div>
        </div>

        <div className="p-footer">
          Generated by AdRelo &mdash; The Agency Engine
        </div>
      </div>

      <PrintButton />
    </>
  );
}

function fmt(value: number | string): string {
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
