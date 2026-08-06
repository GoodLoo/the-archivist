import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSuffix(length: number) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

function normalizePrefix(prefix: string) {
  return prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const codes = data || [];
    const now = Date.now();
    let active = 0;
    let redeemed = 0;
    for (const c of codes) {
      const expired = c.expires_at && new Date(c.expires_at).getTime() < now;
      if (c.is_active && !expired) active++;
      redeemed += c.used_count;
    }

    return NextResponse.json({
      codes,
      stats: {
        total: codes.length,
        active,
        redeemed,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prefix = normalizePrefix(body.prefix || "ARCHIV");
    const count = Math.min(Math.max(parseInt(body.count) || 1, 1), 200);
    const type = body.type === "fixed" ? "fixed" : "percentage";
    const value = parseFloat(body.value);
    const maxUses = Math.max(parseInt(body.maxUses) || 1, 0);
    const expiryDays = parseInt(body.expiryDays);
    const batchLabel = body.batchLabel?.trim() || null;

    if (!value || isNaN(value) || value <= 0) {
      return NextResponse.json({ error: "Discount value must be greater than 0" }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = expiryDays && !isNaN(expiryDays) && expiryDays > 0
      ? new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const rows = [];
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
      let code = "";
      do {
        code = prefix ? `${prefix}-${randomSuffix(6)}` : randomSuffix(6);
      } while (seen.has(code));
      seen.add(code);
      rows.push({
        code,
        type,
        value,
        max_uses: maxUses,
        used_count: 0,
        expires_at: expiresAt,
        is_active: true,
        batch_label: batchLabel,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("discount_codes")
      .insert(rows)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ codes: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
