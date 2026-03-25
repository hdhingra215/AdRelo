import { SoftButton } from "@/components/ui/soft-button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-30 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 bg-white/40 backdrop-blur-md rounded-b-2xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
            A
          </div>
          <span className="text-sm font-semibold text-foreground">AdRelo</span>
        </div>
        <div className="flex items-center gap-3">
          <SoftButton href="/login" variant="ghost" size="sm">
            Log in
          </SoftButton>
          <SoftButton href="/signup" size="sm">
            Get Started
          </SoftButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="fade-in-up mx-auto max-w-[700px] px-6 pt-24 pb-12 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur border border-black/[0.06] px-3.5 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          The Agency Engine
        </div>
        <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-7xl">
          Run your agency
          <br />
          like a machine
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted">
          Create release orders, manage clients, generate professional PDFs, and
          keep your entire advertising workflow organized — in one clean tool.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <SoftButton href="/signup" size="lg">
            Get Started Free
          </SoftButton>
          <SoftButton href="/login" variant="secondary" size="lg">
            Log In
          </SoftButton>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        <div className="grid gap-7 sm:grid-cols-3 stagger">
          <div className="sm:mt-0">
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              }
              title="Release Orders"
              description="Create, track, and manage release orders with all publication details, pricing, and client info in one place."
            />
          </div>
          <div className="sm:mt-4">
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              }
              title="Client Management"
              description="Auto-create clients on first use. Keep your client list clean and always linked to the right orders."
            />
          </div>
          <div className="sm:mt-2">
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              }
              title="PDF Generation"
              description="Download professionally formatted release order PDFs with one click. Ready to send to publications."
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-3xl px-6 pt-8 pb-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-muted">
          One plan, everything included. No hidden fees.
        </p>

        <div className="mx-auto mt-12 max-w-sm rounded-2xl bg-white/80 backdrop-blur-xl shadow-card-lg p-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Starter
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">Free</span>
            <span className="text-sm text-muted">during beta</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-foreground/70">
            <PricingItem>Unlimited release orders</PricingItem>
            <PricingItem>Client management</PricingItem>
            <PricingItem>PDF downloads</PricingItem>
            <PricingItem>Secure authentication</PricingItem>
          </ul>
          <div className="mt-8">
            <SoftButton href="/signup" fullWidth size="lg">
              Get Started
            </SoftButton>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.04] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white text-[10px] font-bold">
              A
            </div>
            <span className="text-sm font-semibold text-foreground">
              AdRelo
            </span>
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} AdRelo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-card p-6 transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04]">
        <svg
          className="h-5 w-5 text-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          {icon}
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function PricingItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <svg
        className="h-4 w-4 text-black/40"
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
      {children}
    </li>
  );
}
