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
  return parseFloat(taxRate) / 100;
}

export function parseFreeShippingThreshold(threshold: string): number {
  return parseFloat(threshold) || 100;
}

export function parseShippingCost(cost: string): number {
  return parseFloat(cost) || 15.99;
}
