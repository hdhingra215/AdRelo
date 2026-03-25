import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SoftButton } from "@/components/ui/soft-button";
import { UserMenu } from "@/components/ui/user-menu";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
        <UserMenu email={user.email ?? ""} />
      </nav>

      {/* Hero — centered, lots of whitespace */}
      <section className="fade-in-up mx-auto max-w-[900px] px-6 pt-20 pb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur border border-black/[0.06] px-3.5 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          The Agency Engine
        </div>
        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-7xl">
          Manage your agency
          <br />
          with clarity
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
          Create release orders, track publications, and streamline your entire
          agency workflow — beautifully simple.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <SoftButton href="/release-orders/new" size="lg">
            Create Release Order
          </SoftButton>
          <SoftButton href="/release-orders" variant="secondary" size="lg">
            View All Orders
          </SoftButton>
        </div>
      </section>

      {/* Floating preview cards */}
      <section className="mx-auto max-w-5xl px-6 pt-10 pb-32">
        <div className="grid gap-5 sm:grid-cols-3 stagger">
          {/* Card 1 — summary */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-card p-6 transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04]">
              <svg className="h-5 w-5 text-foreground/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <Link href="/release-orders" className="block">
              <h3 className="text-sm font-semibold text-foreground">Release Orders</h3>
              <p className="mt-1 text-sm text-muted">View and manage all orders</p>
            </Link>
          </div>

          {/* Card 2 — create */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-card p-6 transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04]">
              <svg className="h-5 w-5 text-foreground/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <Link href="/release-orders/new" className="block">
              <h3 className="text-sm font-semibold text-foreground">Create New</h3>
              <p className="mt-1 text-sm text-muted">Draft a new release order</p>
            </Link>
          </div>

          {/* Card 3 — coming soon */}
          <div className="rounded-2xl bg-white/50 backdrop-blur shadow-soft border border-dashed border-black/[0.06] p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.03]">
              <svg className="h-5 w-5 text-foreground/20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground/25">Analytics</h3>
            <p className="mt-1 text-sm text-muted/50">Coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
