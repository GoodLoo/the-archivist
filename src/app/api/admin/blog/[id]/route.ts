import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ post: data });
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

    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.author !== undefined) updates.author = body.author;
    if (body.category !== undefined) updates.category = body.category;
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
    if (body.content !== undefined) updates.content = body.content;
    if (body.image !== undefined) updates.image = body.image;
    if (body.featured !== undefined) updates.featured = body.featured;

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ post: data });
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
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ message: "Blog post deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
