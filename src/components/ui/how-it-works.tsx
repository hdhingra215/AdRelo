"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Scroll-triggered fade-in (fires once) ── */
function useInView(threshold = 0.12) {
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
      { threshold, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Subtle parallax (transform-only, GPU composited) ── */
function useParallax(speed = 0.02) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    setOffset((center - viewCenter) * speed);
  }, [speed]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return { ref, offset };
}

/* ── Mini UI atoms ── */
function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "green" | "amber" | "blue";
}) {
  const colors = {
    default: "bg-black/[0.04] text-foreground/55",
    green: "bg-emerald-50/80 text-emerald-600 border border-emerald-200/40",
    amber: "bg-amber-50/80 text-amber-600 border border-amber-200/40",
    blue: "bg-blue-50/80 text-blue-600 border border-blue-200/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-transform duration-200 hover:scale-[1.04] ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${color}`}
    >
      {name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)}
    </div>
  );
}

function MiniDot({ color }: { color: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

/* ── Step 1: RO Preview Cards ── */
function Step1Cards() {
  return (
    <div className="relative flex flex-col gap-3">
      <div className="relative z-20 rounded-2xl bg-white/70 backdrop-blur-xl shadow-card p-4 border border-white/50 transition-all duration-300 hover:shadow-card-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar name="Sunrise Media" color="bg-violet-500" />
            <div>
              <p className="text-[12px] font-semibold text-foreground/90">
                Sunrise Media Pvt Ltd
              </p>
              <p className="text-[10px] text-muted">RO-2024-0847</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-bold text-foreground">&#8377;42,500</p>
            <p className="text-[10px] text-muted">+ GST</p>
          </div>
        </div>
        <div className="h-px w-full bg-black/[0.04] mb-2" />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">Dainik Bhaskar &middot; Half Page</p>
          <p className="text-[11px] text-muted">Mar 15, 2024</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-2">
        <Tag variant="green">
          <MiniDot color="bg-emerald-400" /> GST Applied
        </Tag>
        <Tag variant="blue">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          PDF Ready
        </Tag>
      </div>

      <div className="relative z-20 rounded-xl bg-white/55 backdrop-blur-lg shadow-soft p-3 border border-white/35 ml-4 transition-all duration-300 hover:shadow-card hover:bg-white/65">
        <div className="flex items-center gap-2">
          <Avatar name="Metro Ads" color="bg-sky-500" />
          <div className="flex-1">
            <p className="text-[11px] font-medium text-foreground/80">Metro Advertising</p>
            <p className="text-[10px] text-muted">Times of India &middot; &#8377;28,000</p>
          </div>
          <Tag variant="amber">Draft</Tag>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Client & Invoice Cards ── */
function Step2Cards() {
  return (
    <div className="relative flex flex-col gap-3">
      <div className="relative z-20 rounded-2xl bg-white/70 backdrop-blur-xl shadow-card p-4 border border-white/50 transition-all duration-300 hover:shadow-card-lg hover:-translate-y-0.5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name="Priya Sharma" color="bg-rose-500" />
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-foreground/90">Priya Sharma</p>
            <p className="text-[10px] text-muted">sharma.priya@sunrisemedia.in</p>
          </div>
          <Tag variant="green">
            <MiniDot color="bg-emerald-400" /> Active
          </Tag>
        </div>
        <div className="flex gap-4 text-[10px] text-muted border-t border-black/[0.04] pt-2.5">
          <span>12 Orders</span>
          <span>&#8377;3.2L Total</span>
          <span>Last: 2 days ago</span>
        </div>
      </div>

      <div className="relative z-20 rounded-xl bg-white/60 backdrop-blur-lg shadow-soft p-3 border border-white/35 ml-4 transition-all duration-300 hover:shadow-card hover:bg-white/70">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-medium text-foreground/80">Invoice #INV-0392</p>
          <Tag variant="green">
            <MiniDot color="bg-emerald-400" /> Paid
          </Tag>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted">
          <span>Sunrise Media</span>
          <span className="font-medium text-foreground/70">&#8377;48,970</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-2">
        <Tag variant="amber">
          <MiniDot color="bg-amber-400" /> 3 Pending
        </Tag>
        <Tag variant="green">
          <MiniDot color="bg-emerald-400" /> 8 Paid
        </Tag>
        <Tag variant="default">
          <MiniDot color="bg-gray-400" /> 1 Overdue
        </Tag>
      </div>
    </div>
  );
}

/* ── Step 3: PDF & Invoice Preview ── */
function Step3Cards() {
  return (
    <div className="relative flex flex-col gap-3">
      <div className="relative z-20 rounded-2xl bg-white/70 backdrop-blur-xl shadow-card p-4 border border-white/50 transition-all duration-300 hover:shadow-card-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[12px] font-semibold text-foreground/90">Tax Invoice</p>
            <p className="text-[10px] text-muted">INV-2024-0392</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 border border-red-100">
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        </div>
        <div className="space-y-1.5 text-[11px] border-t border-black/[0.04] pt-3">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>&#8377;42,500.00</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>CGST (9%)</span>
            <span>&#8377;3,825.00</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>SGST (9%)</span>
            <span>&#8377;3,825.00</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground/90 border-t border-black/[0.06] pt-1.5 mt-1">
            <span>Total</span>
            <span>&#8377;50,150.00</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-2">
        <Tag variant="green">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Downloaded PDF
        </Tag>
        <Tag variant="blue">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Shared with client
        </Tag>
      </div>
    </div>
  );
}

/* ── Step data ── */
const stepGradients = [
  "from-violet-100/50 via-fuchsia-50/30 to-blue-50/20",
  "from-sky-100/50 via-teal-50/30 to-emerald-50/20",
  "from-amber-100/40 via-orange-50/30 to-rose-50/20",
];

const steps = [
  {
    title: "Create and manage Release Orders effortlessly",
    description:
      "Build professional release orders in seconds. Track every detail from client info to publication specs, pricing, and GST — all in one clean interface.",
    cards: Step1Cards,
  },
  {
    title: "Track clients, ads, and billing in one place",
    description:
      "Your entire client roster, order history, and payment status — organized and always up to date. No more spreadsheet chaos.",
    cards: Step2Cards,
  },
  {
    title: "Generate professional PDFs and close faster",
    description:
      "One-click invoices with full GST breakdown. Download, share, and get paid — without touching a calculator.",
    cards: Step3Cards,
  },
];

/* ────────────────────────────────────────────────────
   Connector: glowing ribbon that fades into cards.

   3-layer glow (outer / mid / core) with a stroke
   gradient whose first and last stops fade to
   transparent so the ribbon dissolves before
   reaching the card edge — no hard intersection.

   z-0 ensures it always renders below cards (z-10/20).
   ──────────────────────────────────────────────────── */
function Connector({
  direction,
  id,
}: {
  direction: "right-to-left" | "left-to-right";
  id: number;
}) {
  const { ref, offset } = useParallax(0.01);

  /* Path shortened: starts at y=15 and ends at y=145
     (was 0→160) so endpoints sit ~10px inside the
     overlap zone instead of touching card edges. */
  const path =
    direction === "right-to-left"
      ? "M538 15 C538 55, 400 65, 350 80 C300 95, 162 105, 162 145"
      : "M162 15 C162 55, 300 65, 350 80 C400 95, 538 105, 538 145";

  const startX = direction === "right-to-left" ? 538 : 162;
  const endX = direction === "right-to-left" ? 162 : 538;

  return (
    <div
      ref={ref}
      className="hidden lg:block relative z-0 pointer-events-none -my-12"
      aria-hidden="true"
      style={{
        transform: `translateY(${offset}px)`,
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 700 160"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-[120px]"
      >
        <defs>
          {/* Stroke gradient with fade-out at both ends.
              Flows along the curve via userSpaceOnUse. */}
          <linearGradient
            id={`conn-${id}`}
            gradientUnits="userSpaceOnUse"
            x1={String(startX)}
            y1="15"
            x2={String(endX)}
            y2="145"
          >
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="12%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="40%" stopColor="#7dd3fc" stopOpacity="1" />
            <stop offset="88%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>

          {/* Blur filters */}
          <filter id={`blur-outer-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={`blur-mid-${id}`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Layer 3: outer atmospheric glow */}
        <path
          d={path}
          stroke={`url(#conn-${id})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.06"
          filter={`url(#blur-outer-${id})`}
        />

        {/* Layer 2: mid glow body */}
        <path
          d={path}
          stroke={`url(#conn-${id})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.12"
          filter={`url(#blur-mid-${id})`}
        />

        {/* Layer 1: crisp core */}
        <path
          d={path}
          stroke={`url(#conn-${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.22"
        />
      </svg>
    </div>
  );
}

/* ── Main Component ── */
export function HowItWorks() {
  const headerInView = useInView(0.15);

  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-32 pb-20">
      {/* Section header */}
      <div
        ref={headerInView.ref}
        className={`text-center mb-24 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          headerInView.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[5px]"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur border border-black/[0.06] px-3.5 py-1 text-xs font-medium text-muted mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          How it works
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
          From order to invoice,
          <br />
          <span className="text-foreground/50">beautifully simple</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base text-muted leading-relaxed">
          Three steps to transform how your agency handles release orders,
          billing, and client management.
        </p>
      </div>

      {/* Steps + connectors */}
      <div className="relative">
        {steps.map((step, i) => {
          const Cards = step.cards;
          const isEven = i % 2 === 0;
          return (
            <div key={i}>
              <StepRow
                index={i}
                title={step.title}
                description={step.description}
                gradient={stepGradients[i]}
                isEven={isEven}
              >
                <Cards />
              </StepRow>
              {i < steps.length - 1 && (
                <Connector
                  direction={isEven ? "right-to-left" : "left-to-right"}
                  id={i}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Step Row ── */
function StepRow({
  index,
  title,
  description,
  gradient,
  isEven,
  children,
}: {
  index: number;
  title: string;
  description: string;
  gradient: string;
  isEven: boolean;
  children: React.ReactNode;
}) {
  const { ref, visible } = useInView(0.08);
  const parallax = useParallax(0.02);

  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
      }`}
      style={{
        transitionDelay: `${index * 60}ms`,
        willChange: "transform, opacity",
      }}
    >
      {/* Text side */}
      <div className={`${isEven ? "lg:order-1" : "lg:order-2"} space-y-4`}>
        <h3
          className={`text-xl font-semibold tracking-tight text-foreground sm:text-[1.55rem] leading-snug transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[3px]"
          }`}
          style={{ transitionDelay: `${index * 60 + 100}ms` }}
        >
          {title}
        </h3>
        <p
          className={`text-[14px] text-muted leading-relaxed max-w-md transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[3px]"
          }`}
          style={{ transitionDelay: `${index * 60 + 170}ms` }}
        >
          {description}
        </p>
      </div>

      {/* Cards side */}
      <div
        ref={parallax.ref}
        className={`relative z-10 ${isEven ? "lg:order-2" : "lg:order-1"}`}
        style={{
          transform: visible ? `translateY(${parallax.offset}px)` : "translateY(5px)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms cubic-bezier(0.22,1,0.36,1)",
          transitionDelay: `${index * 60 + 120}ms`,
          willChange: "transform, opacity",
        }}
      >
        <div
          className={`rounded-3xl bg-gradient-to-br ${gradient} p-6 sm:p-8 border border-white/20 transition-shadow duration-500 hover:shadow-card`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
