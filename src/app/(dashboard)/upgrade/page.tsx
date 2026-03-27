"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SoftButton } from "@/components/ui/soft-button";
import { upgradePlan } from "./actions";

function CheckIcon() {
  return (
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
  );
}

const plans = [
  {
    id: "pro" as const,
    name: "Pro",
    price: "999",
    period: "/ month",
    description: "For agencies that mean business.",
    features: [
      "Unlimited release orders",
      "Invoices + branded PDFs",
      "Priority performance",
      "Advanced client insights",
      "GST reports & exports",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "business" as const,
    name: "Business",
    price: "2,999",
    period: "/ month",
    description: "Scale your agency with your team.",
    features: [
      "Everything in Pro",
      "Multi-user access",
      "Team roles & permissions",
      "Analytics dashboard",
      "Dedicated support",
    ],
    highlighted: false,
    comingSoon: true,
  },
];

const benefits = [
  {
    title: "Unlimited Release Orders",
    desc: "No monthly caps. Create as many ROs as your agency needs.",
  },
  {
    title: "Unlimited Invoices",
    desc: "Generate branded invoices and PDFs without limits.",
  },
  {
    title: "Faster Workflow",
    desc: "Streamlined tools built for speed and efficiency.",
  },
  {
    title: "Priority Performance",
    desc: "Faster load times and priority access during peak usage.",
  },
];

export default function UpgradePage() {
  return (
    <Suspense>
      <UpgradeContent />
    </Suspense>
  );
}

function UpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLimit = searchParams.get("source") === "limit";

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
      {/* Nav */}
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

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
          {fromLimit
            ? "You\u2019ve reached your free trial limit"
            : "Unlock unlimited Release Orders"}
        </h1>
        <p className="mt-4 text-base text-muted leading-relaxed max-w-md mx-auto">
          {fromLimit
            ? "Upgrade to continue creating Release Orders without interruption."
            : "Remove all limits and supercharge your agency workflow."}
        </p>
      </section>

      {/* Plan cards */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-7 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white/90 backdrop-blur-xl shadow-card-lg border border-violet-200/40 hover:shadow-[0_12px_40px_-8px_rgba(124,58,237,0.12)]"
                  : "bg-white/65 backdrop-blur-xl shadow-card border border-white/50 hover:bg-white/80 hover:shadow-card-lg"
              } ${plan.comingSoon ? "opacity-75" : ""}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-foreground px-3 py-0.5 text-[10px] font-semibold text-white shadow-sm tracking-wide uppercase">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {plan.name}
              </p>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[11px] text-muted">&#8377;</span>
                <span
                  className={`font-bold text-foreground ${
                    plan.highlighted ? "text-4xl" : "text-3xl"
                  }`}
                >
                  {plan.price}
                </span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>

              <p className="mt-2.5 text-[13px] text-muted leading-relaxed">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="mt-5 mb-5 h-px bg-black/[0.04]" />

              {/* Features */}
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[13px] text-foreground/70"
                  >
                    <CheckIcon />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-7">
                {plan.comingSoon ? (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium bg-black/[0.04] text-muted cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : success ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-3.5 text-center">
                    <p className="text-sm font-medium text-emerald-700">
                      Upgraded to Pro! Redirecting...
                    </p>
                  </div>
                ) : (
                  <>
                    <SoftButton
                      onClick={handleUpgrade}
                      disabled={loading}
                      fullWidth
                      size="lg"
                    >
                      {loading ? "Upgrading..." : "Upgrade to Pro"}
                    </SoftButton>
                    {error && (
                      <p className="mt-3 text-sm text-red-600 text-center">
                        {error}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="mt-6 text-center text-xs text-muted">
          No credit card required during beta
        </p>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-lg font-semibold text-foreground text-center mb-8">
          Why upgrade to Pro?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl bg-white/60 backdrop-blur border border-black/[0.04] p-5"
            >
              <p className="text-sm font-medium text-foreground">{b.title}</p>
              <p className="mt-1 text-[13px] text-muted leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-md px-6 pb-32 text-center">
        <SoftButton href="/#pricing" variant="secondary" size="sm">
          View full pricing
        </SoftButton>
      </section>
    </div>
  );
}
