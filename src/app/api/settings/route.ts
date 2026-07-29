import { NextResponse } from "next/server";
import { loadSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await loadSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}
