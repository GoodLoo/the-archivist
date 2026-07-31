import { supabaseAdmin } from "./supabase";

const SETTINGS_FILE = "store/settings.json";

const defaults = {
  taxRate: "8.875",
  freeShippingThreshold: "100",
  shippingCost: "15.99",
};

export interface StoreSettings {
  taxRate: string;
  freeShippingThreshold: string;
  shippingCost: string;
  [key: string]: any;
}

export async function loadSettings(): Promise<StoreSettings> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("store")
      .download(SETTINGS_FILE);
    if (error || !data) return { ...defaults };
    const text = await data.text();
    return { ...defaults, ...JSON.parse(text) };
  } catch {
    return { ...defaults };
  }
}

export function parseTaxRate(taxRate: string): number {
  const parsed = parseFloat(taxRate);
  return isNaN(parsed) ? 0.08875 : parsed / 100;
}

export function parseFreeShippingThreshold(threshold: string): number {
  const parsed = parseFloat(threshold);
  return isNaN(parsed) ? 100 : parsed;
}

export function parseShippingCost(cost: string): number {
  const parsed = parseFloat(cost);
  return isNaN(parsed) ? 15.99 : parsed;
}
