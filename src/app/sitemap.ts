import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

const BASE_URL = "https://thearchivist.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/categories`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/search`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/cart`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/wishlist`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/track-order`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const [categoriesRes, productsRes, blogRes] = await Promise.all([
    supabaseAdmin.from("categories").select("slug"),
    supabaseAdmin.from("products").select("id, category_id"),
    supabaseAdmin.from("blog_posts").select("slug"),
  ]);

  const categoryEntries: MetadataRoute.Sitemap = (categoriesRes.data || []).map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = (productsRes.data || []).map((prod) => ({
    url: `${BASE_URL}/categories/${prod.category_id}/${prod.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = (blogRes.data || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...blogEntries];
}
