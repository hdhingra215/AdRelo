"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createReleaseOrder } from "../actions";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { SoftInput } from "@/components/ui/soft-input";
import { SoftSelect } from "@/components/ui/soft-select";
import { ClientSearch } from "@/components/ui/client-search";

const GST_RATE = 0.05;

// ── Predefined options ──

const PUBLICATIONS = [
  "Times of India",
  "Hindustan Times",
  "The Hindu",
  "Indian Express",
  "Economic Times",
  "Dainik Jagran",
  "Dainik Bhaskar",
  "Amar Ujala",
  "Navbharat Times",
  "Maharashtra Times",
  "Lokmat",
  "Sakal",
  "Punjab Kesari",
  "Rajasthan Patrika",
  "Deccan Herald",
  "Deccan Chronicle",
  "The Telegraph",
  "The Statesman",
  "Mid-Day",
  "DNA",
];

const EDITION_MAP: Record<string, string[]> = {
  "Times of India": ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Lucknow", "Jaipur", "All Editions"],
  "Hindustan Times": ["Delhi", "Mumbai", "Lucknow", "Chandigarh", "Patna", "Ranchi", "All Editions"],
  "The Hindu": ["Chennai", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Mumbai", "All Editions"],
  "Indian Express": ["Delhi", "Mumbai", "Pune", "Kolkata", "Bangalore", "Chennai", "All Editions"],
  "Economic Times": ["Delhi", "Mumbai", "Bangalore", "Kolkata", "All Editions"],
  "Dainik Jagran": ["Delhi", "Lucknow", "Kanpur", "Meerut", "Agra", "Varanasi", "All Editions"],
  "Dainik Bhaskar": ["Bhopal", "Jaipur", "Ahmedabad", "Indore", "Chandigarh", "All Editions"],
  "Amar Ujala": ["Delhi", "Agra", "Lucknow", "Meerut", "Dehradun", "All Editions"],
  "Navbharat Times": ["Delhi", "Mumbai", "Lucknow", "All Editions"],
  "Maharashtra Times": ["Mumbai", "Pune", "Nagpur", "All Editions"],
  "Lokmat": ["Mumbai", "Pune", "Nagpur", "Aurangabad", "All Editions"],
  "Sakal": ["Pune", "Mumbai", "Nashik", "Kolhapur", "All Editions"],
  "Punjab Kesari": ["Delhi", "Jalandhar", "Chandigarh", "All Editions"],
  "Rajasthan Patrika": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "All Editions"],
  "Deccan Herald": ["Bangalore", "All Editions"],
  "Deccan Chronicle": ["Hyderabad", "Chennai", "All Editions"],
  "The Telegraph": ["Kolkata", "All Editions"],
  "The Statesman": ["Kolkata", "Delhi", "All Editions"],
  "Mid-Day": ["Mumbai", "All Editions"],
  "DNA": ["Mumbai", "Ahmedabad", "All Editions"],
};

const DEFAULT_EDITIONS = ["Main", "City", "National", "Regional", "All Editions"];

const AD_CATEGORIES = [
  "Display",
  "Classified",
  "Classified Display",
  "Tender Notice",
  "Public Notice",
  "Obituary",
  "Matrimonial",
  "Remembrance",
  "Court Notice",
  "Property",
  "Recruitment",
  "Education",
  "Business",
  "Name Change",
  "Lost & Found",
];

const POSITIONS = [
  "Any Page",
  "Front Page",
  "Back Page",
  "Page 3",
  "Page 5",
  "City Page",
  "Business Page",
  "Sport Page",
  "Entertainment Page",
  "Jacket / Wrap",
];

// ── Size parser: "7x4" → { w: 7, h: 4 } ──

