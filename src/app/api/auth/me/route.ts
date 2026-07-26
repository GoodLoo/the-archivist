import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!authHeader) {
    return NextResponse.json({ user: null });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.getUser(authHeader);
  if (error || !data.user) {
    return NextResponse.json({ user: null });
  }

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
    },
    profile,
  });
}
