import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("per_page") || "20")));
    const filter = searchParams.get("filter") || "all";
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabaseAdmin.from("orders").select("*", { count: "exact" });
    if (filter !== "all") {
      query = query.eq("status", filter);
    }
    const { data: allOrders, count: total, error: countErr } = await query.order("date", { ascending: false });

    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }

    const paginatedOrders = (allOrders || []).slice(from, to + 1);

    const orderIds = paginatedOrders.map((o) => o.id);
    let itemsMap: Record<string, any[]> = {};
    let timelineMap: Record<string, any[]> = {};

    if (orderIds.length > 0) {
      const [itemsRes, timelineRes] = await Promise.all([
        supabaseAdmin.from("order_items").select("*").in("order_id", orderIds),
        supabaseAdmin.from("order_timeline").select("*").in("order_id", orderIds),
      ]);
      if (itemsRes.data) {
        itemsRes.data.forEach((item) => {
          if (!itemsMap[item.order_id]) itemsMap[item.order_id] = [];
          itemsMap[item.order_id].push(item);
        });
      }
      if (timelineRes.data) {
        timelineRes.data.forEach((evt) => {
          if (!timelineMap[evt.order_id]) timelineMap[evt.order_id] = [];
          timelineMap[evt.order_id].push(evt);
        });
      }
    }

    const orders = paginatedOrders.map((o) => ({
      ...o,
      order_items: itemsMap[o.id] || [],
      order_timeline: timelineMap[o.id] || [],
    }));

    return NextResponse.json({
      orders,
      total: total || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((total || 0) / perPage),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
