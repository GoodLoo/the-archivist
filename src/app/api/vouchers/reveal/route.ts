import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { deviceId } = await request.json();
    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "Missing device id" }, { status: 400 });
    }

    const { data: code, error } = await supabaseAdmin.rpc("claim_discount_code", {
      p_user_id: deviceId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!code) {
      return NextResponse.json({ error: "No vouchers available right now. Check back soon!" }, { status: 404 });
    }

    return NextResponse.json({ code });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
