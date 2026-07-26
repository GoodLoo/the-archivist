"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { OrderStatus } from "@/types";
import TrackingStepper from "@/components/TrackingStepper";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";

const stepIndex: Record<string, number> = {
  ordered: 0,
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  "out-for-delivery": 3,
  delivered: 4,
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order");
  const { user } = useCustomerAuth();

  const [orderNumber, setOrderNumber] = useState(initialOrder || "");
  const [searched, setSearched] = useState(!!initialOrder);
  const [loading, setLoading] = useState(!!initialOrder);
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("order_number, date, status, total")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentOrders(data);
      });
  }, [user]);

  useEffect(() => {
    if (initialOrder) {
      lookupOrder(initialOrder);
    }
  }, [initialOrder]);

  const lookupOrder = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    const { data, error: err } = await supabase
      .from("orders")
      .select("*, order_items(*), order_timeline(*)")
      .eq("order_number", num)
      .single();

    if (err || !data) {
      setError("Order not found. Please check your order number and try again.");
    } else {
      const estimated = new Date(data.created_at || data.date);
      estimated.setDate(estimated.getDate() + 7);

      setOrder({
        orderNumber: data.order_number,
        status: data.status,
        currentStep: stepIndex[data.status] ?? 0,
        estimatedDelivery: estimated.toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        }),
        items: (data.order_items || []).map((item: any) => ({
          name: item.product_name || item.name,
          quantity: item.quantity,
        })),
        timeline: (data.order_timeline || []).map((event: any) => ({
          label: event.label,
          date: event.date,
          completed: event.completed,
        })),
      });
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(orderNumber);
  };

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead title="Track Your Order | The Archivist" description="Enter your order number to track your premium figurine order status and estimated delivery date." />
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Track Your <span className="text-crimson">Order</span>
          </h1>
          <p className="mt-2 text-sm text-dark-text-secondary">
            Enter your order number to see the current status and estimated delivery date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mb-8 flex max-w-md gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Order number (e.g., TA-2026-12345)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary hover:bg-transparent hover:text-crimson transition-colors shrink-0">
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {user && recentOrders.length > 0 && !searched && (
          <div className="mb-8">
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Your Recent Orders</h2>
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <button
                  key={o.order_number}
                  onClick={() => { setOrderNumber(o.order_number); lookupOrder(o.order_number); }}
                  className="flex w-full items-center justify-between border border-dark-border p-3 text-left transition-colors hover:border-crimson"
                >
                  <span className="text-sm font-bold text-crimson">{o.order_number}</span>
                  <span className="text-xs text-dark-text-secondary">{o.date}</span>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${statusColor(o.status)}`}>
                    {o.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {searched && order && (
          <div className="mt-8">
            <TrackingStepper order={order} />
          </div>
        )}

        {searched && error && (
          <div className="mt-8 border border-dark-border p-6 text-center">
            <p className="font-heading text-lg font-bold text-crimson">Order Not Found</p>
            <p className="mt-2 text-sm text-dark-text-secondary">{error}</p>
          </div>
        )}

        {!searched && (
          <div className="mt-12 border border-dark-border p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-dark-border">
              <svg className="h-8 w-8 text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <p className="font-heading text-lg font-bold text-dark-text-secondary">Enter your order number above</p>
            <p className="mt-2 text-sm text-dark-text-secondary">Your order number was sent to your email after purchase.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-orange-500", confirmed: "bg-blue-500", processing: "bg-yellow-500 text-black",
    shipped: "bg-purple-500", delivered: "bg-green-500", cancelled: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-5 py-20 text-center"><SeoHead title="Track Order | The Archivist" /><p className="text-dark-text-secondary">Loading...</p></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
