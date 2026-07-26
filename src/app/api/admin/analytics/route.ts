import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly";

    const now = new Date();
    const yearAgo = new Date(now);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const { data: orders, error: ordersErr } = await supabaseAdmin
      .from("orders")
      .select("id, total, status, date, customer_email")
      .gte("date", yearAgo.toISOString());

    if (ordersErr) {
      return NextResponse.json({ error: ordersErr.message }, { status: 500 });
    }

    const { count: totalCustomers, error: custErr } = await supabaseAdmin
      .from("customer_profiles")
      .select("id", { count: "exact", head: true });

    if (custErr) {
      return NextResponse.json({ error: custErr.message }, { status: 500 });
    }

    const { data: orderItems, error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .select("product_name, price, quantity, order_id");

    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 500 });
    }

    const activeOrders = (orders || []).filter((o) => o.status !== "cancelled");
    const totalRevenue = activeOrders.reduce((s, o) => s + Number(o.total || 0), 0);
    const totalOrders = orders?.length || 0;
    const pendingOrders = (orders || []).filter((o) => o.status === "pending").length;
    const customerCount = totalCustomers || 0;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = customerCount > 0 ? ((totalOrders / customerCount) * 100).toFixed(1) : "0.0";

    const chartData: { label: string; revenue: number; orders: number }[] = [];

    if (period === "weekly") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const dayBuckets: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        dayBuckets[day.toISOString().slice(0, 10)] = { revenue: 0, orders: 0 };
      }

      activeOrders.forEach((o) => {
        const d = new Date(o.date);
        if (d >= weekStart) {
          const key = o.date.slice(0, 10);
          if (dayBuckets[key]) {
            dayBuckets[key].revenue += Number(o.total || 0);
            dayBuckets[key].orders += 1;
          }
        }
      });

      Object.entries(dayBuckets).forEach(([dateStr, val]) => {
        chartData.push({
          label: days[new Date(dateStr).getDay()],
          revenue: Math.round(val.revenue),
          orders: val.orders,
        });
      });
    } else {
      const monthlyBuckets: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyBuckets[months[d.getMonth()]] = { revenue: 0, orders: 0 };
      }

      activeOrders.forEach((o) => {
        const d = new Date(o.date);
        const key = months[d.getMonth()];
        if (monthlyBuckets[key]) {
          monthlyBuckets[key].revenue += Number(o.total || 0);
          monthlyBuckets[key].orders += 1;
        }
      });

      Object.entries(monthlyBuckets).forEach(([label, val]) => {
        chartData.push({
          label,
          revenue: Math.round(val.revenue),
          orders: val.orders,
        });
      });
    }

    const productSalesMap: Record<string, { sales: number; revenue: number }> = {};
    (orderItems || []).forEach((item: any) => {
      const name = item.product_name || "Unknown";
      if (!productSalesMap[name]) productSalesMap[name] = { sales: 0, revenue: 0 };
      productSalesMap[name].sales += item.quantity || 1;
      productSalesMap[name].revenue += (Number(item.price || 0)) * (item.quantity || 1);
    });

    const topProducts = Object.entries(productSalesMap)
      .map(([name, data]) => ({ name, sales: data.sales, revenue: data.revenue }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    const maxSales = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.sales)) : 1;

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      pendingOrders,
      totalCustomers: customerCount,
      aov: Math.round(aov * 100) / 100,
      conversionRate,
      chartData,
      topProducts,
      maxSales,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
