import { NextResponse } from "next/server";
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifySuperAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("admins")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ message: "Admin deleted" });
}
