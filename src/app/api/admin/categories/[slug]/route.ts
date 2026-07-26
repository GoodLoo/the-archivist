import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.image !== undefined) updates.image = body.image;

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(updates)
      .eq("slug", slug)
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", slug);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${count} product(s). Remove or reassign products first.` },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("categories").delete().eq("slug", slug);
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
