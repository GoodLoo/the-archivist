import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ coupon: data });
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

    const updates: any = {};
    if (body.code !== undefined) updates.code = body.code.toUpperCase();
    if (body.type !== undefined) updates.type = body.type;
    if (body.value !== undefined) updates.value = body.value;
    if (body.min_order_amount !== undefined) updates.min_order_amount = body.min_order_amount || null;
    if (body.max_uses !== undefined) updates.max_uses = body.max_uses || null;
    if (body.expires_at !== undefined) updates.expires_at = body.expires_at || null;
    if (body.is_active !== undefined) updates.is_active = body.is_active;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("coupons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ coupon: data });
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
    const { error } = await supabaseAdmin.from("coupons").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ message: "Coupon deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
