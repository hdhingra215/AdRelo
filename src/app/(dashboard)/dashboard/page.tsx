import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">AdRelo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Welcome to The Agency Engine.
        </p>
        <div className="mt-6">
          <Link
            href="/release-orders/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Release Order
          </Link>
        </div>
      </main>
    </div>
  );
}
