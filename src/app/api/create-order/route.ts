import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {

    console.log("Creating Razorpay order...");
    const order = await razorpay.orders.create({
      amount: 99900,
      currency: "INR",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("RAZORPAY ERROR:", error);
    return Response.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
