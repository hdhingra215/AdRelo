import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Release Orders</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              &larr; Dashboard
            </Link>
            <Link
              href="/release-orders/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              New Release Order
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load release orders: {error.message}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white px-6 py-12 text-center">
            <p className="text-gray-500">No release orders yet.</p>
            <Link
              href="/release-orders/new"
              className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create your first Release Order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    RO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Publication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const clientName =
                    order.clients &&
                    typeof order.clients === "object" &&
                    !Array.isArray(order.clients)
                      ? (order.clients as { name: string }).name
                      : "—";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/release-orders/${order.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {order.ro_number}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {clientName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {order.publication}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {Number(order.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
