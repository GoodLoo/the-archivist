"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminManagementPage() {
  const { user } = useAdmin();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isSuperAdmin = user?.role === "super_admin";

  const fetchAdmins = async () => {
    const token = localStorage.getItem("admin-token");
    const res = await fetch("/api/admin/admins", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setAdmins(data.admins);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) fetchAdmins();
  }, [isSuperAdmin]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("admin-token");
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      setShowForm(false);
      setEmail("");
      setPassword("");
      fetchAdmins();
    } else {
      const d = await res.json();
      setError(d.error || "Failed to create admin");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("admin-token");
    await fetch(`/api/admin/admins/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAdmins();
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Access denied. Super admin only.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Admin Management</h1>
          <p className="text-sm text-dark-text-secondary">{admins.length} admin(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs">
          + Add Admin
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="max-w-md mb-6 border border-dark-border bg-dark-surface p-5 space-y-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">New Admin</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full" required />
          {error && <p className="text-xs text-crimson">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-xs">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="border border-dark-border bg-dark-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border/50 text-left text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary">
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-dark-border/30 hover:bg-dark-bg/30 transition-colors">
                <td className="p-3 font-medium text-dark-text">{admin.email}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${admin.role === "super_admin" ? "bg-crimson" : "bg-blue-500"}`}>
                    {admin.role}
                  </span>
                </td>
                <td className="p-3 text-dark-text-secondary">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {admin.role !== "super_admin" && (
                    <button onClick={() => handleDelete(admin.id)} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
