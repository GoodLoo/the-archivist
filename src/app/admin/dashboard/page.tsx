"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

interface Order {
  id: string;
  total: number;
  status: string;
  date: string;
  customer: string;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [period, setPeriod] = useState<"6months" | "month" | "week">("6months");

  useEffect(() => {
    async function fetchData() {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - 6);

      const [ordersRes, productsRes, customersRes, blogRes] = await Promise.all([
        supabaseAdmin
          .from("orders")
          .select("id, total, status, date, customer")
          .gte("date", cutoff.toISOString())
          .order("date", { ascending: false }),
        supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("customer_profiles").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (productsRes.count !== null) setProductCount(productsRes.count);
      if (customersRes.count !== null) setCustomerCount(customersRes.count);
      if (blogRes.count !== null) setBlogCount(blogRes.count);
    }
    fetchData();
  }, []);

  const nonCancelled = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = nonCancelled.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const recentOrders = orders.slice(0, 5);

  const now = new Date();

  const chartData = (() => {
    const relevant = nonCancelled.filter((o) => {
      const d = new Date(o.date);
      if (period === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return d >= weekStart;
      }
      if (period === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true;
    });

    if (period === "week") {
      const dayBuckets: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 0; i < 7; i++) {
        const day = new Date(now);
        day.setDate(now.getDate() - now.getDay() + i);
        dayBuckets[day.toISOString().slice(0, 10)] = { revenue: 0, orders: 0 };
      }
      relevant.forEach((o) => {
        const key = o.date.slice(0, 10);
        if (dayBuckets[key]) {
          dayBuckets[key].revenue += o.total;
          dayBuckets[key].orders += 1;
        }
      });
      return Object.entries(dayBuckets).map(([dateStr, val]) => ({
        label: days[new Date(dateStr).getDay()],
        revenue: Math.round(val.revenue),
        orders: val.orders,
      }));
    }

    if (period === "month") {
      const weekBuckets: { label: string; revenue: number; orders: number }[] = [];
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      let weekStart = new Date(firstDay);
      while (weekStart <= lastDay) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const label = `${weekStart.getDate()}-${Math.min(weekEnd.getDate(), lastDay.getDate())}`;
        weekBuckets.push({ label, revenue: 0, orders: 0 });
        weekStart.setDate(weekStart.getDate() + 7);
      }
      relevant.forEach((o) => {
        const d = new Date(o.date);
        const day = d.getDate();
        const idx = Math.min(Math.floor((day - 1) / 7), weekBuckets.length - 1);
        weekBuckets[idx].revenue += o.total;
        weekBuckets[idx].orders += 1;
      });
      return weekBuckets.map((b) => ({
        ...b,
        revenue: Math.round(b.revenue),
      }));
    }

    const monthlyBuckets: Record<string, { revenue: number; orders: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = months[d.getMonth()];
      monthlyBuckets[key] = { revenue: 0, orders: 0 };
    }
    relevant.forEach((o) => {
      const d = new Date(o.date);
      const key = months[d.getMonth()];
      if (monthlyBuckets[key]) {
        monthlyBuckets[key].revenue += o.total;
        monthlyBuckets[key].orders += 1;
      }
    });
    return Object.entries(monthlyBuckets).map(([label, val]) => ({
      label,
      revenue: Math.round(val.revenue),
      orders: val.orders,
    }));
  })();

  const maxChartRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const maxChartOrders = Math.max(...chartData.map((d) => d.orders), 1);

  const statCards = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: totalRevenue > 0 ? "Last 6 months" : "No data yet", href: "/admin/analytics", color: "text-crimson" },
    { label: "Total Orders", value: nonCancelled.length.toString(), change: `${pendingCount} pending`, href: "/admin/orders", color: "text-blue-500" },
    { label: "Products", value: productCount.toString(), change: `${productCount} live`, href: "/admin/products", color: "text-green-500" },
    { label: "Customers", value: customerCount.toString(), change: `${customerCount} total`, href: "/admin/customers", color: "text-yellow-500" },
    { label: "Pending Orders", value: pendingCount.toString(), change: "Needs attention", href: "/admin/orders", color: "text-orange-500" },
    { label: "Blog Posts", value: blogCount.toString(), change: `${blogCount} published`, href: "/admin/blog", color: "text-purple-500" },
  ];

  const orderStatusColors: Record<string, string> = {
    pending: "bg-orange-500",
    confirmed: "bg-blue-500",
    processing: "bg-yellow-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">Overview of your store activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-3 hover:border-crimson transition-colors">
            <p className="text-[9px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-0.5">{card.label}</p>
            <p className={`font-heading text-lg font-extrabold ${card.color}`}>{card.value}</p>
            <p className="text-[9px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mt-0.5">{card.change}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider">Revenue</h2>
            <div className="flex gap-1">
              {(["6months", "month", "week"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                    period === p
                      ? "border-crimson bg-crimson text-white"
                      : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:border-crimson"
                  }`}
                >
                  {p === "6months" ? "6 Mo" : p === "month" ? "Month" : "Week"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-[2px]" style={{ height: 112 }}>
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-[1px]">
                <div
                  className="w-full bg-crimson/80 hover:bg-crimson transition-colors rounded-sm"
                  style={{ height: `${Math.max((d.revenue / maxChartRevenue) * 90, 3)}px` }}
                />
                <span className="text-[8px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 leading-none">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-crimson" /> Revenue
            </span>
            <span>Total: ${chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider">Orders</h2>
            <div className="flex gap-1">
              {(["6months", "month", "week"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                    period === p
                      ? "border-crimson bg-crimson text-white"
                      : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:border-crimson"
                  }`}
                >
                  {p === "6months" ? "6 Mo" : p === "month" ? "Month" : "Week"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-[2px]" style={{ height: 112 }}>
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-[1px]">
                <div
                  className="w-full bg-blue-500/80 hover:bg-blue-500 transition-colors rounded-sm"
                  style={{ height: `${Math.max((d.orders / maxChartOrders) * 90, 3)}px` }}
                />
                <span className="text-[8px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 leading-none">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-blue-500" /> Orders
            </span>
            <span>Total: {chartData.reduce((s, d) => s + d.orders, 0)}</span>
          </div>
        </div>
      </div>

      <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-4">
        <h2 className="font-heading text-xs font-bold uppercase tracking-wider mb-3">Recent Orders</h2>
        <div className="space-y-1">
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between py-1.5 border-b border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 text-xs hover:text-crimson transition-colors last:border-0">
              <div>
                <p className="font-medium text-dark-text dark:text-dark-text text-gray-900 font-mono text-[10px]">{order.id.slice(0, 8)}</p>
                <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{order.customer}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${orderStatusColors[order.status]}`}>
                  {order.status}
                </span>
                <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mt-0.5">${order.total.toFixed(2)}</p>
              </div>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 py-3 text-center">No recent orders</p>
          )}
        </div>
        <Link href="/admin/orders" className="mt-2 inline-block text-[10px] font-medium text-crimson hover:underline">
          View All Orders &rarr;
        </Link>
      </div>
    </div>
  );
}
