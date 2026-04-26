import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureTrialPlan } from "@/lib/ensure-trial";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await ensureTrialPlan(supabase, user.id);
      }
      // Redirect through a loading page to avoid blank screen
      const safePath = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
