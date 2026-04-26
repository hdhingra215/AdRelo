"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { SoftInput } from "@/components/ui/soft-input";
import { saveSettings } from "./actions";
import { getPlan, type PlanDef } from "@/lib/plans";
import { getUserUsage, type UsageInfo } from "@/lib/usage";

export default function SettingsPage() {
  const [form, setForm] = useState({
    firm_name: "",
    gst_number: "",
    bank_account: "",
    ifsc: "",
    branch: "",
    upi_id: "",
    payment_instructions: "",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [plan, setPlan] = useState<PlanDef>(getPlan("trial"));
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  const loadSettings = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const [settingsResult, usageData] = await Promise.all([
      supabase
        .from("agency_settings")
        .select("firm_name, gst_number, bank_account, ifsc, branch, upi_id, payment_instructions, qr_code_url, plan")
        .eq("user_id", user.id)
        .single(),
      getUserUsage(supabase, user.id),
    ]);

    if (settingsResult.data) {
      setForm({
        firm_name: settingsResult.data.firm_name ?? "",
        gst_number: settingsResult.data.gst_number ?? "",
        bank_account: settingsResult.data.bank_account ?? "",
        ifsc: settingsResult.data.ifsc ?? "",
        branch: settingsResult.data.branch ?? "",
        upi_id: settingsResult.data.upi_id ?? "",
        payment_instructions: settingsResult.data.payment_instructions ?? "",
      });
      setQrCodeUrl(settingsResult.data.qr_code_url ?? null);
      setPlan(getPlan(settingsResult.data.plan));
    }

    setUsage(usageData);
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

            {/* Your Plan */}
            <div className="mb-6">
              <SoftCard title="Your Plan">
                {plan.id === "trial" && (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      You are currently on the <span className="font-semibold">Trial</span> plan
                    </p>
                    {usage && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-medium text-foreground/70">
                              {usage.roThisMonth} / {usage.roLimit} Release Orders used this month
                            </p>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-black/[0.04] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                usage.roLimit && usage.roThisMonth >= usage.roLimit
                                  ? "bg-red-400"
                                  : usage.roLimit && usage.roThisMonth >= usage.roLimit * 0.8
                                    ? "bg-amber-400"
                                    : "bg-violet-400"
                              }`}
                              style={{
                                width: `${usage.roLimit ? Math.min((usage.roThisMonth / usage.roLimit) * 100, 100) : 0}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1.5 text-[11px] text-muted/60">
                            Resets on 1st of next month
                          </p>
                        </div>
                      </>
                    )}
                    <div>
                      <SoftButton href="/upgrade" size="sm">
                        Upgrade to Pro
                      </SoftButton>
                    </div>
                  </div>
                )}
                {plan.id === "pro" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">
                        You are on the <span className="font-semibold">Pro</span> plan
                      </p>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                        Pro
                      </span>
                    </div>
                    <p className="text-xs text-muted">Unlimited Release Orders</p>
                    <p className="text-xs text-muted/60">Manage subscription (coming soon)</p>
                  </div>
                )}
                {plan.id === "business" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">
                        You are on the <span className="font-semibold">Business</span> plan
                      </p>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Business
                      </span>
                    </div>
                    <p className="text-xs text-muted">Unlimited Release Orders</p>
                  </div>
                )}
              </SoftCard>
            </div>

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

              <SoftCard title="Payment Instructions">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Payment Instructions
                  </label>
                  <textarea
                    value={form.payment_instructions}
                    onChange={(e) => update("payment_instructions", e.target.value)}
                    rows={3}
                    placeholder="e.g. Payment due within 30 days. Cheques payable to..."
                    className="w-full rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all duration-200 resize-none"
                  />
                </div>
              </SoftCard>

              <SoftCard title="QR Code">
                <div className="space-y-3">
                  <p className="text-xs text-muted">
                    Upload a payment QR code to display on bills and invoices
                  </p>
                  {qrCodeUrl && (
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        className="h-24 w-24 rounded-lg border border-black/[0.06] object-contain"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const supabase = createClient();
                          await supabase
                            .from("agency_settings")
                            .update({ qr_code_url: null, updated_at: new Date().toISOString() })
                            .eq("user_id", (await supabase.auth.getUser()).data.user!.id);
                          setQrCodeUrl(null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      {qrCodeUrl ? "Replace QR Code" : "Upload QR Code"}
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploadingQr}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          setError("QR code image must be under 2MB.");
                          return;
                        }
                        setUploadingQr(true);
                        setError("");
                        try {
                          const supabase = createClient();
                          const { data: { user: u } } = await supabase.auth.getUser();
                          if (!u) return;

                          const ext = file.name.split(".").pop() || "png";
                          const path = `${u.id}/qr-code.${ext}`;

                          const { error: uploadError } = await supabase.storage
                            .from("agency-assets")
                            .upload(path, file, { upsert: true });

                          if (uploadError) {
                            setError("Upload failed: " + uploadError.message);
                            return;
                          }

                          const { data: urlData } = supabase.storage
                            .from("agency-assets")
                            .getPublicUrl(path);

                          const publicUrl = urlData.publicUrl + "?t=" + Date.now();

                          await supabase
                            .from("agency_settings")
                            .update({ qr_code_url: publicUrl, updated_at: new Date().toISOString() })
                            .eq("user_id", u.id);

                          setQrCodeUrl(publicUrl);
                        } catch {
                          setError("Failed to upload QR code.");
                        } finally {
                          setUploadingQr(false);
                          e.target.value = "";
                        }
                      }}
                      className="w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-black/[0.04] file:px-3 file:py-2 file:text-xs file:font-medium file:text-foreground hover:file:bg-black/[0.08] file:transition-colors file:cursor-pointer disabled:opacity-50"
                    />
                    {uploadingQr && (
                      <p className="mt-1.5 text-xs text-muted">Uploading…</p>
                    )}
                  </div>
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
