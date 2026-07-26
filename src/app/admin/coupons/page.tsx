"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => {
        if (data.coupons) setCoupons(data.coupons);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !coupon.is_active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const isExpired = (expires_at: string | null) => {
    if (!expires_at) return false;
    return new Date(expires_at) < new Date();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">
          Coupon<span className="text-crimson">s</span>
        </h1>
        <Link href="/admin/coupons/new" className="btn-primary text-xs">
          + New Coupon
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dark-border/30 text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary">
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Discount</th>
              <th className="p-3 font-medium">Usage</th>
              <th className="p-3 font-medium">Expires</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-dark-border/30 hover:bg-dark-bg/30 transition-colors">
                <td className="p-3 font-bold text-dark-text">{coupon.code}</td>
                <td className="p-3 text-dark-text-secondary">
                  {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                  {coupon.min_order_amount && <span className="ml-1 text-[10px]">(min ${coupon.min_order_amount})</span>}
                </td>
                <td className="p-3 text-dark-text-secondary">
                  {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                </td>
                <td className="p-3 text-dark-text-secondary">
                  {coupon.expires_at ? (
                    <span className={isExpired(coupon.expires_at) ? "text-red-500" : ""}>
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                  ) : "—"}
                </td>
                <td className="p-3">
                  <button onClick={() => toggleActive(coupon)} className={`text-xs font-medium ${coupon.is_active ? "text-green-500" : "text-red-500"}`}>
                    {coupon.is_active ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <Link href={`/admin/coupons/${coupon.id}`} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline mr-3">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(coupon.id, coupon.code)} disabled={deleting === coupon.id} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50">
                    {deleting === coupon.id ? "..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-sm text-dark-text-secondary">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
