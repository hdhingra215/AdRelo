"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const GST_RATE = 0.05;

interface ReleaseOrderInput {
  ro_number: string;
  date: string;
  client_name: string;
  publication: string;
  edition: string;
  advertisement_category: string;
  caption: string;
  size: string;
  rate: number;
  card_rate: number;
  discount: number;
  publishing_date: string;
  special_comment: string;
}

export async function createReleaseOrder(input: ReleaseOrderInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Validate required fields
  if (
    !input.ro_number.trim() ||
    !input.date ||
    !input.client_name.trim() ||
    !input.publication.trim() ||
    !input.edition.trim() ||
    !input.advertisement_category.trim() ||
    !input.caption.trim() ||
    !input.size.trim() ||
    !input.publishing_date
  ) {
    return { error: "Please fill in all required fields." };
  }

  const rate = Number(input.rate) || 0;
  const discount = Number(input.discount) || 0;
  const cardRate = Number(input.card_rate) || 0;

  const net_amount = Math.max(rate - discount, 0);
  const gst = parseFloat((net_amount * GST_RATE).toFixed(2));
  const total_amount = parseFloat((net_amount + gst).toFixed(2));

  // Find or create client
  const clientName = input.client_name.trim();

  let clientId: string;

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("name", clientName)
    .single();

  if (existingClient) {
    clientId = existingClient.id;
  } else {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({ name: clientName })
      .select("id")
      .single();

    if (clientError || !newClient) {
      return { error: "Failed to create client: " + (clientError?.message ?? "Unknown error") };
    }
    clientId = newClient.id;
  }

  // Insert release order
  const { error: roError } = await supabase.from("release_orders").insert({
    ro_number: input.ro_number.trim(),
    date: input.date,
    client_id: clientId,
    publication: input.publication.trim(),
    edition: input.edition.trim(),
    advertisement_category: input.advertisement_category.trim(),
    caption: input.caption.trim(),
    size: input.size.trim(),
    rate,
    card_rate: cardRate,
    discount,
    net_amount,
    gst,
    total_amount,
    publishing_date: input.publishing_date,
    special_comment: input.special_comment?.trim() ?? "",
  });

  if (roError) {
    return { error: "Failed to create release order: " + roError.message };
  }

  redirect("/release-orders");
}
