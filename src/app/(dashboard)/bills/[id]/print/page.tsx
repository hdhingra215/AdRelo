import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/print-button";

export default async function BillPrintPage({
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

  const { data: bill, error } = await supabase
    .from("bills")
    .select(
      "*, clients(name), release_orders(ro_number, advertisement_category, publication, edition, size, caption, publishing_date)"
    )
    .eq("id", params.id)
    .single();

  if (error || !bill) {
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
    bill.clients &&
    typeof bill.clients === "object" &&
    !Array.isArray(bill.clients)
      ? (bill.clients as { name: string }).name
      : "\u2014";

  const ro =
    bill.release_orders &&
    typeof bill.release_orders === "object" &&
    !Array.isArray(bill.release_orders)
      ? (bill.release_orders as {
          ro_number: string;
          advertisement_category: string;
          publication: string;
          edition: string;
          size: string;
          caption: string;
          publishing_date: string;
        })
      : null;

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
            .p-words { font-size: 11px; padding: 10px 12px; }
            .p-words strong { font-weight: 600; color: #333; }
            .p-words span { color: #444; }
            .p-pay { display: flex; gap: 16px; padding: 4px 12px; }
            .p-pay-text { flex: 1; font-size: 11px; color: #222; line-height: 1.6; }
            .p-pay-note { font-size: 10px; color: #666; padding: 4px 12px; }
            .p-qr { text-align: center; }
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

        <div className="p-title">TAX INVOICE</div>

        <div className="p-info">
          <div>
            <strong>Invoice No:</strong> {bill.bill_number}
          </div>
          <div>
            <strong>Date:</strong> {bill.date}
          </div>
        </div>

        <div className="p-sh">Bill To</div>
        <div className="p-row">
          <span className="p-l">Client</span>
          <span className="p-v p-b">{clientName}</span>
        </div>

        {ro && (
          <>
            <div className="p-sh">Advertisement Details</div>
            <div className="p-row">
              <span className="p-l">RO Number</span>
              <span className="p-v p-b">{ro.ro_number}</span>
            </div>
            <div className="p-row">
              <span className="p-l">Publication</span>
              <span className="p-v">{ro.publication}</span>
            </div>
            <div className="p-row">
              <span className="p-l">Edition</span>
              <span className="p-v">{ro.edition}</span>
            </div>
            <div className="p-row">
              <span className="p-l">Category</span>
              <span className="p-v">{ro.advertisement_category}</span>
            </div>
            <div className="p-row">
              <span className="p-l">Caption</span>
              <span className="p-v">{ro.caption || "\u2014"}</span>
            </div>
            <div className="p-row">
              <span className="p-l">Size</span>
              <span className="p-v">{ro.size}</span>
            </div>
            {ro.publishing_date && (
              <div className="p-row">
                <span className="p-l">Published On</span>
                <span className="p-v">{ro.publishing_date}</span>
              </div>
            )}
          </>
        )}

        <div className="p-sh">Billing</div>
        <div className="p-ph">
          <span>Description</span>
          <span>Amount ({"\u20B9"})</span>
        </div>
        <div className="p-pr">
          <span>Amount</span>
          <span className="p-pv">{fmt(bill.amount)}</span>
        </div>
        {Number(bill.discount) > 0 && (
          <div className="p-pr">
            <span>Discount</span>
            <span className="p-pv p-red">- {fmt(bill.discount)}</span>
          </div>
        )}
        <hr className="p-hr" />
        <div className="p-pr">
          <span>Net Amount</span>
          <span className="p-pv p-b">{fmt(bill.net_amount)}</span>
        </div>
        <div className="p-pr">
          <span>GST (5%)</span>
          <span className="p-pv">{fmt(bill.gst)}</span>
        </div>
        <div className="p-total">
          <span>TOTAL AMOUNT</span>
          <span>{fmt(bill.total_amount)}</span>
        </div>

        {bill.amount_in_words && (
          <div className="p-words">
            <strong>Amount in Words: </strong>
            <span>{String(bill.amount_in_words)}</span>
          </div>
        )}

        {settings &&
          (settings.bank_account || settings.upi_id || settings.qr_code_url) && (
            <>
              <div className="p-sh">Payment Details</div>
              <div className="p-pay">
                <div className="p-pay-text">
                  {settings.firm_name && <div>Pay to: {settings.firm_name}</div>}
                  {settings.bank_account && (
                    <div>Account: {settings.bank_account}</div>
                  )}
                  {settings.ifsc && <div>IFSC: {settings.ifsc}</div>}
                  {settings.branch && <div>Branch: {settings.branch}</div>}
                  {settings.upi_id && <div>UPI: {settings.upi_id}</div>}
                </div>
                {settings.qr_code_url && (
                  <div className="p-qr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={settings.qr_code_url} alt="QR Code" />
                    <div className="p-qr-label">Scan to Pay</div>
                  </div>
                )}
              </div>
              {settings.payment_instructions && (
                <div className="p-pay-note">
                  {settings.payment_instructions}
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
