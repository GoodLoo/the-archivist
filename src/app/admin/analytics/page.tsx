"use client";

import { useEffect, useState } from "react";
import { StatsGridSkeleton, ChartSkeleton } from "@/components/LoadingSkeleton";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  const fetchData = (period: string) => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) console.error(d.error);
        else setData(d);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(view);
  }, [view]);

  if (loading && !data) {
    return (
      <div>
        <div className="animate-pulse mb-6">
          <div className="h-8 w-32 bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-64 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-100 rounded" />
        </div>
        <StatsGridSkeleton count={6} />
        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const chartData = data?.chartData || [];
  const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue), 1);
  const maxOrders = Math.max(...chartData.map((d: any) => d.orders), 1);
  const productSales = data?.topProducts || [];
  const maxSales = data?.maxSales || 1;

  const statCards = [
    { label: "Total Revenue", value: `$${(data?.totalRevenue || 0).toLocaleString()}`, sub: "Lifetime revenue" },
    { label: "Total Orders", value: (data?.totalOrders || 0).toString(), sub: `${data?.pendingOrders || 0} pending` },
    { label: "Avg. Order Value", value: `$${(data?.aov || 0).toFixed(2)}`, sub: "Per order" },
    { label: "Total Customers", value: (data?.totalCustomers || 0).toString(), sub: `${data?.totalCustomers || 0} registered` },
    { label: "Conversion Rate", value: `${data?.conversionRate || "0.0"}%`, sub: "Orders to customers" },
    { label: "Top Product", value: productSales[0]?.name || "N/A", sub: `${productSales[0]?.sales || 0} units sold` },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Analytics</h1>
      <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-6">Store performance metrics.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1">{card.label}</p>
            <p className="font-heading text-xl font-extrabold text-crimson">{card.value}</p>
            <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Revenue</h2>
            <div className="flex gap-1">
              {(["monthly", "weekly"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                    view === v
                      ? "border-crimson bg-crimson text-white"
                      : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:border-crimson"
                  }`}
                >
                  {v === "monthly" ? "Monthly" : "Weekly"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-[3px]" style={{ height: 160 }}>
            {chartData.map((d: any) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-[2px]">
                <div
                  className="w-full bg-crimson/80 hover:bg-crimson transition-colors rounded-sm"
                  style={{ height: `${Math.max((d.revenue / maxRevenue) * 130, 4)}px` }}
                />
                <span className="text-[9px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 leading-none">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Orders</h2>
            <div className="flex gap-1">
              {(["monthly", "weekly"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                    view === v
                      ? "border-crimson bg-crimson text-white"
                      : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:border-crimson"
                  }`}
                >
                  {v === "monthly" ? "Monthly" : "Weekly"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-[3px]" style={{ height: 160 }}>
            {chartData.map((d: any) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-[2px]">
                <div
                  className="w-full bg-blue-500/80 hover:bg-blue-500 transition-colors rounded-sm"
                  style={{ height: `${Math.max((d.orders / maxOrders) * 130, 4)}px` }}
                />
                <span className="text-[9px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 leading-none">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Top Products by Sales</h2>
        {productSales.length > 0 ? (
          <div className="space-y-3">
            {productSales.map((p: any, i: number) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 w-4 text-right">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-dark-text dark:text-dark-text text-gray-900 truncate">{p.name}</span>
                    <span className="text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{p.sales} units</span>
                  </div>
                  <div className="h-2 bg-dark-bg dark:bg-dark-bg bg-gray-100">
                    <div className="h-full bg-crimson transition-all" style={{ width: `${(p.sales / maxSales) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-crimson w-16 text-right">${p.revenue.toFixed(0)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 py-4 text-center">No sales data yet</p>
        )}
      </div>
    </div>
  );
}
