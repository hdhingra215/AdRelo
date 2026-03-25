"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { SoftInput } from "@/components/ui/soft-input";
import { saveSettings } from "./actions";

export default function SettingsPage() {
  const [form, setForm] = useState({
    firm_name: "",
    gst_number: "",
    bank_account: "",
    ifsc: "",
    branch: "",
    upi_id: "",
  });

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("agency_settings")
      .select("firm_name, gst_number, bank_account, ifsc, branch, upi_id")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setForm({
        firm_name: data.firm_name ?? "",
        gst_number: data.gst_number ?? "",
        bank_account: data.bank_account ?? "",
        ifsc: data.ifsc ?? "",
        branch: data.branch ?? "",
        upi_id: data.upi_id ?? "",
      });
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const result = await saveSettings(form);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Settings saved successfully.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
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
          <span className="text-sm text-muted">Settings</span>
        </div>
        <SoftButton href="/dashboard" variant="ghost" size="sm">
          &larr; Dashboard
        </SoftButton>
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-3xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Agency settings
        </h1>
        <p className="mt-2 text-base text-muted">
          Configure your firm details for invoices and documents
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        {!loaded ? (
          <div className="rounded-xl bg-white/80 px-5 py-4 text-sm text-muted shadow-soft">
            Loading settings...
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 rounded-xl bg-white/80 px-5 py-4 text-sm text-green-700 shadow-soft fade-in">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 stagger">
              <SoftCard title="Firm Details">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SoftInput
                    label="Firm Name"
                    value={form.firm_name}
                    onChange={(v) => update("firm_name", v)}
                    placeholder="e.g. Sai Kripa Publicity"
                  />
                  <SoftInput
                    label="GST Number"
                    value={form.gst_number}
                    onChange={(v) => update("gst_number", v)}
                    placeholder="e.g. 09AABCU9603R1ZM"
                  />
                </div>
              </SoftCard>

              <SoftCard title="Bank Details">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SoftInput
                    label="Bank Account Number"
                    value={form.bank_account}
                    onChange={(v) => update("bank_account", v)}
                    placeholder="Account number"
                  />
                  <SoftInput
                    label="IFSC Code"
                    value={form.ifsc}
                    onChange={(v) => update("ifsc", v)}
                    placeholder="e.g. SBIN0001234"
                  />
                  <SoftInput
                    label="Branch"
                    value={form.branch}
                    onChange={(v) => update("branch", v)}
                    placeholder="Branch name"
                  />
                  <SoftInput
                    label="UPI ID"
                    value={form.upi_id}
                    onChange={(v) => update("upi_id", v)}
                    placeholder="e.g. firm@upi"
                  />
                </div>
              </SoftCard>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-black/90 active:scale-[0.99] disabled:opacity-50"
              >
                {saving ? "Saving\u2026" : "Save Settings"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
