"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createReleaseOrder } from "../actions";

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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">New Release Order</h1>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* RO Details */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="RO Number"
                value={form.ro_number}
                onChange={(v) => update("ro_number", v)}
                required
              />
              <Field
                label="Date"
                type="date"
                value={form.date}
                onChange={(v) => update("date", v)}
                required
              />
            </div>
          </section>

          {/* Client */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Client</h2>
            <Field
              label="Client Name"
              value={form.client_name}
              onChange={(v) => update("client_name", v)}
              placeholder="Type client name (auto-created if new)"
              required
            />
          </section>

          {/* Publication Details */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Publication Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Publication"
                value={form.publication}
                onChange={(v) => update("publication", v)}
                required
              />
              <Field
                label="Edition"
                value={form.edition}
                onChange={(v) => update("edition", v)}
                required
              />
              <Field
                label="Advertisement Category"
                value={form.advertisement_category}
                onChange={(v) => update("advertisement_category", v)}
                required
              />
              <Field
                label="Caption"
                value={form.caption}
                onChange={(v) => update("caption", v)}
                required
              />
              <Field
                label="Size"
                value={form.size}
                onChange={(v) => update("size", v)}
                required
              />
              <Field
                label="Publishing Date"
                type="date"
                value={form.publishing_date}
                onChange={(v) => update("publishing_date", v)}
                required
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Pricing</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field
                label="Rate"
                type="number"
                value={form.rate}
                onChange={(v) => update("rate", v)}
                min="0"
                step="0.01"
                required
              />
              <Field
                label="Card Rate"
                type="number"
                value={form.card_rate}
                onChange={(v) => update("card_rate", v)}
                min="0"
                step="0.01"
                required
              />
              <Field
                label="Discount"
                type="number"
                value={form.discount}
                onChange={(v) => update("discount", v)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="mt-6 rounded-md bg-gray-50 p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Net Amount</span>
                  <p className="text-lg font-semibold">
                    {calculated.net_amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">GST (5%)</span>
                  <p className="text-lg font-semibold">
                    {calculated.gst.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Total Amount</span>
                  <p className="text-lg font-bold text-green-700">
                    {calculated.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Additional</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Special Comment
              </label>
              <textarea
                value={form.special_comment}
                onChange={(e) => update("special_comment", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Release Order"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
