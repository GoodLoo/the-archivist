import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ coupons: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code || !body.type || !body.value) {
      return NextResponse.json({ error: "Code, type, and value are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("coupons")
      .insert({
        code: body.code.toUpperCase(),
        type: body.type,
        value: body.value,
        min_order_amount: body.min_order_amount || null,
        max_uses: body.max_uses || null,
        expires_at: body.expires_at || null,
        is_active: body.is_active ?? true,
      })
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
