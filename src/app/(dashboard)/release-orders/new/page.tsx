"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createReleaseOrder } from "../actions";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { SoftInput } from "@/components/ui/soft-input";

const GST_RATE = 0.05;

export default function NewReleaseOrderPage() {
  const [form, setForm] = useState({
    ro_number: "",
    date: "",
    client_name: "",
    publication: "",
    edition: "",
    advertisement_category: "",
    caption: "",
    size: "",
    rate: "",
    card_rate: "",
    discount: "",
    publishing_date: "",
    special_comment: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const rate = Number(form.rate) || 0;
  const discount = Number(form.discount) || 0;

  const calculated = useMemo(() => {
    const net_amount = Math.max(rate - discount, 0);
    const gst = parseFloat((net_amount * GST_RATE).toFixed(2));
    const total_amount = parseFloat((net_amount + gst).toFixed(2));
    return { net_amount, gst, total_amount };
  }, [rate, discount]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createReleaseOrder({
        ...form,
        rate,
        card_rate: Number(form.card_rate) || 0,
        discount,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // redirect() throws NEXT_REDIRECT — this is expected on success
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm font-semibold text-foreground">
              AdRelo
            </span>
          </Link>
          <span className="text-foreground/15 mx-1">/</span>
          <span className="text-sm text-muted">New Order</span>
        </div>
        <SoftButton href="/release-orders" variant="ghost" size="sm">
          &larr; All Orders
        </SoftButton>
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-3xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Create order
        </h1>
        <p className="mt-2 text-base text-muted">
          Fill in the details to create a new release order
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        {error && (
          <div className="mb-6 rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 stagger">
          <SoftCard title="Order Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SoftInput label="RO Number" value={form.ro_number} onChange={(v) => update("ro_number", v)} required />
              <SoftInput label="Date" type="date" value={form.date} onChange={(v) => update("date", v)} required />
            </div>
          </SoftCard>

          <SoftCard title="Client">
            <SoftInput label="Client Name" value={form.client_name} onChange={(v) => update("client_name", v)} placeholder="Type client name (auto-created if new)" required />
          </SoftCard>

          <SoftCard title="Publication Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SoftInput label="Publication" value={form.publication} onChange={(v) => update("publication", v)} required />
              <SoftInput label="Edition" value={form.edition} onChange={(v) => update("edition", v)} required />
              <SoftInput label="Advertisement Category" value={form.advertisement_category} onChange={(v) => update("advertisement_category", v)} required />
              <SoftInput label="Caption" value={form.caption} onChange={(v) => update("caption", v)} required />
              <SoftInput label="Size" value={form.size} onChange={(v) => update("size", v)} required />
              <SoftInput label="Publishing Date" type="date" value={form.publishing_date} onChange={(v) => update("publishing_date", v)} required />
            </div>
          </SoftCard>

          <SoftCard title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SoftInput label="Rate" type="number" value={form.rate} onChange={(v) => update("rate", v)} min="0" step="0.01" required />
              <SoftInput label="Card Rate" type="number" value={form.card_rate} onChange={(v) => update("card_rate", v)} min="0" step="0.01" required />
              <SoftInput label="Discount" type="number" value={form.discount} onChange={(v) => update("discount", v)} min="0" step="0.01" required />
            </div>

            <div className="mt-5 rounded-xl bg-black/[0.02] border border-black/[0.04] p-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs font-medium text-muted">Net Amount</span>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                    {calculated.net_amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted">GST (5%)</span>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                    {calculated.gst.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-accent">Total</span>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                    {calculated.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </SoftCard>

          <SoftCard title="Additional">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">
                Special Comment
              </label>
              <textarea
                value={form.special_comment}
                onChange={(e) => update("special_comment", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all duration-200 resize-none"
              />
            </div>
          </SoftCard>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-black/90 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Creating\u2026" : "Create Release Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
