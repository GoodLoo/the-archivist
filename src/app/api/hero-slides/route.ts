import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SLIDES_FILE = "store/hero-slides.json";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("store")
      .download(SLIDES_FILE);

    if (error || !data) {
      return NextResponse.json([]);
    }

    const text = await data.text();
    const slides = JSON.parse(text);
    return NextResponse.json(Array.isArray(slides) ? slides : []);
  } catch {
    return NextResponse.json([]);
  }
}
