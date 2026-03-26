import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { UserMenu } from "@/components/ui/user-menu";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Current month boundaries (YYYY-MM-DD)
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const nextMonth = now.getMonth() === 11
    ? `${now.getFullYear() + 1}-01-01`
    : `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, "0")}-01`;

  // Fetch all stats in parallel
  const [roCount, billCount, revenueResult] = await Promise.all([
    supabase.from("release_orders").select("*", { count: "exact", head: true }),
    supabase.from("bills").select("*", { count: "exact", head: true }),
    supabase
      .from("bills")
      .select("total_amount")
      .gte("date", monthStart)
      .lt("date", nextMonth),
  ]);

  const totalROs = roCount.count ?? 0;
  const totalBills = billCount.count ?? 0;
  const monthlyRevenue = (revenueResult.data ?? []).reduce(
    (sum, row) => sum + Number(row.total_amount ?? 0),
    0
  );

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

      {/* Stat cards */}
      <section className="mx-auto max-w-5xl px-6 pt-10 pb-32">
        <div className="grid gap-5 sm:grid-cols-3 stagger">
          <Link href="/release-orders">
            <SoftCard className="transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Release Orders
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                {totalROs}
              </p>
            </SoftCard>
          </Link>

          <Link href="/bills">
            <SoftCard className="transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Bills Generated
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                {totalBills}
              </p>
            </SoftCard>
          </Link>

          <SoftCard className="transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              This Month Revenue
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              {formatCurrency(monthlyRevenue)}
            </p>
          </SoftCard>
        </div>
      </section>
    </div>
  );
}
