import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ensures the user has an agency_settings row with a plan.
 * If no row exists, inserts one with plan = "trial".
 * Safe to call on every login — does nothing if a row already exists.
 */
export async function ensureTrialPlan(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: existing } = await supabase
    .from("agency_settings")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabase
      .from("agency_settings")
      .insert({ user_id: userId, plan: "trial" });
  }
}
