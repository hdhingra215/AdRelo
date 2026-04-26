"use server";

import { createClient } from "@/lib/supabase/server";

interface SettingsInput {
  firm_name: string;
  gst_number: string;
  bank_account: string;
  ifsc: string;
  branch: string;
  upi_id: string;
  payment_instructions: string;
}

export async function saveSettings(input: SettingsInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Check if settings already exist for this user
  const { data: existing } = await supabase
    .from("agency_settings")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Update
    const { error } = await supabase
      .from("agency_settings")
      .update({
        firm_name: input.firm_name.trim(),
        gst_number: input.gst_number.trim(),
        bank_account: input.bank_account.trim(),
        ifsc: input.ifsc.trim(),
        branch: input.branch.trim(),
        upi_id: input.upi_id.trim(),
        payment_instructions: input.payment_instructions.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      return { error: "Failed to update settings: " + error.message };
    }
  } else {
    // Insert
    const { error } = await supabase.from("agency_settings").insert({
      user_id: user.id,
      firm_name: input.firm_name.trim(),
      gst_number: input.gst_number.trim(),
      bank_account: input.bank_account.trim(),
      ifsc: input.ifsc.trim(),
      branch: input.branch.trim(),
      upi_id: input.upi_id.trim(),
      payment_instructions: input.payment_instructions.trim(),
    });

    if (error) {
      return { error: "Failed to save settings: " + error.message };
    }
  }

  return { success: true };
}
