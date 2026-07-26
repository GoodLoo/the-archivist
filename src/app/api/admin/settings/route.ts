import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SETTINGS_FILE = "store/settings.json";

const defaultSettings = {
  storeName: "The Archivist",
  storeEmail: "contact@archivist.com",
  storePhone: "+1 (555) 123-4567",
  storeAddress: "123 Collector Ave, Suite 100, New York, NY 10001",
  currency: "USD",
  taxRate: "8.875",
  freeShippingThreshold: "100",
  whatsappPhone: "+1234567890",
  facebook: "https://facebook.com/archivist",
  twitter: "https://twitter.com/archivist",
  instagram: "https://instagram.com/archivist",
};

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.find((b) => b.name === "store")) {
    await supabaseAdmin.storage.createBucket("store", { public: false });
  }
}

export async function GET() {
  try {
    await ensureBucket();

    const { data, error } = await supabaseAdmin.storage
      .from("store")
      .download(SETTINGS_FILE);

    if (error || !data) {
      await supabaseAdmin.storage
        .from("store")
        .upload(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), {
          contentType: "application/json",
          upsert: true,
        });
      return NextResponse.json(defaultSettings);
    }

    const text = await data.text();
    return NextResponse.json({ ...defaultSettings, ...JSON.parse(text) });
  } catch (err: any) {
    return NextResponse.json(defaultSettings);
  }
}

export async function PUT(request: Request) {
  try {
    await ensureBucket();
    const body = await request.json();

    await supabaseAdmin.storage
      .from("store")
      .upload(SETTINGS_FILE, JSON.stringify({ ...defaultSettings, ...body }, null, 2), {
        contentType: "application/json",
        upsert: true,
      });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Save failed" }, { status: 500 });
  }
}
