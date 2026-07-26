import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const buf = await request.arrayBuffer();
    const raw = Buffer.from(buf);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const intentId = paymentIntent.id;

      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
        })
        .eq("stripe_payment_intent_id", intentId);

      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("stripe_payment_intent_id", intentId)
        .single();

      if (order) {
        for (const item of order.order_items || []) {
          const productId = item.product_id;
          const qty = item.quantity || 1;
          const { data: product } = await supabaseAdmin
            .from("products")
            .select("stock_quantity")
            .eq("id", productId)
            .single();

          if (product && product.stock_quantity && product.stock_quantity > 0) {
            const newQty = Math.max(0, product.stock_quantity - qty);
            await supabaseAdmin
              .from("products")
              .update({ stock_quantity: newQty, in_stock: newQty > 0 })
              .eq("id", productId);
          }
        }

        if (order.status !== "confirmed") {
          await supabaseAdmin.from("order_timeline").insert({
            order_id: order.id,
            status: "confirmed",
            label: "Payment Received",
            date: new Date().toISOString(),
            note: "Payment confirmed via Stripe.",
            completed: true,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
