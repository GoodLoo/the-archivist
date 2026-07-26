"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  name: string;
  product_name?: string;
  quantity: number;
  price: number;
}

interface TimelineEvent {
  status: string;
  date: string;
  note: string;
}

interface Order {
  id: string;
  order_number: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  date: string;
  notes?: string;
  user_id?: string;
  timeline: TimelineEvent[];
}

const statusLabels = ["pending", "confirmed", "processing", "shipped", "delivered"];

const statusColors: Record<string, string> = {
  pending: "bg-orange-500",
  confirmed: "bg-blue-500",
  processing: "bg-yellow-500 text-black",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [deleting, setDeleting] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const addTimelineNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timelineNote: noteText.trim() }),
      });
      setNoteText("");
      loadOrder();
    } catch {
      alert("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    const res = await fetch(`/api/admin/orders/${orderId}`);
    const data = await res.json();
    if (data.order) {
      const o = data.order;
      o.items = o.order_items || [];
      o.timeline = o.order_timeline || [];
      setOrder(o);
      setStatus(o.status);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        timelineNote: newStatus === "confirmed" ? "Your order has been confirmed and is being processed." : `Order status updated to ${newStatus}.`,
      }),
    });
    loadOrder();
  };

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Order not found</p>
        <Link href="/admin/orders" className="text-sm text-crimson hover:underline mt-4 inline-block">&larr; Back to Orders</Link>
      </div>
    );
  }

  const currentStep = statusLabels.indexOf(status);
  const displayId = order.order_number || order.id;

  return (
    <div>
      <Link href="/admin/orders" className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:text-crimson transition-colors mb-4 inline-block">
        &larr; Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{displayId}</h1>
          <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">Placed on {order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={handleStatusChange}
            className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-dark-text dark:text-dark-text text-gray-900 outline-none focus:border-crimson cursor-pointer"
          >
            {statusLabels.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="cancelled">cancelled</option>
          </select>
          <span className={`inline-block px-3 py-2 text-xs font-bold uppercase tracking-wider text-white ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Order Items</h2>
            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={item.name || idx} className="flex items-center justify-between py-2 border-b border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dark-text dark:text-dark-text text-gray-900">{item.product_name || item.name}</p>
                    <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">&times; {item.quantity}</p>
                    <p className="text-sm font-bold text-crimson">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 space-y-1.5 text-sm">
              <div className="flex justify-between text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">
                <span>Subtotal</span><span>${(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">
                <span>Shipping</span><span>{order.shipping === 0 ? <span className="text-green-500">Free</span> : `$${(order.shipping || 0).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">
                <span>Tax</span><span>${(order.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-heading text-base font-bold text-dark-text dark:text-dark-text text-gray-900 pt-1.5 border-t border-dark-border/30 dark:border-dark-border/30 border-gray-200/30">
                <span>Total</span><span className="text-crimson">${(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Timeline</h2>
            <div className="space-y-4">
              {statusLabels.map((s, i) => {
                const timelineEvent = (order.timeline || []).find((t) => t.status === s);
                const isActive = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 border ${isActive ? "bg-crimson border-crimson" : "border-dark-border dark:border-dark-border border-gray-300"} ${isCurrent ? "ring-2 ring-crimson/30" : ""}`} />
                      {i < statusLabels.length - 1 && <div className={`w-px flex-1 ${isActive && s !== "delivered" ? "bg-crimson" : "bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200/30"}`} />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-bold capitalize ${isActive ? "text-dark-text dark:text-dark-text text-gray-900" : "text-dark-text-secondary dark:text-dark-text-secondary text-gray-500"}`}>{s}</p>
                      {timelineEvent && (
                        <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{timelineEvent.date} &mdash; {timelineEvent.note}</p>
                      )}
                      {!timelineEvent && isActive && (
                        <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 italic">Marked as {s}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-dark-text dark:text-dark-text text-gray-900">{order.customer}</p>
              <p className="text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{order.email}</p>
              <p className="text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{order.phone}</p>
            </div>
          </div>

          <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Shipping Address</h2>
            <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{order.address}</p>
          </div>

          <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Notes</h2>
            {order.notes && <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 mb-3">{order.notes}</p>}
            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="input-field flex-1 text-xs"
                onKeyDown={(e) => e.key === "Enter" && addTimelineNote()}
              />
              <button onClick={addTimelineNote} disabled={addingNote || !noteText.trim()} className="btn-primary text-xs px-4 py-2 disabled:opacity-50">
                {addingNote ? "..." : "Add"}
              </button>
            </div>
          </div>

          {order.user_id && (
            <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Account</h2>
              <p className="text-xs text-dark-text-secondary">Linked to customer account</p>
            </div>
          )}

          <button
            onClick={() => router.push("/admin/orders")}
            className="w-full border border-crimson py-2.5 text-sm font-bold uppercase tracking-wider text-crimson hover:bg-crimson hover:text-white transition-colors"
          >
            Back to Orders
          </button>

          <button
            onClick={async () => {
              if (!window.confirm(`Delete order ${displayId}? This cannot be undone.`)) return;
              setDeleting(true);
              try {
                const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Delete failed");
                router.push("/admin/orders");
              } catch {
                alert("Delete failed");
                setDeleting(false);
              }
            }}
            disabled={deleting}
            className="w-full border border-red-500 py-2.5 text-sm font-bold uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
