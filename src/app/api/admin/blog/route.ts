import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("per_page") || "20")));
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { count: total, error: countErr } = await supabaseAdmin
      .from("blog_posts")
      .select("id", { count: "exact", head: true });

    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }

    const { data: posts, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({
      posts,
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
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        author: body.author || "Admin",
        category: body.category || "News",
        excerpt: body.excerpt || "",
        content: body.content || "",
        image: body.image || null,
        featured: body.featured ?? false,
        date: new Date().toISOString().slice(0, 10),
      })
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
