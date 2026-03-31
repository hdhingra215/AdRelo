"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { SoftInput } from "@/components/ui/soft-input";
import { createBill } from "../actions";

// ── Number to words converter (Indian system) ──

function numberToWords(num: number): string {
  if (num === 0) return "Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convertChunk(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertChunk(n % 100) : "");
  }

  const intPart = Math.floor(Math.abs(num));
  const decimal = Math.round((Math.abs(num) - intPart) * 100);

  const parts: string[] = [];

  const crore = Math.floor(intPart / 10000000);
  const lakh = Math.floor((intPart % 10000000) / 100000);
  const thousand = Math.floor((intPart % 100000) / 1000);
  const remainder = intPart % 1000;

  if (crore) parts.push(convertChunk(crore) + " Crore");
  if (lakh) parts.push(convertChunk(lakh) + " Lakh");
  if (thousand) parts.push(convertChunk(thousand) + " Thousand");
  if (remainder) parts.push(convertChunk(remainder));

  let result = "Rupees " + (parts.join(" ") || "Zero");
  if (decimal > 0) {
    result += " and " + convertChunk(decimal) + " Paise";
  }
  result += " Only";

  return result;
}

// ── Generate bill number: BILL-YYYYMMDD-XXXX ──

function generateBillNumber(): string {
  const d = new Date();
  const date = d.getFullYear().toString() +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    d.getDate().toString().padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BILL-${date}-${rand}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

const GST_RATE = 0.05;

interface ROData {
  id: string;
  ro_number: string;
  client_id: string;
  publication: string;
  edition: string;
  advertisement_category: string;
  size: string;
  caption: string;
  publishing_date: string;
  bill_generated: boolean;
  clients: { name: string } | null;
}

function BillForm() {
  const searchParams = useSearchParams();
  const roId = searchParams.get("ro_id") ?? "";

  const [ro, setRO] = useState<ROData | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [billNumber] = useState(generateBillNumber);
  const [date] = useState(todayISO);

  // User-editable billing fields
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [amountInWords, setAmountInWords] = useState("");

  // Auto-calculate net, gst, total from amount & discount
  const calculated = useMemo(() => {
    const amt = Number(amount) || 0;
    const disc = Number(discount) || 0;
    const net_amount = Math.max(amt - disc, 0);
    const gst = parseFloat((net_amount * GST_RATE).toFixed(2));
    const total_amount = parseFloat((net_amount + gst).toFixed(2));
    return { net_amount, gst, total_amount };
  }, [amount, discount]);

  // Update amount in words when total changes
  useEffect(() => {
    if (calculated.total_amount > 0) {
      setAmountInWords(numberToWords(calculated.total_amount));
    }
  }, [calculated.total_amount]);

  const fetchRO = useCallback(async () => {
    if (!roId) {
      setFetchError("No release order specified.");
      return;
    }

    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("release_orders")
      .select("id, ro_number, client_id, publication, edition, advertisement_category, size, caption, publishing_date, bill_generated, clients(name)")
      .eq("id", roId)
      .single();

    if (err || !data) {
      setFetchError("Release order not found.");
      return;
    }

    if (data.bill_generated) {
      setFetchError("A bill has already been generated for this release order.");
      return;
    }

    const roData: ROData = {
      ...data,
      clients:
        data.clients && typeof data.clients === "object" && !Array.isArray(data.clients)
          ? (data.clients as { name: string })
          : null,
    };

    setRO(roData);
  }, [roId]);

  useEffect(() => {
    fetchRO();
  }, [fetchRO]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ro) return;
    setError("");
    setLoading(true);

    const amt = Number(amount) || 0;
    const disc = Number(discount) || 0;

    if (amt <= 0) {
      setError("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    try {
      const result = await createBill({
        bill_number: billNumber,
        date,
        release_order_id: ro.id,
        client_id: ro.client_id,
        amount: amt,
        discount: disc,
        net_amount: calculated.net_amount,
        gst: calculated.gst,
        total_amount: calculated.total_amount,
        amount_in_words: amountInWords,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // redirect() throws NEXT_REDIRECT — expected on success
    } finally {
      setLoading(false);
    }
  }

  const clientName = ro?.clients?.name ?? "\u2014";

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
          <span className="text-sm text-muted">New Bill</span>
        </div>
        {roId && (
          <SoftButton href={`/release-orders/${roId}`} variant="ghost" size="sm">
            &larr; Back to RO
          </SoftButton>
        )}
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-3xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Generate bill
        </h1>
        <p className="mt-2 text-base text-muted">
          Create a bill from release order
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        {fetchError ? (
          <div className="rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft">
            {fetchError}
          </div>
        ) : !ro ? (
          <div className="rounded-xl bg-white/80 px-5 py-4 text-sm text-muted shadow-soft">
            Loading release order...
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 stagger">
              {/* Bill Info */}
              <SoftCard title="Bill Information">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">Bill Number</label>
                    <div className="rounded-lg border border-black/[0.06] bg-black/[0.02] px-3.5 py-2.5 text-sm font-medium text-foreground">
                      {billNumber}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">Date</label>
                    <div className="rounded-lg border border-black/[0.06] bg-black/[0.02] px-3.5 py-2.5 text-sm text-foreground">
                      {date}
                    </div>
                  </div>
                </div>
              </SoftCard>

              {/* Client & RO Details (auto-filled) */}
              <SoftCard title="Client & Advertisement Details">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Client</span>
                    <span className="text-sm font-medium text-foreground">{clientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">RO Number</span>
                    <span className="text-sm font-medium text-foreground">{ro.ro_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Publication</span>
                    <span className="text-sm text-foreground/70">{ro.publication}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Edition</span>
                    <span className="text-sm text-foreground/70">{ro.edition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Category</span>
                    <span className="text-sm text-foreground/70">{ro.advertisement_category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Size</span>
                    <span className="text-sm text-foreground/70">{ro.size}</span>
                  </div>
                </div>
              </SoftCard>

              {/* Billing Amounts (user enters) */}
              <SoftCard title="Billing Amounts">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SoftInput
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={setAmount}
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                    required
                  />
                  <SoftInput
                    label="Discount"
                    type="number"
                    value={discount}
                    onChange={setDiscount}
                    min="0"
                    step="0.01"
                    placeholder="Enter discount (if any)"
                  />
                </div>

                {/* Auto-calculated summary */}
                {Number(amount) > 0 && (
                  <div className="mt-5 rounded-xl bg-black/[0.02] border border-black/[0.04] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Net Amount</span>
                      <span className="text-sm tabular-nums font-semibold text-foreground">
                        {calculated.net_amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">GST (5%)</span>
                      <span className="text-sm tabular-nums text-foreground/70">
                        {calculated.gst.toFixed(2)}
                      </span>
                    </div>
                    <hr className="border-black/[0.04]" />
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm font-medium text-muted">Total Amount</span>
                      <span className="text-xl font-bold tabular-nums text-foreground">
                        {calculated.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </SoftCard>

              {/* Amount in Words */}
              <SoftCard title="Amount in Words">
                <SoftInput
                  label="Total in words"
                  value={amountInWords}
                  onChange={setAmountInWords}
                  required
                />
              </SoftCard>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-black/90 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Creating Bill\u2026" : "Generate Bill"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function NewBillPage() {
  return (
    <Suspense>
      <BillForm />
    </Suspense>
  );
}
