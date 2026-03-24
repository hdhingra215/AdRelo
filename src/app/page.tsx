import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">AdRelo</h1>
      <p className="mt-2 text-lg text-gray-600">The Agency Engine</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
