import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("id, email, role")
      .eq("email", email)
      .eq("password_hash", passwordHash)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = Buffer.from(
      JSON.stringify({ email: data.email, role: data.role, ts: Date.now() })
    ).toString("base64");

    return NextResponse.json({ id: data.id, email: data.email, role: data.role, token });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
