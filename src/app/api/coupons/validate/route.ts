import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const { data: coupon, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (error || !coupon) {
      const { data: discountCode, error: discountError } = await supabaseAdmin
        .from("discount_codes")
        .select("*")
        .ilike("code", code.trim())
        .single();

      if (discountError || !discountCode) {
        return NextResponse.json({ valid: false, error: "Invalid coupon code" });
      }

      if (!discountCode.is_active) {
        return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
      }

      if (discountCode.expires_at && new Date(discountCode.expires_at) < new Date()) {
        return NextResponse.json({ valid: false, error: "This coupon has expired" });
      }

      if (discountCode.status === "used") {
        return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
      }

      if (discountCode.used_count >= discountCode.max_uses) {
        return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
      }

      let discount = 0;
      if (discountCode.type === "percentage") {
        discount = (subtotal * discountCode.value) / 100;
      } else {
        discount = discountCode.value;
      }

      discount = Math.min(discount, subtotal);

      return NextResponse.json({
        valid: true,
        coupon: {
          id: discountCode.id,
          code: discountCode.code,
          type: discountCode.type,
          value: discountCode.value,
        },
        discount,
      });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount of $${coupon.min_order_amount} required`,
      });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
