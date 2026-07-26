import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await supabaseAdmin.from("customer_profiles").delete().eq("id", id);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ message: "Customer deleted" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
