import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function getWhatsappPhone(): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("store")
      .download("store/settings.json");

    if (!error && data) {
      const text = await data.text();
      const settings = JSON.parse(text);
      if (settings.whatsappPhone) return settings.whatsappPhone;
    }
  } catch {}
  return process.env.STORE_WHATSAPP || "+1234567890";
}

export async function POST(req: Request) {
  try {
    const { orderNumber, customerName, customerPhone, items, total, email, address, subtotal, shipping, tax } = await req.json();

    if (!orderNumber || !customerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const itemsList = (items || [])
      .map((i: any) => `  • ${i.name} x${i.quantity} — $${((i.price || 0) * (i.quantity || 1)).toFixed(2)}`)
      .join("\n");

    const message = [
      `🛒 *New Order: ${orderNumber}*`,
      ``,
      `👤 *Customer:* ${customerName}`,
      `📧 *Email:* ${email || "—"}`,
      `📞 *Phone:* ${customerPhone || "—"}`,
      `📍 *Address:* ${address || "—"}`,
      ``,
      `*Items:*`,
      itemsList,
      ``,
      `💵 *Subtotal:* $${(subtotal || 0).toFixed(2)}`,
      `🚚 *Shipping:* ${shipping === 0 ? "Free" : `$${(shipping || 0).toFixed(2)}`}`,
      `💰 *Tax:* $${(tax || 0).toFixed(2)}`,
      `*Total:* $${(total || 0).toFixed(2)}`,
    ].join("\n");

    const STORE_PHONE = await getWhatsappPhone();
    const cleanPhone = STORE_PHONE.replace(/[^0-9]/g, "");
    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    try {
      const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
      const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

      if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID && customerPhone) {
        await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: customerPhone.replace(/[^0-9]/g, ""),
            type: "template",
            template: {
              name: "order_confirmation",
              language: { code: "en" },
              components: [{
                type: "body",
                parameters: [
                  { type: "text", text: customerName },
                  { type: "text", text: orderNumber },
                  { type: "text", text: `$${(total || 0).toFixed(2)}` },
                ],
              }],
            },
          }),
        });
      }
    } catch {
      // WhatsApp send failure is non-critical
    }

    return NextResponse.json({ success: true, waLink });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
