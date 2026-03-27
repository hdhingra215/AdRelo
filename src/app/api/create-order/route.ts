import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    // Require authenticated user
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Creating Razorpay order...");
    const order = await razorpay.orders.create({
      amount: 99900,
      currency: "INR",
      notes: {
        user_id: user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("RAZORPAY ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return Response.json({ error: message }, { status: 500 });
  }
}
