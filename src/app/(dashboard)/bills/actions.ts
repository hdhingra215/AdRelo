"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface BillInput {
  bill_number: string;
  date: string;
  release_order_id: string;
  client_id: string;
  amount: number;
  discount: number;
  net_amount: number;
  gst: number;
  total_amount: number;
  amount_in_words: string;
}

export async function createBill(input: BillInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!input.bill_number.trim() || !input.date || !input.release_order_id || !input.client_id) {
    return { error: "Please fill in all required fields." };
  }

  // Insert the bill
  const { data: bill, error: billError } = await supabase
    .from("bills")
    .insert({
      bill_number: input.bill_number.trim(),
      date: input.date,
      release_order_id: input.release_order_id,
      client_id: input.client_id,
      amount: input.amount,
      discount: input.discount,
      net_amount: input.net_amount,
      gst: input.gst,
      total_amount: input.total_amount,
      amount_in_words: input.amount_in_words.trim(),
    })
    .select("id")
    .single();

  if (billError || !bill) {
    return { error: "Failed to create bill: " + (billError?.message ?? "Unknown error") };
  }

  // Mark release order as billed
  const { error: updateError } = await supabase
    .from("release_orders")
    .update({ bill_generated: true })
    .eq("id", input.release_order_id);

  if (updateError) {
    return { error: "Bill created but failed to update release order: " + updateError.message };
  }

  redirect(`/bills/${bill.id}`);
}
