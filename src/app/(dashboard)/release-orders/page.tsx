import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SoftButton } from "@/components/ui/soft-button";

export default async function ReleaseOrdersPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("release_orders")
    .select("id, ro_number, date, publication, total_amount, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
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
          <span className="text-sm text-muted">Release Orders</span>
        </div>
        <SoftButton href="/release-orders/new" size="sm">
          + New Order
        </SoftButton>
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-6xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          All orders
        </h1>
        <p className="mt-2 text-base text-muted">
          Browse and manage your release orders
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        {error ? (
          <div className="fade-in rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft">
            Failed to load release orders: {error.message}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="fade-in-up rounded-2xl bg-white/80 backdrop-blur-xl shadow-card px-8 py-24 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04]">
              <svg className="h-6 w-6 text-foreground/25" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground/40">
              No release orders yet
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
              Create your first order to get started
            </p>
            <div className="mt-8">
              <SoftButton href="/release-orders/new" size="lg">
                Create your first order
              </SoftButton>
            </div>
          </div>
        ) : (
          <div className="fade-in-up overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-card">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-black/[0.04]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    RO Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Publication
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const clientName =
                    order.clients &&
                    typeof order.clients === "object" &&
                    !Array.isArray(order.clients)
                      ? (order.clients as { name: string }).name
                      : "\u2014";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-black/[0.03] transition-colors duration-150 hover:bg-black/[0.015]"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/release-orders/${order.id}`}
                          className="font-medium text-foreground hover:text-accent transition-colors"
                        >
                          {order.ro_number}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                        {clientName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                        {order.publication}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right tabular-nums text-sm font-semibold text-foreground">
                        {Number(order.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
