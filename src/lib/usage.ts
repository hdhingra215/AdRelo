import { SupabaseClient } from "@supabase/supabase-js";
import { getPlan, type PlanDef } from "./plans";

/** Month boundaries in YYYY-MM-DD for the current UTC month. */
function monthBounds() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const start = `${y}-${String(m + 1).padStart(2, "0")}-01`;
  const nextMonth =
    m === 11
      ? `${y + 1}-01-01`
      : `${y}-${String(m + 2).padStart(2, "0")}-01`;
  return { start, end: nextMonth };
}

export interface UsageInfo {
  plan: PlanDef;
  roThisMonth: number;
  roLimit: number | null;
  canCreateRO: boolean;
}

/**
 * Fetches the user's plan + current-month RO count.
 * Works with any Supabase client (server or browser).
 */
export async function getUserUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<UsageInfo> {
  const { start, end } = monthBounds();

  const [settingsResult, roCountResult] = await Promise.all([
    supabase
      .from("agency_settings")
      .select("plan")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("release_orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start)
      .lt("created_at", end),
  ]);

  const planId = settingsResult.data?.plan ?? "free";
  const plan = getPlan(planId);
  const roThisMonth = roCountResult.count ?? 0;
  const canCreateRO = plan.roLimit === null || roThisMonth < plan.roLimit;

  return { plan, roThisMonth, roLimit: plan.roLimit, canCreateRO };
}
