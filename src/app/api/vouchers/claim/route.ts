import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "You must be signed in to claim a voucher" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.getUser(authHeader);
    if (error || !data.user) {
      return NextResponse.json({ error: "You must be signed in to claim a voucher" }, { status: 401 });
    }

    const { data: code, error: rpcError } = await supabaseAdmin.rpc("claim_discount_code", {
      p_user_id: data.user.id,
    });

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    if (!code) {
      return NextResponse.json({ error: "No vouchers available right now. Check back soon!" }, { status: 404 });
    }

    return NextResponse.json({ code });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
