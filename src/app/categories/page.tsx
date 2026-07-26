"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";
import SeoHead from "@/components/SeoHead";

function stripId(id: string) {
  return id.replace(/[-_]\d+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from("categories").select("*").order("id");
      if (cats) {
        const { data: allProducts } = await supabase.from("products").select("category_id");
        const counts: Record<string, number> = {};
        if (allProducts) {
          for (const p of allProducts) {
            counts[p.category_id] = (counts[p.category_id] || 0) + 1;
          }
        }
        setCategories(
          cats.map((cat) => ({
            ...cat,
            productCount: counts[cat.id] || 0,
          }))
        );
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead
        title="All Collections | The Archivist"
        description="Browse our complete collection of premium figurines — Marvel, DC, Star Wars, Anime, Gaming, and more. Official licensed collectibles."
        canonical="https://thearchivist.com/categories"
      />
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          All <span className="text-crimson">Collections</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Explore every universe we archive. From superheroes to anime legends.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          ))}
        </div>
      ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative aspect-[4/3] overflow-hidden border border-dark-border dark:border-dark-border border-light-border transition-colors hover:border-crimson"
          >
            <Image
              src={cat.image}
              alt={`${cat.name} — ${cat.productCount} premium figurines`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/30 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/30 to-transparent from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-crimson">
                {stripId(cat.id)}
              </p>
              <h2 className="font-heading text-lg font-bold text-white">
                {cat.name}
              </h2>
              <p className="text-xs text-gray-400">{cat.productCount} items</p>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
