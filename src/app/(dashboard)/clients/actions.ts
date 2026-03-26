"use server";

import { createClient } from "@/lib/supabase/server";

interface ClientForm {
  name: string;
  phone: string;
  gst_number: string;
  address: string;
}

export async function createClientAction(form: ClientForm) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  if (!form.name.trim()) return { error: "Client name is required" };

  const { error } = await supabase.from("clients").insert({
    name: form.name.trim(),
    phone: form.phone.trim(),
    gst_number: form.gst_number.trim(),
    address: form.address.trim(),
  });

  if (error) {
    if (error.code === "23505") return { error: "A client with this name already exists" };
    return { error: error.message };
  }

  return { success: true };
}

export async function updateClientAction(id: string, form: ClientForm) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  if (!form.name.trim()) return { error: "Client name is required" };

  const { error } = await supabase
    .from("clients")
    .update({
      name: form.name.trim(),
      phone: form.phone.trim(),
      gst_number: form.gst_number.trim(),
      address: form.address.trim(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "A client with this name already exists" };
    return { error: error.message };
  }

  return { success: true };
}
