import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientTable } from "./client-table";
import { AddClientButton } from "./add-client-button";

export default async function ClientsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, phone, gst_number, address, created_at")
    .order("name", { ascending: true });

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
          <span className="text-sm text-muted">Clients</span>
        </div>
        <AddClientButton />
      </nav>

      {/* Heading */}
      <div className="fade-in-up mx-auto max-w-6xl px-6 pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Clients
        </h1>
        <p className="mt-2 text-base text-muted">
          Manage your client directory
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        {error ? (
          <div className="fade-in rounded-xl bg-white/80 px-5 py-4 text-sm text-red-600 shadow-soft">
            Failed to load clients: {error.message}
          </div>
        ) : (
          <ClientTable clients={clients ?? []} />
        )}
      </div>
    </div>
  );
}
