import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function DELETE(request: Request) {
  try {
    const auth = request.headers.get("x-auth-token");
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${auth}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userData.user.id;

    await supabaseAdmin.from("customer_addresses").delete().eq("user_id", userId);
    await supabaseAdmin.from("wishlist_items").delete().eq("customer_id", userId);
    await supabaseAdmin.from("cart_items").delete().eq("customer_id", userId);
    await supabaseAdmin.from("customer_profiles").delete().eq("id", userId);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }

    return NextResponse.json({ message: "Account deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
