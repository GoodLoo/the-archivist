import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("per_page") || "20")));
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { count: total, error: countErr } = await supabaseAdmin
      .from("customer_profiles")
      .select("id", { count: "exact", head: true });

    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }

    const { data: profiles, error } = await supabaseAdmin
      .from("customer_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const customers = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { count: orderCount, error: countErr } = await supabaseAdmin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("user_id", profile.id);

        const { data: orders, error: sumErr } = await supabaseAdmin
          .from("orders")
          .select("total")
          .eq("user_id", profile.id);

        const totalSpent = !sumErr && orders
          ? orders.reduce((sum, o) => sum + Number(o.total || 0), 0)
          : 0;

        return {
          ...profile,
          order_count: countErr ? 0 : (orderCount ?? 0),
          total_spent: totalSpent,
        };
      })
    );

    return NextResponse.json({
      customers,
      total: total || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((total || 0) / perPage),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
