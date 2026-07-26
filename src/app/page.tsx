"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Link from "next/link";
import { Product } from "@/types";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("categories").select("*, products!left(count)").order("id"),
      supabase.from("products").select("*, product_images(url, is_primary), categories(slug)").eq("is_featured", true).order("name")
    ]).then(([{ data: catData }, { data: prodData }]) => {
      if (catData) setCategories(
        catData.map((cat: any) => ({ ...cat, product_count: cat.products?.[0]?.count ?? 0 }))
      );
      if (prodData) setFeaturedProducts(
        prodData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          image: p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url || "",
          images: p.product_images?.map((img: any) => img.url) || [],
          category: p.categories?.slug || p.category_id,
          description: p.description || "",
          inStock: p.in_stock,
          material: p.material,
          scale: p.scale,
          edition: p.edition,
          weight: p.weight,
          height: p.height,
          features: p.features || [],
        }))
      );
      setLoading(false);
    });
  }, []);

  return (
    <>
      <HeroSection />

      {loading ? (
        <>
          <section className="mx-auto max-w-screen-2xl pt-0 pb-16">
            <div className="mb-8 h-8 w-64 animate-pulse bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200" />
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-3/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                    <div className="h-4 w-1/2 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mx-auto max-w-screen-2xl py-16">
            <div className="mb-8 h-8 w-72 animate-pulse bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="mx-auto max-w-screen-2xl pt-0 pb-16">
            <div className="-mx-5 lg:-mx-16 bg-crimson px-5 lg:px-16 py-3 sm:py-4 mb-6 flex items-center justify-between">
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-black dark:text-white">
                Featured <span className="text-black dark:text-white">Collectibles</span>
              </h2>
              <Link
                href="/categories"
                className="border border-white text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 hover:bg-white hover:text-crimson transition-colors"
              >
                View All &rarr;
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </section>

          <section className="mx-auto max-w-screen-2xl py-16">
            <div className="-mx-5 lg:-mx-16 bg-crimson px-5 lg:px-16 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-black dark:text-white">
                Browse by <span className="text-black dark:text-white">Universe</span>
              </h2>
              <Link
                href="/categories"
                className="border border-white text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 hover:bg-white hover:text-crimson transition-colors"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden border border-dark-border dark:border-dark-border border-light-border transition-colors hover:border-crimson"
                >
              <Image
                src={cat.image}
                alt={`${cat.name} — ${cat.product_count} premium figurines`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/30 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/30 to-transparent from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-heading text-sm font-bold uppercase tracking-wider text-crimson">
                      {cat.id}
                    </p>
                    <h3 className="font-heading text-lg font-bold text-white">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400">{cat.product_count} items</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
