"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { supabase } from "@/lib/supabase";
import { jsPDF } from "jspdf";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import SeoHead from "@/components/SeoHead";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const SHIPPING_COST = 15.99;
const TAX_RATE = 0.08;

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

function StripePaymentSection({
  clientSecret,
  onPaymentSuccess,
  submitting,
  setSubmitting,
  setSubmitError,
}: {
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  setSubmitError: (v: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [pmError, setPmError] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setPmError("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setPmError(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaymentSuccess(paymentIntent.id);
    } else {
      setPmError("Payment was not successful. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-dark-border/50 pt-4">
      <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-crimson">Card Payment</h3>
      <PaymentElement />
      {pmError && <p className="mt-2 text-xs font-medium text-crimson">{pmError}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || submitting}
        className="btn-primary mt-4 w-full hover:bg-transparent hover:text-crimson transition-colors disabled:opacity-50"
      >
        {submitting ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, clearCart, loaded: cartLoaded } = useCart();
  const { user } = useCustomerAuth();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutCoupon");
    if (stored) {
      try {
        const c = JSON.parse(stored);
        setCouponCode(c.code || "");
        setCouponDiscount(c.discount || 0);
      } catch {}
    }
  }, []);

  const shipping = subtotal > 500 ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const afterDiscount = subtotal - couponDiscount;
  const total = afterDiscount + shipping + tax;

  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeMode, setStripeMode] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setForm((f) => ({ ...f, email: user.email || "" }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const last = sessionStorage.getItem("lastAddress");
    if (last) {
      try {
        const addr = JSON.parse(last);
        setForm((f) => ({ ...f, ...addr }));
        return;
      } catch {}
    }
    (async () => {
      try {
        const sess = await supabase.auth.getSession();
        const tok = sess.data.session?.access_token;
        if (!tok) return;
        const res = await fetch("/api/account/address", {
          headers: { "x-auth-token": tok },
        });
        const data = await res.json();
        if (data.address) {
          setForm((f) => ({
            ...f,
            fullName: data.address.full_name || f.fullName,
            phone: data.address.phone || f.phone,
            street: data.address.street || f.street,
            city: data.address.city || f.city,
            state: data.address.state || f.state,
            zip: data.address.zip || f.zip,
            country: data.address.country || f.country,
          }));
        }
      } catch {}
    })();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.street.trim()) errs.street = "Street address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.zip.trim()) errs.zip = "ZIP / Postal code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generatePDF = (orderData: any) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(220, 20, 60);
    doc.text("THE ARCHIVIST", pageW / 2, y, { align: "center" });
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Figurines & Collectibles", pageW / 2, y, { align: "center" });
    y += 12;

    doc.setDrawColor(220, 20, 60);
    doc.setLineWidth(0.5);
    doc.line(15, y, pageW - 15, y);
    y += 10;

    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER CONFIRMATION", pageW / 2, y, { align: "center" });
    y += 12;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Order Number:`, 15, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(220, 20, 60);
    doc.text(orderData.orderNumber, 65, y);
    y += 8;
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`Date:`, 15, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(orderData.date || new Date().toLocaleDateString(), 35, y);
    y += 14;

    doc.setDrawColor(200);
    doc.line(15, y, pageW - 15, y);
    y += 8;

    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Customer Details", 15, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Name: ${orderData.customer}`, 20, y); y += 6;
    doc.text(`Email: ${orderData.email}`, 20, y); y += 6;
    doc.text(`Phone: ${orderData.phone || "—"}`, 20, y); y += 6;
    doc.text(`Address: ${orderData.address}`, 20, y); y += 10;

    doc.setDrawColor(200);
    doc.line(15, y, pageW - 15, y);
    y += 8;

    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Order Items", 15, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text("Item", 20, y);
    doc.text("Qty", 130, y);
    doc.text("Price", 150, y);
    doc.text("Total", 180, y);
    y += 5;
    doc.setDrawColor(200);
    doc.line(15, y, pageW - 15, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40);
    for (const item of orderData.items || []) {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(item.name, 20, y);
      doc.text(`${item.quantity}`, 130, y);
      doc.text(`$${item.price.toFixed(2)}`, 150, y);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, y);
      y += 6;
    }

    y += 4;
    doc.setDrawColor(200);
    doc.line(15, y, pageW - 15, y);
    y += 6;

    doc.setTextColor(80);
    doc.setFontSize(10);
    doc.text(`Subtotal:`, 140, y);
    doc.setFont("helvetica", "bold");
    doc.text(`$${orderData.subtotal.toFixed(2)}`, 180, y, { align: "right" });
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Shipping:`, 140, y);
    doc.setFont("helvetica", "bold");
    doc.text(orderData.shipping === 0 ? "Free" : `$${orderData.shipping.toFixed(2)}`, 180, y, { align: "right" });
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Tax:`, 140, y);
    doc.setFont("helvetica", "bold");
    doc.text(`$${orderData.tax.toFixed(2)}`, 180, y, { align: "right" });
    y += 6;
    doc.setDrawColor(220, 20, 60);
    doc.setLineWidth(0.5);
    doc.line(130, y, 195, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(220, 20, 60);
    doc.text("Total:", 140, y);
    doc.text(`$${orderData.total.toFixed(2)}`, 180, y, { align: "right" });

    y += 20;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setDrawColor(200);
    doc.line(15, y, pageW - 15, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for your order at The Archivist.", pageW / 2, y, { align: "center" });
    y += 4;
    doc.text("This is an automated order confirmation.", pageW / 2, y, { align: "center" });

    doc.save(`TheArchivist_Order_${orderData.orderNumber}.pdf`);
  };

  const placeOrder = async (paymentIntentId?: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        customer: form.fullName,
        email: form.email,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
        notes: form.notes,
        userId: user?.id || null,
        paymentIntentId: paymentIntentId || null,
        paymentStatus: paymentIntentId ? "paid" : "pending",
        couponCode: couponCode || null,
        discountAmount: couponDiscount || 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to place order");
    return data;
  };

  const createPaymentIntent = async () => {
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        customer: form.fullName,
        email: form.email,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
        discount: couponDiscount || 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to initialize payment");
    return data.clientSecret;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      setSubmitError("Your cart is empty");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    if (stripePromise) {
      try {
        const secret = await createPaymentIntent();
        setClientSecret(secret);
        setStripeMode(true);
        setSubmitting(false);
      } catch (err: any) {
        setSubmitError(err.message || "Failed to initialize payment");
        setSubmitting(false);
      }
      return;
    }

    try {
      const data = await placeOrder();
      const address = `${form.street}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
      const orderData = { ...data, address, phone: form.phone };
      sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
      sessionStorage.setItem("lastAddress", JSON.stringify({
        street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country, phone: form.phone,
      }));
      generatePDF(orderData);
      clearCart();
      router.push(`/order-confirmation?order=${data.orderNumber}`);
    } catch (err: any) {
      setSubmitError(err.message || "Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const onPaymentSuccess = async (paymentIntentId: string) => {
    try {
      const data = await placeOrder(paymentIntentId);
      const address = `${form.street}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
      const orderData = { ...data, address, phone: form.phone };
      sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
      sessionStorage.setItem("lastAddress", JSON.stringify({
        street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country, phone: form.phone,
      }));
      generatePDF(orderData);
      clearCart();
      router.push(`/order-confirmation?order=${data.orderNumber}`);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to place order after payment");
      setSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      setSubmitError("Your cart is empty");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    try {
      const data = await placeOrder();
      const address = `${form.street}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
      const orderData = { ...data, address, phone: form.phone };
      sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
      sessionStorage.setItem("lastAddress", JSON.stringify({
        street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country, phone: form.phone,
      }));

      generatePDF(orderData);

      const waRes = await fetch("/api/order/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: data.orderNumber,
          customerName: form.fullName,
          customerPhone: form.phone,
          email: form.email,
          address,
          items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
          subtotal: data.subtotal,
          shipping: data.shipping,
          tax: data.tax,
          total: data.total,
        }),
      });
      const waData = await waRes.json();
      if (waData.waLink) window.open(waData.waLink, "_blank");

      clearCart();
      router.push(`/order-confirmation?order=${data.orderNumber}`);
    } catch (err: any) {
      setSubmitError(err.message || "Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (!cartLoaded) {
    return (
      <div className="mx-auto max-w-screen-2xl py-8 animate-pulse">
        <SeoHead title="Checkout | The Archivist" />
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="h-8 w-64 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="h-4 w-96 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-6 w-32 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-10 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <SeoHead title="Checkout | The Archivist" description="Your cart is empty. Add premium figurines before checking out." />
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Your <span className="text-crimson">Cart</span> is Empty</h1>
        <p className="mt-4 text-sm text-dark-text-secondary">Add some items before checking out.</p>
        <Link href="/" className="btn-primary mt-8 inline-block hover:bg-transparent hover:text-crimson transition-colors">Back to Store</Link>
      </div>
    );
  }

  const formContent = (
    <form onSubmit={handlePlaceOrder}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Contact Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <input type="text" name="fullName" placeholder="Full Name *" value={form.fullName} onChange={handleChange} className={`input-field ${errors.fullName ? "border-crimson" : ""}`} />
                  {errors.fullName && <p className="mt-1 text-[10px] font-medium text-crimson">{errors.fullName}</p>}
                </div>
                <div>
                  <input type="email" name="email" placeholder="Email Address *" value={form.email} onChange={handleChange} className={`input-field ${errors.email ? "border-crimson" : ""}`} />
                  {errors.email && <p className="mt-1 text-[10px] font-medium text-crimson">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input type="tel" name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} className={`input-field ${errors.phone ? "border-crimson" : ""}`} />
                  {errors.phone && <p className="mt-1 text-[10px] font-medium text-crimson">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 pt-6">
              <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">Delivery Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input type="text" name="street" placeholder="Street Address *" value={form.street} onChange={handleChange} className={`input-field ${errors.street ? "border-crimson" : ""}`} />
                  {errors.street && <p className="mt-1 text-[10px] font-medium text-crimson">{errors.street}</p>}
                </div>
                <div>
                  <input type="text" name="city" placeholder="City *" value={form.city} onChange={handleChange} className={`input-field ${errors.city ? "border-crimson" : ""}`} />
                  {errors.city && <p className="mt-1 text-[10px] font-medium text-crimson">{errors.city}</p>}
                </div>
                <div>
                  <input type="text" name="state" placeholder="State / Province" value={form.state} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <input type="text" name="zip" placeholder="ZIP / Postal Code *" value={form.zip} onChange={handleChange} className={`input-field ${errors.zip ? "border-crimson" : ""}`} />
                  {errors.zip && <p className="mt-1 text-[10px] font-medium text-crimson">{errors.zip}</p>}
                </div>
                <div>
                  <select name="country" value={form.country} onChange={handleChange} className="input-field">
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-[#1a1a2e] text-black dark:text-white">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 pt-6">
              <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-crimson">
                Order Notes <span className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary font-normal normal-case">(optional)</span>
              </h2>
              <textarea name="notes" placeholder="Special instructions or delivery notes..." value={form.notes} onChange={handleChange} rows={3} className="input-field resize-none" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 border border-dark-border dark:border-dark-border border-light-border p-6">
            <h2 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider">Order Summary</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-dark-border/30 dark:border-dark-border/30 border-light-border/30 pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-gray-100">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-dark-text dark:text-dark-text text-light-text">{item.name}</p>
                      <p className="text-xs text-dark-text-secondary">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-dark-border dark:border-dark-border border-light-border">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center text-xs transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100">&minus;</button>
                        <span className="flex h-6 w-8 items-center justify-center text-xs font-bold">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center text-xs transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100">+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="text-xs text-dark-text-secondary transition-colors hover:text-crimson">Remove</button>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between text-dark-text-secondary"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-500"><span>Discount ({couponCode})</span><span>-${couponDiscount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-dark-text-secondary"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-500">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
              {subtotal < 500 && <p className="text-[10px] text-dark-text-secondary">Free shipping on orders over $500</p>}
              <div className="flex justify-between text-dark-text-secondary"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-dark-border/50 pt-2 font-heading text-base font-bold"><span>Total</span><span className="text-crimson">${total.toFixed(2)}</span></div>
            </div>

            {submitError && (
              <p className="mt-3 text-sm font-medium text-crimson">{submitError}</p>
            )}

            {stripeMode && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentSection
                  clientSecret={clientSecret}
                  onPaymentSuccess={onPaymentSuccess}
                  submitting={submitting}
                  setSubmitting={setSubmitting}
                  setSubmitError={setSubmitError}
                />
              </Elements>
            ) : (
              <>
                <button type="submit" disabled={submitting || items.length === 0} className="btn-primary mt-6 w-full hover:bg-transparent hover:text-crimson transition-colors disabled:opacity-50">
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>

                <button type="button" onClick={handleWhatsAppOrder} disabled={submitting || items.length === 0} className="btn-outline mt-2 w-full hover:bg-dark-text hover:text-dark-bg dark:hover:bg-dark-text dark:hover:text-dark-bg hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50">
                  {submitting ? "Processing..." : "Place Order via WhatsApp"}
                </button>
              </>
            )}

            <p className="mt-3 text-center text-[10px] text-dark-text-secondary">
              By completing this order, you agree to our <Link href="/terms-of-service" className="underline hover:text-crimson">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-crimson">Privacy Policy</Link>.
              A PDF receipt will be downloaded automatically.
            </p>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead title="Checkout | The Archivist" description="Complete your order for premium figurines from The Archivist." />
      <Link href="/cart" className="mb-6 inline-block text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
        &larr; Back to Cart
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <Image src="/favicon.ico" alt="" width={32} height={32} className="h-8 w-8" />
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Check<span className="text-crimson">out</span>
        </h1>
      </div>

      {formContent}
    </div>
  );
}
