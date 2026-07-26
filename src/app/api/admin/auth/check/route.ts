import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from("admins")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return NextResponse.json({ hasAdmins: (count ?? 0) > 0 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
