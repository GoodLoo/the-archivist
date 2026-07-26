import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function generateOrderCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `TA-${year}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, email, phone, street, city, state, zip, country, notes, userId, paymentIntentId, paymentStatus, couponCode, discountAmount } = body;

    if (!items?.length || !customer || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const discount = Math.min(discountAmount || 0, subtotal);
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount > 500 ? 0 : 15.99;
    const tax = afterDiscount * 0.08;
    const total = afterDiscount + shipping + tax;
    const orderNumber = generateOrderCode();
    const address = `${street}, ${city}, ${state} ${zip}, ${country}`;

    const isPaid = paymentStatus === "paid";
    const orderStatus = isPaid ? "confirmed" : "pending";

    const orderInsert: any = {
      order_number: orderNumber,
      customer_name: customer,
      customer_email: email,
      customer: customer,
      email: email,
      phone,
      address_street: street,
      address_city: city,
      address_state: state,
      address_zip: zip,
      address_country: country,
      address,
      subtotal,
      shipping,
      tax,
      total,
      status: orderStatus,
      notes: notes || "",
      user_id: userId || null,
      date: new Date().toISOString().split("T")[0],
      payment_status: paymentStatus || "pending",
    };

    if (paymentIntentId) {
      orderInsert.stripe_payment_intent_id = paymentIntentId;
    }

    if (couponCode) {
      orderInsert.coupon_code = couponCode;
      orderInsert.discount_amount = discount;
      const { data: couponRow } = await supabaseAdmin
        .from("coupons")
        .select("used_count")
        .ilike("code", couponCode)
        .single();
      if (couponRow) {
        await supabaseAdmin
          .from("coupons")
          .update({ used_count: (couponRow.used_count || 0) + 1 })
          .ilike("code", couponCode);
      }
    }

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert(orderInsert)
      .select()
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Failed to create order: " + (orderErr?.message || "unknown") }, { status: 500 });
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(orderItems);
    if (itemsErr) {
      return NextResponse.json({ error: "Failed to create order items: " + itemsErr.message }, { status: 500 });
    }

    const timelineLabel = isPaid ? "Payment Received" : "Order Placed";
    const timelineNote = isPaid
      ? "Your payment has been received and your order is being processed."
      : "Your order has been placed and is awaiting payment confirmation.";

    const { error: timelineErr } = await supabaseAdmin.from("order_timeline").insert({
      order_id: order.id,
      status: orderStatus,
      label: timelineLabel,
      date: new Date().toISOString(),
      note: timelineNote,
      completed: true,
    });
    if (timelineErr) {
      return NextResponse.json({ error: "Failed to create timeline: " + timelineErr.message }, { status: 500 });
    }

    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("stock_quantity, in_stock")
        .eq("id", item.id)
        .single();

      if (product && product.stock_quantity && product.stock_quantity > 0) {
        const newQty = Math.max(0, product.stock_quantity - item.quantity);
        await supabaseAdmin
          .from("products")
          .update({ stock_quantity: newQty, in_stock: newQty > 0 })
          .eq("id", item.id);
      }
    }

    return NextResponse.json({
      orderNumber,
      id: order.id,
      customer,
      email,
      address,
      items,
      subtotal,
      shipping,
      tax,
      total,
      date: new Date().toISOString().split("T")[0],
      payment_status: orderInsert.payment_status,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error: " + (err?.message || "unknown") }, { status: 500 });
  }
}
