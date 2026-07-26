import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const { count } = await supabaseAdmin
      .from("admins")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      return NextResponse.json(
        { error: "An admin already exists. A super admin must create new accounts." },
        { status: 403 }
      );
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    const id = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from("admins")
      .insert({ id, email, password_hash: passwordHash, role: "super_admin" })
      .select("id, email, role")
      .single();

    if (error) throw error;

    return NextResponse.json({ admin: data, message: "Super admin created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
