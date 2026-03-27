// © 2026 Himanshu Dhingra. All rights reserved.
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SoftButton } from "@/components/ui/soft-button";
import { SoftCard } from "@/components/ui/soft-card";
import { UserMenu } from "@/components/ui/user-menu";
import { getUserUsage } from "@/lib/usage";

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

  // Current month boundaries
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const nextMonth =
    now.getMonth() === 11
      ? `${now.getFullYear() + 1}-01-01`
      : `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, "0")}-01`;

  // Fetch usage + stats + recent ROs in parallel
  const [usage, monthlyROCount, pendingBillsCount, revenueResult, recentROsResult] =
    await Promise.all([
      getUserUsage(supabase, user.id),
      supabase
        .from("release_orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monthStart)
        .lt("created_at", nextMonth),
      supabase
        .from("release_orders")
        .select("*", { count: "exact", head: true })
        .eq("bill_generated", false),
      supabase
        .from("bills")
        .select("total_amount")
        .gte("date", monthStart)
        .lt("date", nextMonth),
      supabase
        .from("release_orders")
        .select("id, ro_number, total_amount, bill_generated, created_at, clients(name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const thisMonthROs = monthlyROCount.count ?? 0;
  const pendingBills = pendingBillsCount.count ?? 0;
  const monthlyRevenue = (revenueResult.data ?? []).reduce(
    (sum, row) => sum + Number(row.total_amount ?? 0),
    0
  );
  const recentROs = recentROsResult.data ?? [];

  const remaining = usage.roLimit !== null ? Math.max(usage.roLimit - usage.roThisMonth, 0) : null;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
            A
          </div>
          <span className="text-sm font-semibold text-foreground">AdRelo</span>
          {usage.plan.id === "pro" ? (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              Pro
            </span>
          ) : usage.plan.id === "business" ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Business
            </span>
          ) : (
            <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-semibold text-muted">
              Trial
            </span>
          )}
        </div>
        <UserMenu email={user.email ?? ""} />
      </nav>

      {/* ── Primary Actions ── */}
      <section className="fade-in-up mx-auto max-w-5xl px-6 pt-16 pb-6" style={{ animationDelay: "0ms" }}>
        {/* Today focus line */}
        {pendingBills > 0 ? (
          <p className="text-[13px] text-muted mb-4">
            <span className="font-semibold text-foreground">{pendingBills} {pendingBills === 1 ? "bill needs" : "bills need"}</span> your attention
          </p>
        ) : usage.roLimit !== null && usage.roThisMonth >= usage.roLimit * 0.8 ? (
          <p className="text-[13px] text-muted mb-4">
            You&apos;re close to your <span className="font-semibold text-foreground">monthly limit</span>
          </p>
        ) : recentROs.length === 0 ? (
          <p className="text-[13px] text-muted mb-4">
            Get started by creating your first release order
          </p>
        ) : (
          <p className="text-[13px] text-muted mb-4">
            All caught up. Let&apos;s keep it moving.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted/60">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All data auto-saved
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <SoftButton href="/release-orders" variant="ghost" size="sm">
              View Orders
            </SoftButton>
            <SoftButton href="/clients" variant="secondary" size="sm">
              Add Client
            </SoftButton>
            <Link
              href="/release-orders/new"
              className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out bg-black text-white hover:bg-[#2a2a2a] hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.25)] active:scale-[0.97] active:shadow-[0_1px_4px_-1px_rgba(0,0,0,0.15)] px-7 py-3.5 text-[15px] rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Release Order
            </Link>
          </div>
        </div>
      </section>

      {/* ── Usage bar (trial users) ── */}
      {usage.roLimit !== null && (
        <section className="fade-in-up mx-auto max-w-5xl px-6 pb-4" style={{ animationDelay: "80ms" }}>
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-black/[0.04] px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-foreground/70">
                  {usage.roThisMonth} / {usage.roLimit} Release Orders used this month
                  <span className="text-muted ml-1.5">
                    &middot; {remaining} remaining
                  </span>
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black/[0.04] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usage.roThisMonth >= usage.roLimit
                      ? "bg-red-400"
                      : usage.roThisMonth >= usage.roLimit * 0.8
                        ? "bg-amber-400"
                        : "bg-violet-400"
                  }`}
                  style={{
                    width: `${Math.min((usage.roThisMonth / usage.roLimit) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted/60">
                Resets on 1st of next month
              </p>
            </div>
            <SoftButton
              href="/upgrade"
              size="sm"
              variant={usage.roThisMonth >= usage.roLimit * 0.8 ? "primary" : "secondary"}
            >
              Upgrade to Pro
            </SoftButton>
          </div>
        </section>
      )}

      {/* ── Stats ── */}
      <section className="fade-in-up mx-auto max-w-5xl px-6 pt-4" style={{ animationDelay: "160ms" }}>
        <div className="grid gap-5 sm:grid-cols-3 stagger">
          <Link href="/release-orders">
            <SoftCard className="transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                This Month ROs
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                {thisMonthROs}
              </p>
            </SoftCard>
          </Link>

          <Link href="/bills/new">
            <SoftCard className="transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Pending Bills
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-4xl font-bold tracking-tight text-foreground">
                  {pendingBills}
                </p>
              </div>
              {pendingBills > 0 && (
                <p className="mt-1.5 text-xs font-medium text-amber-600">
                  {pendingBills} pending {pendingBills === 1 ? "bill" : "bills"} &rarr; Generate now
                </p>
              )}
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

      {/* ── Quick Shortcuts ── */}
      <section className="fade-in-up mx-auto max-w-5xl px-6 pt-8" style={{ animationDelay: "240ms" }}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/release-orders/new"
            className="group flex items-center gap-3 rounded-xl bg-white/60 backdrop-blur border border-black/[0.04] px-4 py-3.5 transition-all duration-200 hover:bg-white/80 hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04] transition-colors group-hover:bg-black/[0.06]">
              <svg className="h-4.5 w-4.5 text-foreground/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">New Release Order</p>
              <p className="text-[11px] text-muted">Create an RO</p>
            </div>
          </Link>

          <Link
            href="/clients"
            className="group flex items-center gap-3 rounded-xl bg-white/60 backdrop-blur border border-black/[0.04] px-4 py-3.5 transition-all duration-200 hover:bg-white/80 hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04] transition-colors group-hover:bg-black/[0.06]">
              <svg className="h-4.5 w-4.5 text-foreground/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Manage Clients</p>
              <p className="text-[11px] text-muted">View & add clients</p>
            </div>
          </Link>

          <Link
            href="/bills/new"
            className="group flex items-center gap-3 rounded-xl bg-white/60 backdrop-blur border border-black/[0.04] px-4 py-3.5 transition-all duration-200 hover:bg-white/80 hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04] transition-colors group-hover:bg-black/[0.06]">
              <svg className="h-4.5 w-4.5 text-foreground/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Generate Invoice</p>
              <p className="text-[11px] text-muted">Create a bill</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Recent Release Orders ── */}
      <section className="fade-in-up mx-auto max-w-5xl px-6 pt-8 pb-32" style={{ animationDelay: "320ms" }}>
        <SoftCard title="Recent Release Orders">
          {recentROs.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.03]">
                <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">No release orders yet</p>
              <p className="mt-1 text-[13px] text-muted">Start by creating your first one.</p>
              <div className="mt-4">
                <SoftButton href="/release-orders/new" size="sm">
                  Create Release Order
                </SoftButton>
              </div>
            </div>
          ) : (
            <div className="-mx-6 -mb-6 overflow-hidden rounded-b-2xl">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-black/[0.04]">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                      RO Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                      Client
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentROs.map((ro) => {
                    const clientName =
                      ro.clients &&
                      typeof ro.clients === "object" &&
                      !Array.isArray(ro.clients)
                        ? (ro.clients as { name: string }).name
                        : "\u2014";

                    const billed = ro.bill_generated;

                    return (
                      <tr
                        key={ro.id}
                        className="group border-b border-black/[0.04] last:border-0 transition-colors duration-150 hover:bg-black/[0.02] cursor-pointer"
                      >
                        {/* Invisible row link for full-row click */}
                        <td className="whitespace-nowrap px-6 py-[18px]">
                          <Link
                            href={`/release-orders/${ro.id}`}
                            className="text-sm font-medium text-accent hover:underline"
                          >
                            {ro.ro_number}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-[18px] text-sm text-muted">
                          <Link href={`/release-orders/${ro.id}`} className="hover:text-foreground transition-colors">
                            {clientName}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-[18px] text-right tabular-nums text-sm font-semibold text-foreground">
                          {formatCurrency(Number(ro.total_amount ?? 0))}
                        </td>
                        <td className="whitespace-nowrap px-6 py-[18px] text-center">
                          {billed ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                              Billed
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-[18px] text-right text-sm text-muted">
                          {new Date(ro.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-[18px] text-right">
                          <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/release-orders/${ro.id}/pdf`}
                              target="_blank"
                              className="text-xs font-medium text-muted hover:text-foreground transition-colors"
                              title="Download PDF"
                            >
                              PDF
                            </Link>
                            {!billed && (
                              <Link
                                href={`/bills/new?ro=${ro.id}`}
                                className="text-xs font-medium text-accent hover:underline"
                              >
                                Generate Bill
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SoftCard>
      </section>
    </div>
  );
}
