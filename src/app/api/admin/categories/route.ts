import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*, products!left(count)")
      .order("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const categories = (data || []).map((cat: any) => ({
      ...cat,
      product_count: cat.products?.[0]?.count ?? 0,
    }));

    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const maxId = await supabaseAdmin
      .from("categories")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    const nextId = String(maxId.data && maxId.data.length > 0
      ? String(Number(maxId.data[0].id) + 1).padStart(2, "0")
      : "01");

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({
        id: nextId,
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        image: body.image || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ category: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
