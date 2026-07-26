"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    min_order_amount: "",
    max_uses: "",
    expires_at: "",
    is_active: true,
  });

  useEffect(() => {
    const couponId = params.id as string;
    fetch(`/api/admin/coupons/${couponId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.coupon) {
          const c = data.coupon;
          setForm({
            code: c.code || "",
            type: c.type || "percentage",
            value: c.value?.toString() || "",
            min_order_amount: c.min_order_amount?.toString() || "",
            max_uses: c.max_uses?.toString() || "",
            expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
            is_active: c.is_active ?? true,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) {
      alert("Code and value are required");
      return;
    }
    try {
      const res = await fetch(`/api/admin/coupons/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: parseFloat(form.value),
          min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
          max_uses: form.max_uses ? parseInt(form.max_uses) : null,
          expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
          is_active: form.is_active,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update coupon");
      router.push("/admin/coupons");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-sm text-dark-text-secondary">Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-extrabold tracking-tight">
        Edit <span className="text-crimson">Coupon</span>
      </h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary mb-1.5 block">Coupon Code</label>
          <input name="code" value={form.code} onChange={handleChange} className="input-field w-full uppercase" required />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary mb-1.5 block">Discount Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field w-full">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed ($)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary mb-1.5 block">Value</label>
            <input name="value" type="number" step="0.01" min="0.01" value={form.value} onChange={handleChange} className="input-field w-full" required />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary mb-1.5 block">Min Order Amount ($)</label>
            <input name="min_order_amount" type="number" step="0.01" value={form.min_order_amount} onChange={handleChange} className="input-field w-full" placeholder="Optional" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary mb-1.5 block">Max Uses</label>
            <input name="max_uses" type="number" min="1" value={form.max_uses} onChange={handleChange} className="input-field w-full" placeholder="Unlimited" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary mb-1.5 block">Expires At</label>
          <input name="expires_at" type="date" value={form.expires_at} onChange={handleChange} className="input-field w-full" />
        </div>

        <div className="flex items-center gap-2">
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-crimson h-4 w-4" />
          <label className="text-xs text-dark-text-secondary">Active</label>
        </div>

        <button type="submit" className="btn-primary">Update Coupon</button>
      </form>
    </div>
  );
}
