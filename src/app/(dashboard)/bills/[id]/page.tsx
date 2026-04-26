import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BillDetailPage({
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
    .select("*, clients(name), release_orders(ro_number)")
    .eq("id", params.id)
    .single();

  if (error || !bill) {
    notFound();
  }

  const { data: settings } = await supabase
    .from("agency_settings")
    .select("firm_name, gst_number, bank_account, ifsc, branch, upi_id, payment_instructions, qr_code_url")
    .eq("user_id", user.id)
    .single();

  const clientName =
    bill.clients && typeof bill.clients === "object" && !Array.isArray(bill.clients)
      ? (bill.clients as { name: string }).name
      : "\u2014";

  const roNumber =
    bill.release_orders && typeof bill.release_orders === "object" && !Array.isArray(bill.release_orders)
      ? (bill.release_orders as { ro_number: string }).ro_number
      : "\u2014";

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm font-semibold text-foreground">AdRelo</span>
          </Link>
          <span className="text-foreground/15 mx-1">/</span>
          <span className="text-sm text-foreground font-medium">
            Bill {bill.bill_number}
          </span>
        </div>
        <a
          href={`/bills/${params.id}/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-white/60 backdrop-blur border border-black/[0.06] px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:bg-white hover:text-foreground hover:shadow-soft"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 7.159l-.351.064" />
          </svg>
          Print Invoice
        </a>
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-3xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Bill details
        </h1>
        <p className="mt-2 text-base text-muted">
          Invoice {bill.bill_number}
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8 space-y-5 stagger">
        {/* Bill Info */}
        <Card title="Bill Information">
          <Row label="Bill Number" value={bill.bill_number} />
          <Row label="Date" value={bill.date} />
        </Card>

        {/* Source */}
        <Card title="Source">
          <Row label="Release Order" value={roNumber} />
          <Row label="Client" value={clientName} />
        </Card>

        {/* Amounts */}
        <Card title="Billing Amounts">
          <Row label="Amount (Rate)" value={fmt(bill.amount)} />
          <Row label="Discount" value={fmt(bill.discount)} />
          <Divider />
          <Row label="Net Amount" value={fmt(bill.net_amount)} bold />
          <Row label="GST (5%)" value={fmt(bill.gst)} />
          <Divider />
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-muted">Total Amount</span>
            <span className="text-xl font-bold tabular-nums text-foreground">
              {fmt(bill.total_amount)}
            </span>
          </div>
        </Card>

        {/* Amount in Words */}
        <Card title="Amount in Words">
          <p className="text-sm text-foreground/70">{bill.amount_in_words}</p>
        </Card>

        {/* Payment Details */}
        {settings && (settings.bank_account || settings.upi_id) && (
          <Card title="Payment Details">
            {settings.bank_account && (
              <Row label="Account Number" value={settings.bank_account} />
            )}
            {settings.ifsc && <Row label="IFSC Code" value={settings.ifsc} />}
            {settings.branch && <Row label="Branch" value={settings.branch} />}
            {settings.upi_id && <Row label="UPI ID" value={settings.upi_id} />}
            {settings.payment_instructions && (
              <>
                <Divider />
                <p className="text-sm text-foreground/70">{settings.payment_instructions}</p>
              </>
            )}
            {settings.qr_code_url && (
              <>
                <Divider />
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.qr_code_url}
                    alt="Payment QR Code"
                    className="h-32 w-32 rounded-lg border border-black/[0.06]"
                  />
                </div>
              </>
            )}
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/release-orders/${bill.release_order_id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white/60 backdrop-blur border border-black/[0.06] px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:bg-white hover:text-foreground hover:shadow-soft"
          >
            View Release Order
          </Link>
        </div>
      </div>
    </div>
  );
}

function fmt(value: number | string): string {
  return Number(value).toFixed(2);
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-card">
      <div className="px-6 pt-5 pb-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h2>
      </div>
      <div className="px-6 pb-6 pt-3 space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span className={`tabular-nums text-sm ${bold ? "font-semibold text-foreground" : "text-foreground/70"}`}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <hr className="border-black/[0.04]" />;
}
