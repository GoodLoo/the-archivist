import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids") || "";
    const ids = idsParam.split(",").filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ error: "No order IDs provided" }, { status: 400 });
    }

    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .in("id", ids);

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    const productIds = orders
      .flatMap((o) => o.order_items || [])
      .map((i: any) => i.product_id)
      .filter(Boolean);

    let sourceLinks: Record<string, string> = {};
    if (productIds.length > 0) {
      const { data: products } = await supabaseAdmin
        .from("products")
        .select("id, source_link")
        .in("id", productIds);
      if (products) {
        products.forEach((p) => {
          sourceLinks[p.id] = p.source_link || "";
        });
      }
    }

    const header = "Order Number,Order Date,Customer,Email,Delivery Address,Product Name,Qty,Source Link";
    const rows: string[] = [header];

    for (const order of orders) {
      const items = order.order_items || [];
      if (items.length === 0) {
        rows.push([
          escapeCsv(order.order_number),
          order.date || "",
          escapeCsv(order.customer || order.customer_name || ""),
          escapeCsv(order.customer_email || order.email || ""),
          escapeCsv(order.address || ""),
          "", "", "",
        ].join(","));
      } else {
        for (const item of items) {
          rows.push([
            escapeCsv(order.order_number),
            order.date || "",
            escapeCsv(order.customer || order.customer_name || ""),
            escapeCsv(order.customer_email || order.email || ""),
            escapeCsv(order.address || ""),
            escapeCsv(item.product_name || item.name || ""),
            item.quantity || 1,
            escapeCsv(sourceLinks[item.product_id] || ""),
          ].join(","));
        }
      }
    }

    const csv = rows.join("\r\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Export failed" }, { status: 500 });
  }
}

function escapeCsv(val: string | number | null | undefined): string {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
