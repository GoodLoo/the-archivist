"use client";

import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import Pagination from "@/components/Pagination";

interface CustomerWithStats {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadCustomers = (p: number) => {
    setLoading(true);
    fetch(`/api/admin/customers?page=${p}&per_page=20`)
      .then((r) => r.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers(page);
  }, [page]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete customer "${name}" (${id.slice(0, 8)}...)? This also removes their account and cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Delete failed"); }
      loadCustomers(page);
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Customers</h1>
      <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-6">{total} total customers</p>

      {loading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : (
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 text-left text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Orders</th>
                <th className="p-3 font-medium">Total Spent</th>
                <th className="p-3 font-medium">Joined</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 hover:bg-dark-bg/30 dark:hover:bg-dark-bg/30 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-dark-text dark:text-dark-text text-gray-900">{customer.name}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{customer.email}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{customer.phone || "\u2014"}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{customer.order_count}</td>
                  <td className="p-3 font-bold text-crimson">${customer.total_spent.toFixed(2)}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{customer.created_at ? customer.created_at.slice(0, 10) : "\u2014"}</td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(customer.id, customer.name)} disabled={deleting === customer.id} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50">
                      {deleting === customer.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}
