import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SoftButton } from "@/components/ui/soft-button";

export default async function BillsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bills, error } = await supabase
    .from("bills")
    .select(
      "id, bill_number, date, total_amount, clients(name), release_orders(ro_number)"
    )
    .order("date", { ascending: false });

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
          <span className="text-sm text-muted">Bills</span>
        </div>
        <SoftButton href="/bills/new" size="sm">
          + New Bill
        </SoftButton>
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-6xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          All bills
        </h1>
        <p className="mt-2 text-base text-muted">
          Browse and manage your invoices
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        {error ? (
          <div className="fade-in rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft">
            Failed to load bills: {error.message}
          </div>
        ) : !bills || bills.length === 0 ? (
          <div className="fade-in-up rounded-2xl bg-white/80 backdrop-blur-xl shadow-card px-8 py-24 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04]">
              <svg className="h-6 w-6 text-foreground/25" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground/40">
              No bills yet
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
              Generate your first bill from a release order
            </p>
            <div className="mt-8">
              <SoftButton href="/bills/new" size="lg">
                Create your first bill
              </SoftButton>
            </div>
          </div>
        ) : (
          <div className="fade-in-up overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-card">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-black/[0.04]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Bill Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    RO Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => {
                  const clientName =
                    bill.clients &&
                    typeof bill.clients === "object" &&
                    !Array.isArray(bill.clients)
                      ? (bill.clients as { name: string }).name
                      : "\u2014";

                  const roNumber =
                    bill.release_orders &&
                    typeof bill.release_orders === "object" &&
                    !Array.isArray(bill.release_orders)
                      ? (bill.release_orders as { ro_number: string }).ro_number
                      : "\u2014";

                  return (
                    <tr
                      key={bill.id}
                      className="border-b border-black/[0.03] transition-colors duration-150 hover:bg-black/[0.015]"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/bills/${bill.id}`}
                          className="font-medium text-foreground hover:text-accent transition-colors"
                        >
                          {bill.bill_number}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                        {roNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                        {clientName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                        {bill.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right tabular-nums text-sm font-semibold text-foreground">
                        {Number(bill.total_amount).toFixed(2)}
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
