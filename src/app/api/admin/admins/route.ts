import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

function verifySuperAdmin(req: Request): { email: string; role: string } | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = JSON.parse(Buffer.from(auth.slice(7), "base64").toString());
    if (payload.role !== "super_admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const admin = verifySuperAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ admins: data });
}

export async function POST(req: Request) {
  const admin = verifySuperAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password, role } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    const id = crypto.randomUUID();
    const newRole = role === "admin" ? "admin" : "admin";

    const { data, error } = await supabaseAdmin
      .from("admins")
      .insert({ id, email, password_hash: passwordHash, role: newRole })
      .select("id, email, role, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ admin: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
