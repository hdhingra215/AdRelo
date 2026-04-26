// © 2026 Himanshu Dhingra. All rights reserved.
import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Fetch order from Razorpay to get user_id from notes
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const userId =
      order.notes && typeof order.notes === "object"
        ? (order.notes as Record<string, string>).user_id
        : undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user information in order" },
        { status: 400 }
      );
    }

    // Upgrade plan to pro using Supabase
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("agency_settings")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("agency_settings")
        .update({ plan: "pro", updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from("agency_settings")
        .insert({ user_id: userId, plan: "pro" });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
