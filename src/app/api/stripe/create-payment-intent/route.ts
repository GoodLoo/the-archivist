import { NextResponse } from "next/server";
import Stripe from "stripe";
import { loadSettings, parseTaxRate, parseFreeShippingThreshold, parseShippingCost } from "@/lib/settings";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { items, customer, email, phone, street, city, state, zip, country, discount } = body;

    if (!items?.length || !customer || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const afterDiscount = subtotal - (discount || 0);
    const settings = await loadSettings();
    const freeThreshold = parseFreeShippingThreshold(settings.freeShippingThreshold);
    const shipping = afterDiscount > freeThreshold ? 0 : parseShippingCost(settings.shippingCost);
    const tax = afterDiscount * parseTaxRate(settings.taxRate);
    const total = Math.round((afterDiscount + shipping + tax) * 100);

    const address = `${street}, ${city}, ${state} ${zip}, ${country}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      description: `Order for ${customer}`,
      shipping: {
        name: customer,
        phone,
        address: {
          line1: street || "",
          city: city || "",
          state: state || "",
          postal_code: zip || "",
          country: country || "US",
        },
      },
      metadata: {
        customer_email: email,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
