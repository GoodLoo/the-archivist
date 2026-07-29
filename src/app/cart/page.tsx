"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import SeoHead from "@/components/SeoHead";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, loaded } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState("");
  const [applying, setApplying] = useState(false);
  const [taxRate, setTaxRate] = useState(0.08);
  const [freeThreshold, setFreeThreshold] = useState(500);
  const [shippingCost, setShippingCost] = useState(15.99);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.taxRate) setTaxRate(parseFloat(s.taxRate) / 100);
        if (s.freeShippingThreshold) setFreeThreshold(parseFloat(s.freeShippingThreshold));
        if (s.shippingCost) setShippingCost(parseFloat(s.shippingCost));
      })
      .catch(() => {});
  }, []);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-screen-2xl py-8 animate-pulse">
        <div className="mb-6 h-8 w-48 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 border border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 p-4">
                <div className="h-24 w-24 shrink-0 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                  <div className="h-4 w-1/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                  <div className="h-8 w-24 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="border border-dark-border/30 p-5 space-y-4">
              <div className="h-5 w-32 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-10 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const shipping = subtotal > freeThreshold ? 0 : shippingCost;
  const tax = subtotal * taxRate;
  const totalAfterDiscount = subtotal - discount;
  const total = totalAfterDiscount + shipping + tax;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponError(data.error || "Invalid coupon");
        setDiscount(0);
        setCouponApplied("");
      } else {
        setDiscount(data.discount);
        setCouponApplied(couponCode.trim().toUpperCase());
        setCouponCode("");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied("");
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-screen-2xl py-20">
        <SeoHead title="Your Cart | The Archivist" description="Your cart is empty. Browse our premium figurine collection and add your favorites." />
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-dark-border dark:border-dark-border border-light-border">
            <svg className="h-10 w-10 text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Looks like you haven&apos;t added any figurines to your vault yet.
          </p>
          <Link
            href="/categories"
            className="btn-primary mt-8 inline-flex hover:bg-transparent hover:text-crimson transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead title="Your Cart | The Archivist" description={`${items.length} item${items.length !== 1 ? "s" : ""} in your cart — review your order before checkout.`} />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Your <span className="text-crimson">Cart</span>
          <span className="ml-2 text-sm font-normal text-dark-text-secondary">
            ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:text-crimson transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border border-dark-border dark:border-dark-border border-light-border p-3 sm:p-4"
            >
              <Link
                href={`/categories`}
                className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-gray-100"
              >
                  <Image src={item.image} alt={`${item.name} — cart item`} fill sizes="(max-width: 640px) 80px, 96px" className="object-cover" />
              </Link>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="pr-1">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-dark-text dark:text-dark-text text-light-text truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-crimson font-bold mt-0.5">
                    ${item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center border border-dark-border dark:border-dark-border border-light-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-sm transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100"
                    >
                      &minus;
                    </button>
                    <span className="flex h-7 w-9 sm:h-8 sm:w-10 items-center justify-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-sm transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-heading text-sm sm:text-base font-bold text-crimson sm:hidden">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-xs font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:text-crimson transition-colors"
                      title="Remove item"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end justify-between shrink-0">
                <p className="font-heading text-base font-bold text-crimson">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="border border-dark-border dark:border-dark-border border-light-border p-5">
            <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              {couponApplied ? (
                <div className="flex items-center justify-between rounded bg-green-500/10 px-3 py-2 text-xs">
                  <span className="text-green-500 font-medium">{couponApplied}</span>
                  <span className="text-green-500">-${discount.toFixed(2)}</span>
                  <button onClick={removeCoupon} className="text-dark-text-secondary hover:text-crimson ml-2">&times;</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                    placeholder="Coupon code"
                    className="input-field flex-1 text-xs"
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                  <button onClick={applyCoupon} disabled={applying || !couponCode.trim()} className="btn-outline text-xs px-3 py-1.5 disabled:opacity-50 hover:bg-dark-text hover:text-dark-bg transition-colors">
                    {applying ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-crimson">{couponError}</p>}

              <div className="flex justify-between text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                  Free shipping on orders over ${freeThreshold.toFixed(2)}
                </p>
              )}
              <div className="flex justify-between text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                <span>Tax ({(taxRate * 100).toFixed(1)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 pt-3 font-heading text-base font-bold text-dark-text dark:text-dark-text text-light-text">
                <span>Total</span>
                <span className="text-crimson">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => {
                if (couponApplied) {
                  sessionStorage.setItem("checkoutCoupon", JSON.stringify({
                    code: couponApplied,
                    discount: discount,
                    subtotal: subtotal,
                  }));
                } else {
                  sessionStorage.removeItem("checkoutCoupon");
                }
              }}
              className="btn-primary mt-6 w-full flex items-center justify-center hover:bg-transparent hover:text-crimson transition-colors uppercase"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/categories"
              className="btn-outline mt-3 w-full flex items-center justify-center text-xs hover:bg-dark-text hover:text-dark-bg dark:hover:bg-dark-text dark:hover:text-dark-bg hover:bg-gray-900 hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
