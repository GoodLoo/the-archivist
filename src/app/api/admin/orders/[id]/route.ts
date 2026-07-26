import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*), order_timeline(*)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updates: any = {};
    if (body.status) updates.status = body.status;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.status === "confirmed" && existing.customer_email) {
      const itemsList = (existing.order_items || [])
        .map((i: any) => `${i.product_name || i.name} x${i.quantity} — $${(Number(i.price) * i.quantity).toFixed(2)}`)
        .join("<br/>");

      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        await transporter.sendMail({
          from: `"The Archivist" <${process.env.SMTP_USER}>`,
          to: existing.customer_email,
          subject: `Order Confirmed — ${existing.order_number}`,
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align:center;margin-bottom:24px;">
                <img src="https://thearchivist.com/favicon.ico" alt="The Archivist" style="height:48px;width:48px;" />
                <h1 style="color:#DC143C;font-size:28px;margin:8px 0 0;">Order Confirmed!</h1>
              </div>
              <p>Hi <strong>${existing.customer}</strong>,</p>
              <p>Your order <strong>${existing.order_number}</strong> has been confirmed and is being processed.</p>
              <h3>Order Summary</h3>
              ${itemsList}
              <p><strong>Total: $${Number(existing.total).toFixed(2)}</strong></p>
              <h3>Shipping Address</h3>
              <p>${existing.address}</p>
              <p style="color: #666;">Thank you for shopping at The Archivist!</p>
            </div>
          `,
        });
      } catch (emailErr: any) {
        console.error("Failed to send confirmation email:", emailErr?.message);
      }
    }

    if (body.status && body.status !== existing.status) {
      await supabaseAdmin.from("order_timeline").insert({
        order_id: id,
        status: body.status,
        label: body.status.charAt(0).toUpperCase() + body.status.slice(1),
        date: new Date().toISOString(),
        note: body.timelineNote || `Order status changed to ${body.status}`,
        completed: true,
      });
    } else if (body.timelineNote && !body.status) {
      const currentStatus = existing.status || "pending";
      await supabaseAdmin.from("order_timeline").insert({
        order_id: id,
        status: currentStatus,
        label: "Note",
        date: new Date().toISOString(),
        note: body.timelineNote,
        completed: true,
      });
    }

    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await supabaseAdmin.from("order_items").delete().eq("order_id", id);
    await supabaseAdmin.from("order_timeline").delete().eq("order_id", id);
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ message: "Order deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
