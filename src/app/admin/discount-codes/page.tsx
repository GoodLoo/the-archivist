"use client";

import { useEffect, useState } from "react";

interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  batch_label: string | null;
  created_at: string;
  status: "active" | "reserved" | "used";
  reserved_email: string | null;
}

interface Settings {
  discountPrefix?: string;
  discountDefaultType?: string;
  discountDefaultValue?: string;
  discountDefaultExpiryDays?: string;
  discountDefaultMaxUses?: string;
}

export default function AdminDiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, reserved: 0, used: 0, redeemed: 0 });
  const [settings, setSettings] = useState<Settings>({});
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [batchLabel, setBatchLabel] = useState("");

  const [form, setForm] = useState({
    prefix: "ARCHIV",
    count: "10",
    type: "percentage",
    value: "10",
    expiryDays: "30",
    maxUses: "1",
  });

  const loadData = () => {
    fetch("/api/admin/discount-codes")
      .then((r) => r.json())
      .then((data) => {
        if (data.codes) setCodes(data.codes);
        if (data.stats) setStats(data.stats);
      });
  };

  useEffect(() => {
    loadData();
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setForm((f) => ({
          ...f,
          prefix: data.discountPrefix || f.prefix,
          type: data.discountDefaultType || f.type,
          value: data.discountDefaultValue || f.value,
          expiryDays: data.discountDefaultExpiryDays || f.expiryDays,
          maxUses: data.discountDefaultMaxUses || f.maxUses,
        }));
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, batchLabel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate codes");
      loadData();
      setBatchLabel("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete code "${code}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    try {
      const res = await fetch(`/api/admin/discount-codes/${code.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !code.is_active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      alert("Could not copy to clipboard");
    }
  };

  const isExpired = (expires_at: string | null) => {
    if (!expires_at) return false;
    return new Date(expires_at) < new Date();
  };

  const statusOf = (code: DiscountCode): { label: string; color: string } => {
    if (isExpired(code.expires_at)) return { label: "Expired", color: "text-gray-500" };
    if (code.status === "used") return { label: "Used", color: "text-orange-500" };
    if (code.status === "reserved") return { label: "Reserved", color: "text-crimson" };
    return code.is_active
      ? { label: "Active", color: "text-green-500" }
      : { label: "Disabled", color: "text-red-500" };
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">
          Discount Code<span className="text-crimson">s</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total Generated", value: stats.total, color: "text-dark-text" },
          { label: "Active", value: stats.active, color: "text-green-500" },
          { label: "Reserved", value: stats.reserved, color: "text-crimson" },
          { label: "Used", value: stats.used, color: "text-orange-500" },
          { label: "Total Redeemed", value: stats.redeemed, color: "text-gray-400" },
        ].map((card) => (
          <div key={card.label} className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-0.5">{card.label}</p>
            <p className={`font-heading text-lg font-extrabold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleGenerate} className="mb-6 border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-1">Generate Codes</h2>
        <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-4">
          Pre-filled from Settings. Codes are distributed manually &mdash; copy them below and send to customers.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Prefix</label>
            <input name="prefix" value={form.prefix} onChange={handleChange} className="input-field w-full" placeholder="ARCHIV" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Number of Codes</label>
            <input name="count" type="number" min="1" max="200" value={form.count} onChange={handleChange} className="input-field w-full" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Batch Label (optional)</label>
            <input value={batchLabel} onChange={(e) => setBatchLabel(e.target.value)} className="input-field w-full" placeholder="e.g. Launch giveaway" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Discount Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field w-full">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">
              {form.type === "percentage" ? "Value (%)" : "Value ($)"}
            </label>
            <input name="value" type="number" step="0.01" min="0.01" value={form.value} onChange={handleChange} className="input-field w-full" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Expires After (days)</label>
            <input name="expiryDays" type="number" min="0" value={form.expiryDays} onChange={handleChange} className="input-field w-full" placeholder="Leave 0 for no expiry" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Max Uses Per Code</label>
            <input name="maxUses" type="number" min="1" value={form.maxUses} onChange={handleChange} className="input-field w-full" />
          </div>
        </div>
        {error && <p className="mt-4 text-xs font-medium text-red-500">{error}</p>}
        <button type="submit" disabled={generating} className="btn-primary mt-4 text-xs disabled:opacity-50">
          {generating ? "Generating..." : "Generate Codes"}
        </button>
      </form>

      <div className="overflow-x-auto border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dark-border/30 text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary">
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Discount</th>
              <th className="p-3 font-medium">Usage</th>
              <th className="p-3 font-medium">Expires</th>
              <th className="p-3 font-medium">Batch</th>
              <th className="p-3 font-medium">Reserved For</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => {
              const status = statusOf(code);
              return (
                <tr key={code.id} className="border-b border-dark-border/30 hover:bg-dark-bg/30 transition-colors">
                  <td className="p-3 font-bold text-dark-text whitespace-nowrap">
                    <button onClick={() => copyCode(code.code)} className="hover:text-crimson transition-colors" title="Copy to clipboard">
                      {code.code} {copied === code.code ? <span className="text-green-500 text-[10px] font-medium">Copied!</span> : <span className="text-[9px] font-medium text-dark-text-secondary">copy</span>}
                    </button>
                  </td>
                  <td className="p-3 text-dark-text-secondary">{code.type === "percentage" ? `${code.value}%` : `$${Number(code.value).toFixed(2)}`}</td>
                  <td className="p-3 text-dark-text-secondary">{code.used_count} / {code.max_uses}</td>
                  <td className="p-3 text-dark-text-secondary">
                    {code.expires_at ? (
                      <span className={isExpired(code.expires_at) ? "text-red-500" : ""}>
                        {new Date(code.expires_at).toLocaleDateString()}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="p-3 text-dark-text-secondary">{code.batch_label || "—"}</td>
                  <td className="p-3 text-dark-text-secondary">
                    {code.status === "reserved" ? (
                      code.reserved_email || "—"
                    ) : (
                      <span className="text-dark-text-secondary/50">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleActive(code)}
                      disabled={isExpired(code.expires_at) || code.status !== "active"}
                      className={`text-xs font-medium disabled:opacity-50 ${status.color}`}
                      title={code.status !== "active" ? "Only active codes can be toggled" : undefined}
                    >
                      {status.label}
                    </button>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <button onClick={() => handleDelete(code.id, code.code)} disabled={deleting === code.id} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50">
                      {deleting === code.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {codes.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-sm text-dark-text-secondary">No discount codes yet. Generate your first batch above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
