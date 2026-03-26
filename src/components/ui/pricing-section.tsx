"use client";

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
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for getting started with AdRelo.",
    features: [
      "10 release orders / month",
      "Basic PDF generation",
      "Client management",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlighted: false,
  },
  {
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
    cta: "Start Pro Trial",
    href: "/signup",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: "2,499",
    period: "/ month",
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

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 pt-32 pb-32">
      {/* Header */}
      <div
        className={`text-center mb-16 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-3 items-start max-w-4xl mx-auto">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
