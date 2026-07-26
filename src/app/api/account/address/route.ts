import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getUserFromToken(request: Request) {
  const auth = request.headers.get("x-auth-token");
  if (!auth) return null;
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${auth}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data } = await userClient.auth.getUser();
  return data?.user || null;
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: address } = await supabaseAdmin
      .from("customer_addresses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    return NextResponse.json({ address: address || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { full_name, phone, street, city, state, zip, country } = body;

    const upsertData: any = {
      user_id: user.id,
      full_name: full_name || "",
      phone: phone || "",
      street: street || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      country: country || "United States",
      is_default: true,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabaseAdmin
      .from("customer_addresses")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabaseAdmin
        .from("customer_addresses")
        .update(upsertData)
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      upsertData.created_at = new Date().toISOString();
      result = await supabaseAdmin
        .from("customer_addresses")
        .insert(upsertData)
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    return NextResponse.json({ address: result.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
