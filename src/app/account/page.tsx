"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import SeoHead from "@/components/SeoHead";

interface Order {
  order_number: string;
  date: string;
  status: string;
  total: number;
  items_count: number;
}

interface Address {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "New Zealand",
  "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Switzerland",
  "Austria", "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Portugal",
  "Poland", "Czech Republic", "Greece", "Japan", "South Korea", "Singapore",
  "China", "India", "Brazil", "Mexico", "Argentina", "Colombia", "Chile",
  "South Africa", "Nigeria", "Kenya", "United Arab Emirates", "Saudi Arabia",
  "Turkey", "Russia", "Thailand", "Vietnam", "Malaysia", "Philippines",
  "Indonesia", "Israel", "Egypt", "Morocco", "Other",
];

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "orders";
  const { user, loading, logout } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [address, setAddress] = useState<Address>({
    full_name: "", phone: "", street: "", city: "", state: "", zip: "", country: "United States",
  });
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMsg, setAddressMsg] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("order_number, date, status, total, id")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (data) {
          Promise.all(
            data.map(async (o) => {
              const { count } = await supabase
                .from("order_items")
                .select("id", { count: "exact", head: true })
                .eq("order_id", o.id);
              return { ...o, items_count: count || 0 };
            })
          ).then(setOrders);
        }
        setOrdersLoading(false);
      });
  }, [user]);

  const loadAddress = useCallback(async () => {
    if (!user) return;
    setAddressLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) { setAddressLoading(false); return; }
      const res = await fetch("/api/account/address", {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (data.address) {
        setAddress(data.address);
      }
    } catch {}
    setAddressLoading(false);
  }, [user]);

  useEffect(() => {
    if (tab === "address") {
      loadAddress();
    }
  }, [tab, loadAddress]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    if (!user) return;
    setAddressSaving(true);
    setAddressMsg("");
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) { setAddressMsg("Not authenticated."); setAddressSaving(false); return; }
      const res = await fetch("/api/account/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (data.address) {
        setAddressMsg("Address saved successfully.");
      } else {
        setAddressMsg(data.error || "Failed to save address.");
      }
    } catch {
      setAddressMsg("Network error.");
    }
    setAddressSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeletingAccount(true);
    setDeleteError("");
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) { setDeleteError("Not authenticated."); setDeletingAccount(false); return; }
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      if (res.ok) {
        await logout();
        router.push("/");
      } else {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete account.");
      }
    } catch {
      setDeleteError("Network error.");
    }
    setDeletingAccount(false);
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-center"><SeoHead title="My Account | The Archivist" /><p className="text-dark-text-secondary">Loading...</p></div>;
  }

  const tabs = [
    { key: "orders", label: "Orders" },
    { key: "address", label: "Address" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="mx-auto max-w-4xl py-8">
      <SeoHead title="My Account | The Archivist" description="Manage your account, view order history, and update your preferences at The Archivist." />
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            My <span className="text-crimson">Account</span>
          </h1>
          <p className="mt-1 text-sm text-dark-text-secondary">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="border border-dark-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-dark-text-secondary hover:border-crimson hover:text-crimson transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <nav className="space-y-1 lg:col-span-1">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/account?tab=${t.key}`}
              className={`block border-l-2 px-3 py-2.5 text-sm font-bold transition-colors ${
                tab === t.key
                  ? "border-crimson bg-crimson/10 text-crimson"
                  : "border-transparent text-dark-text-secondary hover:text-crimson"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="lg:col-span-3">
          {tab === "orders" && (
            <>
              <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Order History</h2>
              {ordersLoading ? (
                <p className="text-sm text-dark-text-secondary">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="border border-dark-border p-8 text-center">
                  <p className="font-heading text-lg font-bold text-dark-text-secondary">No orders yet</p>
                  <p className="mt-2 text-sm text-dark-text-secondary">Start shopping to see your orders here.</p>
                  <Link href="/" className="btn-primary mt-6 inline-block hover:bg-transparent hover:text-crimson transition-colors">Browse Products</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link key={order.order_number} href={`/track-order?order=${order.order_number}`} className="flex flex-wrap items-center justify-between gap-3 border border-dark-border p-4 transition-colors hover:border-crimson">
                      <div>
                        <p className="text-sm font-bold text-crimson">{order.order_number}</p>
                        <p className="text-xs text-dark-text-secondary">{order.date} &middot; {order.items_count} item{order.items_count !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold">${order.total?.toFixed(2)}</span>
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "address" && (
            <>
              <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Saved Address</h2>
              {addressLoading ? (
                <p className="text-sm text-dark-text-secondary">Loading address...</p>
              ) : (
                <div className="space-y-4 max-w-lg">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <input type="text" name="full_name" placeholder="Full Name" value={address.full_name} onChange={handleAddressChange} className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <input type="tel" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleAddressChange} className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <input type="text" name="street" placeholder="Street Address" value={address.street} onChange={handleAddressChange} className="input-field" />
                    </div>
                    <div>
                      <input type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className="input-field" />
                    </div>
                    <div>
                      <input type="text" name="state" placeholder="State / Province" value={address.state} onChange={handleAddressChange} className="input-field" />
                    </div>
                    <div>
                      <input type="text" name="zip" placeholder="ZIP / Postal Code" value={address.zip} onChange={handleAddressChange} className="input-field" />
                    </div>
                    <div>
                      <select name="country" value={address.country} onChange={handleAddressChange} className="input-field">
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-white dark:bg-[#1a1a2e] text-black dark:text-white">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {addressMsg && (
                    <p className={`text-sm font-medium ${addressMsg.includes("successfully") ? "text-green-500" : "text-crimson"}`}>{addressMsg}</p>
                  )}
                  <button
                    onClick={saveAddress}
                    disabled={addressSaving}
                    className="btn-primary hover:bg-transparent hover:text-crimson transition-colors disabled:opacity-50"
                  >
                    {addressSaving ? "Saving..." : "Save Address"}
                  </button>
                  <p className="text-xs text-dark-text-secondary">Your saved address will auto-fill during checkout.</p>
                </div>
              )}
            </>
          )}

          {tab === "settings" && (
            <>
              <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Account Settings</h2>
              <div className="space-y-6 max-w-lg">
                <div className="border border-dark-border p-5">
                  <h3 className="font-heading text-sm font-bold mb-2">Delete Account</h3>
                  <p className="text-xs text-dark-text-secondary mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  {!deleteConfirm ? (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="border border-red-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete My Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-crimson">Are you sure? This will permanently delete your account, order history and saved data.</p>
                      {deleteError && <p className="text-sm font-medium text-crimson">{deleteError}</p>}
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="border border-red-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {deletingAccount ? "Deleting..." : "Yes, Delete My Account"}
                        </button>
                        <button
                          onClick={() => { setDeleteConfirm(false); setDeleteError(""); }}
                          disabled={deletingAccount}
                          className="border border-dark-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-dark-text-secondary hover:border-crimson hover:text-crimson transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-orange-500",
    confirmed: "bg-blue-500",
    processing: "bg-yellow-500 text-black",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
}
