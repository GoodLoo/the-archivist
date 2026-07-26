"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import Pagination from "@/components/Pagination";

interface Order {
  id: string;
  order_number: string;
  customer: string;
  email: string;
  items?: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  date: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-orange-500",
  confirmed: "bg-blue-500",
  processing: "bg-yellow-500 text-black",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  const loadOrders = (p: number, f: string) => {
    setLoading(true);
    fetch(`/api/admin/orders?page=${p}&per_page=20&filter=${f}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders(page, filter);
  }, [page, filter]);

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete order? This also removes all items and timeline entries and cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadOrders(page, filter);
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{total} total orders</p>
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={async () => {
              setExporting(true);
              try {
                const ids = Array.from(selectedIds).join(",");
                const res = await fetch(`/api/admin/orders/export?ids=${encodeURIComponent(ids)}`);
                if (!res.ok) throw new Error("Export failed");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `orders-export-${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              } catch (err: any) {
                alert(err?.message || "Export failed");
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {exporting ? "Exporting..." : `Export CSV (${selectedIds.size})`}
          </button>
        )}
      </div>
      <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-2">{selectedIds.size > 0 ? `${selectedIds.size} order${selectedIds.size > 1 ? "s" : ""} selected` : ""}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors capitalize
              ${filter === f
                ? "border-crimson bg-crimson text-white"
                : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 hover:border-crimson hover:text-crimson"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : (
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 text-left text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedIds.size === orders.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(orders.map((o) => o.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    className="accent-crimson h-4 w-4"
                  />
                </th>
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={`border-b border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 hover:bg-dark-bg/30 dark:hover:bg-dark-bg/30 hover:bg-gray-50 transition-colors ${selectedIds.has(order.id) ? "bg-crimson/5" : ""}`}>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        if (e.target.checked) {
                          next.add(order.id);
                        } else {
                          next.delete(order.id);
                        }
                        setSelectedIds(next);
                      }}
                      className="accent-crimson h-4 w-4"
                    />
                  </td>
                  <td className="p-3 font-medium text-dark-text dark:text-dark-text text-gray-900 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{order.customer}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{order.date}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{order.items?.length ?? 0}</td>
                  <td className="p-3 font-bold text-crimson">${order.total.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Link href={`/admin/orders/${order.id}`} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline mr-3">View</Link>
                    <button
                      onClick={() => handleDelete(order.id)}
                      disabled={deleting === order.id}
                      className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50"
                    >
                      {deleting === order.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
                {orders.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}
