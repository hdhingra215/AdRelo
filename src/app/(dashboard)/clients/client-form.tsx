"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SoftInput } from "@/components/ui/soft-input";
import { createClientAction, updateClientAction } from "./actions";

interface Client {
  id: string;
  name: string;
  phone: string;
  gst_number: string;
  address: string;
}

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const router = useRouter();
  const isEdit = !!client;

  const [form, setForm] = useState({
    name: client?.name ?? "",
    phone: client?.phone ?? "",
    gst_number: client?.gst_number ?? "",
    address: client?.address ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const result = isEdit
        ? await updateClientAction(client!.id, form)
        : await createClientAction(form);

      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
        onClose();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-card-lg p-6 fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? "Edit Client" : "Add Client"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-black/[0.04] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <SoftInput
            label="Client Name"
            value={form.name}
            onChange={(v) => update("name", v)}
            placeholder="e.g. ABC Corporation"
            required
          />
          <SoftInput
            label="Phone"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            placeholder="e.g. 9876543210"
          />
          <SoftInput
            label="GST Number"
            value={form.gst_number}
            onChange={(v) => update("gst_number", v)}
            placeholder="e.g. 09AABCU9603R1ZM"
          />
          <SoftInput
            label="Address"
            value={form.address}
            onChange={(v) => update("address", v)}
            placeholder="Full address"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-black/[0.06] bg-white/80 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-black/[0.02] active:scale-[0.99]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-black/90 active:scale-[0.99] disabled:opacity-50"
            >
              {saving ? "Saving\u2026" : isEdit ? "Update" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
