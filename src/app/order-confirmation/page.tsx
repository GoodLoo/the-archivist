"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lastOrder");
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  if (!orderNumber && !order) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          No order <span className="text-crimson">found</span>
        </h1>
        <p className="mt-4 text-sm text-dark-text-secondary">This page requires a valid order number.</p>
        <Link href="/" className="btn-primary mt-8 inline-block hover:bg-transparent hover:text-crimson transition-colors">
          Back to Store
        </Link>
      </div>
    );
  }

  const displayOrder = order || { orderNumber };

  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-2 border-green-500">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Order <span className="text-crimson">Confirmed</span>
        </h1>
        <p className="mt-3 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Thank you for your purchase! Your order has been placed and is pending confirmation.
        </p>

        <div className="mt-8 border border-dark-border dark:border-dark-border border-light-border p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary">Order Number</p>
          <p className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-crimson">
            {displayOrder.orderNumber}
          </p>
        </div>
      </div>

      {displayOrder.items && (
        <div className="mt-8 border border-dark-border dark:border-dark-border border-light-border p-6">
          <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Order Summary</h2>
          <div className="space-y-3">
            {displayOrder.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between border-b border-dark-border/30 pb-2 text-sm">
                <span>{item.name} &times; {item.quantity}</span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-dark-text-secondary"><span>Subtotal</span><span>${displayOrder.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between text-dark-text-secondary"><span>Shipping</span><span>{displayOrder.shipping === 0 ? <span className="text-green-500">Free</span> : `$${displayOrder.shipping?.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-dark-text-secondary"><span>Tax</span><span>${displayOrder.tax?.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-dark-border/50 pt-2 font-heading text-base font-bold"><span>Total</span><span className="text-crimson">${displayOrder.total?.toFixed(2)}</span></div>
          </div>
        </div>
      )}

      {displayOrder.address && (
        <div className="mt-6 border border-dark-border dark:border-dark-border border-light-border p-6">
          <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Shipping To</h2>
          <p className="text-sm text-dark-text-secondary">{displayOrder.customer}</p>
          <p className="text-sm text-dark-text-secondary">{displayOrder.address}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/track-order" className="btn-primary hover:bg-transparent hover:text-crimson transition-colors">
          Track Your Order
        </Link>
        <Link href="/account" className="border border-crimson px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-crimson hover:bg-crimson hover:text-white transition-colors">
          My Orders
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-dark-text-secondary">
        A confirmation has been sent. You can also track this order using the order number above.
      </p>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-5 py-20 text-center"><p className="text-dark-text-secondary">Loading...</p></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
