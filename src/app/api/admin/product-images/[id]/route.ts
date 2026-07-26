import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params;

    const { data: img } = await supabaseAdmin
      .from("product_images")
      .select("url")
      .eq("id", imageId)
      .single();

    const { error } = await supabaseAdmin
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (img?.url) {
      const pathMatch = img.url.match(/product-images\/(.+)$/);
      if (pathMatch) {
        await supabaseAdmin.storage
          .from("product-images")
          .remove([pathMatch[1]]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete image" }, { status: 500 });
  }
}
