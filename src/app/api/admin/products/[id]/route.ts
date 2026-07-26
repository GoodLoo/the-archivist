import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, product_images(url, is_primary, id, sort_order), categories!inner(name, slug)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name: body.name,
        slug: body.slug,
        price: body.price,
        original_price: body.original_price || null,
        description: body.description || "",
        category_id: body.category_id,
        in_stock: body.in_stock ?? true,
        stock_quantity: body.stock_quantity ?? 0,
        material: body.material || null,
        scale: body.scale || null,
        edition: body.edition || null,
        weight: body.weight || null,
        height: body.height || null,
        features: body.features || [],
        source_link: body.source_link || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await supabaseAdmin.from("product_images").delete().eq("product_id", id);
    await supabaseAdmin.from("cart_items").delete().eq("product_id", id);
    await supabaseAdmin.from("wishlist_items").delete().eq("product_id", id);
    await supabaseAdmin.from("order_items").delete().eq("product_id", id);
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
