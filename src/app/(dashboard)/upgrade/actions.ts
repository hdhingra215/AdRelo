"use server";

import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/lib/plans";

/**
 * Simulate a plan upgrade. In production this would be
 * called from a Stripe webhook after successful payment.
 */
export async function upgradePlan(planId: PlanId) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (planId !== "pro" && planId !== "business") {
    return { error: "Invalid plan." };
  }

  // Check if settings row exists
  const { data: existing } = await supabase
    .from("agency_settings")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("agency_settings")
      .update({ plan: planId, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("agency_settings")
      .insert({ user_id: user.id, plan: planId });

    if (error) return { error: error.message };
  }

  return { success: true };
}
