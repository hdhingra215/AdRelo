"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SoftButton } from "@/components/ui/soft-button";
import { upgradePlan } from "./actions";

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    const result = await upgradePlan("pro");

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
            A
          </div>
          <span className="text-sm font-semibold text-foreground">AdRelo</span>
        </div>
        <SoftButton href="/dashboard" variant="ghost" size="sm">
          Back to Dashboard
        </SoftButton>
      </nav>

      <section className="mx-auto max-w-md px-6 pt-24 pb-32 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Upgrade to Pro
        </h1>
        <p className="mt-3 text-base text-muted leading-relaxed">
          Unlock unlimited release orders, branded invoices, and priority
          performance for your agency.
        </p>

        <div className="mt-10 rounded-2xl bg-white/80 backdrop-blur-xl shadow-card p-8 text-left">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-muted">&#8377;</span>
            <span className="text-4xl font-bold text-foreground">999</span>
            <span className="text-sm text-muted">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-foreground/70">
            {[
              "Unlimited release orders",
              "Invoices + branded PDFs",
              "Priority performance",
              "Advanced client insights",
              "GST reports & exports",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 text-emerald-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          {success ? (
            <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200/60 p-4 text-center">
              <p className="text-sm font-medium text-emerald-700">
                Upgraded to Pro! Redirecting...
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <SoftButton
                onClick={handleUpgrade}
                disabled={loading}
                fullWidth
                size="lg"
              >
                {loading ? "Upgrading..." : "Upgrade to Pro"}
              </SoftButton>
              <p className="mt-3 text-xs text-muted text-center">
                No payment required during beta. Stripe integration coming soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
