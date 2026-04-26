"use client";
// © 2026 Himanshu Dhingra. All rights reserved.

import { useEffect, useRef, useState } from "react";
import { SoftButton } from "@/components/ui/soft-button";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

const plans = [
  {
    name: "Pro",
    price: "999",
    period: "/ month",
    yearlyPrice: "799",
    description: "For agencies that mean business.",
    features: [
      "Unlimited release orders",
      "Invoices + branded PDFs",
      "Priority performance",
      "Advanced client insights",
      "GST reports & exports",
    ],
    cta: "Start Pro Trial",
    href: "/upgrade",
    highlighted: true,
    badge: "Most Popular",
    socialProof: "Most agencies choose this",
  },
  {
    name: "Business",
    price: "2,999",
    period: "/ month",
    yearlyPrice: "2,499",
    description: "Scale your agency with your team.",
    features: [
      "Everything in Pro",
      "Multi-user access",
      "Team roles & permissions",
      "Analytics dashboard",
      "Dedicated support",
    ],
    cta: "Coming Soon",
    href: "#",
    highlighted: false,
    comingSoon: true,
  },
];

export function PricingSection() {
  const { ref, visible } = useInView(0.1);
  const [yearly, setYearly] = useState(false);

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 pt-32 pb-32">
      {/* Header */}
      <div
        className={`text-center mb-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur border border-black/[0.06] px-3.5 py-1 text-xs font-medium text-muted mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Pricing
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-muted leading-relaxed">
          Start free. Upgrade when you&apos;re ready. No surprises.
        </p>
      </div>

      {/* Free trial message */}
      <div
        className={`text-center mb-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        style={{ transitionDelay: "120ms", willChange: "transform, opacity" }}
      >
        <p className="inline-flex items-center gap-2 rounded-xl bg-emerald-50/80 backdrop-blur border border-emerald-200/40 px-5 py-2.5 text-sm text-emerald-800 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Start free — create up to 10 Release Orders per month. No card required.
        </p>
        <p className="mt-2 text-xs text-muted">No credit card required</p>
      </div>

      {/* Billing toggle */}
      <div
        className={`flex items-center justify-center gap-3 mb-12 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        style={{ transitionDelay: "160ms", willChange: "transform, opacity" }}
      >
        <span className={`text-sm font-medium ${!yearly ? "text-foreground" : "text-muted"}`}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly(!yearly)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
            yearly ? "bg-emerald-500" : "bg-black/10"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
              yearly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted"}`}>
          Yearly
          <span className="ml-1.5 text-[11px] text-emerald-600 font-semibold">Save 20%</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 items-start max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{
              transitionDelay: `${200 + i * 120}ms`,
              willChange: "transform, opacity",
            }}
          >
            <div
              className={`relative rounded-2xl p-6 sm:p-7 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white/90 backdrop-blur-xl shadow-card-lg border border-violet-200/40 sm:-mt-4 sm:pb-10 hover:shadow-[0_12px_40px_-8px_rgba(124,58,237,0.12)]"
                  : "bg-white/65 backdrop-blur-xl shadow-card border border-white/50 hover:bg-white/80 hover:shadow-card-lg hover:-translate-y-0.5"
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
                <span className={`font-bold text-foreground ${plan.highlighted ? "text-4xl" : "text-3xl"}`}>
                  {yearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                </span>
                <span className="text-sm text-muted">{plan.period}</span>
                {yearly && plan.yearlyPrice && (
                  <span className="text-xs text-emerald-600 font-medium ml-1">Billed annually</span>
                )}
              </div>

              <p className="mt-2.5 text-[13px] text-muted leading-relaxed">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="mt-5 mb-5 h-px bg-black/[0.04]" />

              {/* Features */}
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-foreground/70">
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
                    {plan.cta}
                  </button>
                ) : (
                  <SoftButton
                    href={plan.href}
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="lg"
                    fullWidth
                  >
                    {plan.cta}
                  </SoftButton>
                )}
                {plan.socialProof && (
                  <p className="mt-2.5 text-center text-[11px] text-muted">
                    {plan.socialProof}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
