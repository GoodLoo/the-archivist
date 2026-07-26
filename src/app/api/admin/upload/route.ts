import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const isPrimary = formData.get("isPrimary") === "true";

    if (!file || !productId) {
      return NextResponse.json({ error: "Missing file or productId" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const url = publicUrlData.publicUrl;

    if (isPrimary) {
      await supabaseAdmin
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    const { error: insertErr } = await supabaseAdmin
      .from("product_images")
      .insert({
        product_id: productId,
        url,
        is_primary: isPrimary,
        sort_order: isPrimary ? 0 : 1,
      });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
