import { supabase } from "./supabase";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
}

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string;
  category_id: string;
  in_stock: boolean;
  material: string | null;
  scale: string | null;
  edition: string | null;
  weight: string | null;
  height: string | null;
  features: string[];
  is_featured?: boolean;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  featured: boolean;
}

export async function getCategories(): Promise<CategoryRow[]> {
  const { data } = await supabase.from("categories").select("*").order("id");
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return data;
}

export async function getProducts(categorySlug?: string): Promise<ProductRow[]> {
  let query = supabase.from("products").select("*");
  if (categorySlug) {
    query = query.eq("category_id", categorySlug);
  }
  const { data } = await query.order("name");
  return data || [];
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data;
}

export async function getProductImages(productId: string): Promise<ProductImageRow[]> {
  const { data } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order");
  return data || [];
}

export async function getFeaturedProducts(): Promise<ProductRow[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("name");
  return data || [];
}

export async function getBlogPosts(featuredOnly?: boolean): Promise<BlogRow[]> {
  let query = supabase.from("blog_posts").select("*");
  if (featuredOnly) query = query.eq("featured", true);
  const { data } = await query.order("date", { ascending: false });
  return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogRow | null> {
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  return data;
}

export async function searchProducts(query: string): Promise<ProductRow[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(50);
  return data || [];
}

export async function getOrderByNumber(orderNumber: string): Promise<any> {
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), order_timeline(*)")
    .eq("order_number", orderNumber)
    .single();
  return data;
}
