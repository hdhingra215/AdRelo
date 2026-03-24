import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ReleaseOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order, error } = await supabase
    .from("release_orders")
    .select("*, clients(name)")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const clientName =
    order.clients &&
    typeof order.clients === "object" &&
    !Array.isArray(order.clients)
      ? (order.clients as { name: string }).name
      : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">
            RO: {order.ro_number}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/release-orders"
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              &larr; All Release Orders
            </Link>
            <button
              disabled
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 opacity-60 cursor-not-allowed"
              title="Coming soon"
            >
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        {/* Order Details */}
        <Card title="Order Details">
          <Row label="RO Number" value={order.ro_number} />
          <Row label="Date" value={order.date} />
          <Row label="Publishing Date" value={order.publishing_date} />
        </Card>

        {/* Client */}
        <Card title="Client">
          <Row label="Client Name" value={clientName} />
        </Card>

        {/* Publication Details */}
        <Card title="Publication Details">
          <Row label="Publication" value={order.publication} />
          <Row label="Edition" value={order.edition} />
          <Row label="Advertisement Category" value={order.advertisement_category} />
          <Row label="Caption" value={order.caption} />
          <Row label="Size" value={order.size} />
        </Card>

        {/* Pricing */}
        <Card title="Pricing">
          <Row label="Rate" value={fmt(order.rate)} />
          <Row label="Card Rate" value={fmt(order.card_rate)} />
          <Row label="Discount" value={fmt(order.discount)} />
          <Divider />
          <Row label="Net Amount" value={fmt(order.net_amount)} bold />
          <Row label="GST (5%)" value={fmt(order.gst)} />
          <Divider />
          <Row label="Total Amount" value={fmt(order.total_amount)} bold highlight />
        </Card>

        {/* Special Comment */}
        {order.special_comment && (
          <Card title="Special Comment">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {order.special_comment}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}

function fmt(value: number | string): string {
  return Number(value).toFixed(2);
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-4 space-y-3">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  bold = false,
  highlight = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm ${bold ? "font-semibold" : ""} ${
          highlight ? "text-green-700 text-base" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100" />;
}
