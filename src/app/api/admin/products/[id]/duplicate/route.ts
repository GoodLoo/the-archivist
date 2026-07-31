import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newName = `${product.name} Copy`;
    const baseSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");
    let newSlug = `${baseSlug}-copy`;

    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("slug")
      .ilike("slug", `${newSlug}%`);

    if (existing && existing.length > 0) {
      newSlug = `${baseSlug}-copy-${existing.length + 1}`;
    }

    const { data: newProduct, error: insertErr } = await supabaseAdmin
      .from("products")
      .insert({
        name: newName,
        slug: newSlug,
        price: product.price,
        original_price: product.original_price,
        description: product.description,
        category_id: product.category_id,
        in_stock: product.in_stock,
        stock_quantity: product.stock_quantity,
        material: product.material,
        scale: product.scale,
        edition: product.edition,
        weight: product.weight,
        height: product.height,
        features: product.features || [],
        source_link: product.source_link,
        is_featured: false,
      })
      .select()
      .single();

    if (insertErr || !newProduct) {
      return NextResponse.json({ error: insertErr?.message || "Failed to duplicate product" }, { status: 500 });
    }

    const { data: images, error: imgFetchErr } = await supabaseAdmin
      .from("product_images")
      .select("url, is_primary, sort_order")
      .eq("product_id", id);

    if (imgFetchErr) {
      return NextResponse.json({ error: imgFetchErr.message }, { status: 500 });
    }

    if (images && images.length > 0) {
      const { error: imgInsertErr } = await supabaseAdmin.from("product_images").insert(
        images.map((img) => ({
          product_id: newProduct.id,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))
      );
      if (imgInsertErr) {
        return NextResponse.json({ error: imgInsertErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