function parseSize(size: string): { w: number; h: number } | null {
  const match = size.trim().match(/^(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return { w: parseFloat(match[1]), h: parseFloat(match[2]) };
}

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
    position: "",
    remark: "",
    card_rate: "",
    discount: "",
    publishing_date: "",
    special_comment: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset edition when publication changes
      if (field === "publication") {
        next.edition = "";
      }
      return next;
    });
  }

  // ── Rate calculation ──
  const cardRate = Number(form.card_rate) || 0;
  const discountPct = Math.min(Math.max(Number(form.discount) || 0, 0), 100);
  const sizeW = parseSize(form.size)?.w ?? 0;
  const sizeH = parseSize(form.size)?.h ?? 0;
  const sizeParsed = sizeW > 0 && sizeH > 0 ? { w: sizeW, h: sizeH } : null;

  const rate = useMemo(() => {
    if (sizeW > 0 && sizeH > 0 && cardRate > 0) {
      return sizeW * sizeH * cardRate;
    }
    return 0;
  }, [sizeW, sizeH, cardRate]);

  const calculated = useMemo(() => {
    const discount_amount = parseFloat((rate * (discountPct / 100)).toFixed(2));
    const net_amount = Math.max(rate - discount_amount, 0);
    const gst = parseFloat((net_amount * GST_RATE).toFixed(2));
    const total_amount = parseFloat((net_amount + gst).toFixed(2));
    return { rate, discount_amount, net_amount, gst, total_amount };
  }, [rate, discountPct]);

  // Edition options based on selected publication
  const editionOptions = EDITION_MAP[form.publication] ?? DEFAULT_EDITIONS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Build special_comment with position and remark
    const commentParts: string[] = [];
    if (form.position) commentParts.push(`Position: ${form.position}`);
    if (form.remark) commentParts.push(`Remark: ${form.remark}`);
    if (form.special_comment) commentParts.push(form.special_comment);
    const specialComment = commentParts.join("\n");

    try {
      const result = await createReleaseOrder({
        ro_number: form.ro_number,
        date: form.date,
        client_name: form.client_name,
        publication: form.publication,
        edition: form.edition,
        advertisement_category: form.advertisement_category,
        caption: form.caption,
        size: form.size,
        rate: calculated.rate,
        card_rate: cardRate,
        discount: calculated.discount_amount,
        publishing_date: form.publishing_date,
        special_comment: specialComment,
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
          {/* Order Details */}
          <SoftCard title="Order Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SoftInput
                label="RO Number"
                value={form.ro_number}
                onChange={(v) => update("ro_number", v)}
                required
              />
              <SoftInput
                label="Date"
                type="date"
                value={form.date}
                onChange={(v) => update("date", v)}
                required
              />
            </div>
          </SoftCard>

          {/* Client */}
          <SoftCard title="Client">
            <ClientSearch
              value={form.client_name}
              onChange={(v) => update("client_name", v)}
              required
            />
          </SoftCard>

          {/* Publication Details */}
          <SoftCard title="Publication Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SoftSelect
                label="Publication"
                value={form.publication}
                onChange={(v) => update("publication", v)}
                options={PUBLICATIONS}
                placeholder="Select publication"
                required
              />
              <SoftSelect
                label="Edition"
                value={form.edition}
                onChange={(v) => update("edition", v)}
                options={editionOptions}
                placeholder={form.publication ? "Select edition" : "Select publication first"}
                required
              />
              <SoftSelect
                label="Advertisement Category"
                value={form.advertisement_category}
                onChange={(v) => update("advertisement_category", v)}
                options={AD_CATEGORIES}
                placeholder="Select category"
                required
              />
              <SoftInput
                label="Caption"
                value={form.caption}
                onChange={(v) => update("caption", v)}
                placeholder="Ad caption / heading"
                required
              />
              <SoftInput
                label="Size (e.g. 7x4)"
                value={form.size}
                onChange={(v) => update("size", v)}
                placeholder="Width x Height in cm"
                required
              />
              <SoftSelect
                label="Position"
                value={form.position}
                onChange={(v) => update("position", v)}
                options={POSITIONS}
                placeholder="Select position"
              />
              <SoftInput
                label="Publishing Date"
                type="date"
                value={form.publishing_date}
                onChange={(v) => update("publishing_date", v)}
                required
              />
              <SoftInput
                label="Remark"
                value={form.remark}
                onChange={(v) => update("remark", v)}
                placeholder="Optional remark"
              />
            </div>
          </SoftCard>

          {/* Pricing */}
          <SoftCard title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SoftInput
                label="Card Rate (per sq cm)"
                type="number"
                value={form.card_rate}
                onChange={(v) => update("card_rate", v)}
                min="0"
                step="0.01"
                placeholder="e.g. 580"
                required
              />
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Discount (%)<span className="text-foreground/30 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => update("discount", e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 15"
                    required
                    className="w-full rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-foreground/25 focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all duration-200"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">%</span>
                </div>
              </div>
            </div>

            {/* Auto-calculated rate display */}
            {sizeParsed && cardRate > 0 && (
              <div className="mt-3 rounded-lg bg-black/[0.02] border border-black/[0.04] px-4 py-3">
                <p className="text-xs text-muted">
                  Rate = {sizeParsed.w} &times; {sizeParsed.h} &times;{" "}
                  {cardRate.toFixed(2)} ={" "}
                  <span className="font-semibold text-foreground">
                    {rate.toFixed(2)}
                  </span>
                </p>
              </div>
            )}

            {/* Calculation summary */}
            <div className="mt-5 rounded-xl bg-black/[0.02] border border-black/[0.04] p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <span className="text-xs font-medium text-muted">Rate</span>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                    {calculated.rate.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted">
                    Discount ({discountPct}%)
                  </span>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-red-600/70">
                    &minus; {calculated.discount_amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted">
                    Net Amount
                  </span>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                    {calculated.net_amount.toFixed(2)}
                  </p>
                </div>
              </div>
              <hr className="border-black/[0.04]" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium text-muted">
                    GST (5%)
                  </span>
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

          {/* Additional */}
          <SoftCard title="Additional">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">
                Special Comment
              </label>
              <textarea
                value={form.special_comment}
                onChange={(e) => update("special_comment", e.target.value)}
                rows={3}
                placeholder="Any additional notes..."
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
