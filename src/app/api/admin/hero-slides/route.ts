import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SLIDES_FILE = "store/hero-slides.json";

const defaultSlides: { imageUrl: string; linkUrl: string }[] = [];

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
      .download(SLIDES_FILE);

    if (error || !data) {
      return NextResponse.json(defaultSlides);
    }

    const text = await data.text();
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json(defaultSlides);
  }
}

export async function PUT(request: Request) {
  try {
    await ensureBucket();
    const body = await request.json();

    await supabaseAdmin.storage
      .from("store")
      .upload(SLIDES_FILE, JSON.stringify(body, null, 2), {
        contentType: "application/json",
        upsert: true,
      });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Save failed" }, { status: 500 });
  }
}
