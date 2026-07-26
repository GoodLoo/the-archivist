import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(1000, Math.max(1, parseInt(searchParams.get("per_page") || "50")));
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { count: total, error: countErr } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true });

    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }

    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*, product_images(url, is_primary)")
      .order("category_id")
      .order("name")
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({
      products,
      total: total || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((total || 0) / perPage),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
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
