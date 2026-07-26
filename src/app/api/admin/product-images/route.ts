import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const { productId, imageId } = await request.json();

    if (!productId || !imageId) {
      return NextResponse.json({ error: "Missing productId or imageId" }, { status: 400 });
    }

    await supabaseAdmin
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    const { error } = await supabaseAdmin
      .from("product_images")
      .update({ is_primary: true, sort_order: 0 })
      .eq("id", imageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update image" }, { status: 500 });
  }
}
