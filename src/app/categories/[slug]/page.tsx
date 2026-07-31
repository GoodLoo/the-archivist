"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import SortBar from "@/components/SortBar";
import Link from "next/link";
import type { Product, Category } from "@/types";
import Pagination from "@/components/Pagination";
import SeoHead from "@/components/SeoHead";
import { shuffle } from "@/lib/shuffle";

const PAGE_SIZE = 8;

function stripId(id: string) {
  return id.replace(/[-_]\d+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [priceSort, setPriceSort] = useState<"default" | "asc" | "desc">("default");
  const [nameSort, setNameSort] = useState<"default" | "asc" | "desc">("default");
  const [sizeSort, setSizeSort] = useState<"default" | "asc" | "desc">("default");
  const [scaleFilter, setScaleFilter] = useState("all");
  const [showInStock, setShowInStock] = useState(false);
  const [page, setPage] = useState(1);
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

        const mapped = cats.map((cat) => ({
          ...cat,
          productCount: counts[cat.id] || 0,
        }));
        setCategories(mapped);
        setCategory(mapped.find((c) => c.slug === slug) ?? null);
      }
    })();
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single()
      .then(({ data: catData }) => {
        if (!catData) { setLoading(false); return; }
      supabase
        .from("products")
        .select("*, product_images(url, is_primary), categories(slug)")
        .eq("category_id", catData.id)
        .order("price")
        .then(({ data }) => {
          if (data) {
            setRawProducts(
              shuffle(data.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                originalPrice: p.original_price ?? undefined,
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
              })))
            );
          }
          setLoading(false);
        });
      });
  }, [slug]);

  const availableScales = useMemo(() => {
    const scales = new Set<string>();
    rawProducts.forEach((p) => { if (p.scale) scales.add(p.scale); });
    return Array.from(scales).sort();
  }, [rawProducts]);

  const sorted = useMemo(() => {
    let list = [...rawProducts];
    if (showInStock) list = list.filter((p) => p.inStock);
    if (scaleFilter !== "all") list = list.filter((p) => p.scale === scaleFilter);

    const sorters: Array<(a: Product, b: Product) => number> = [];

    if (priceSort !== "default") {
      sorters.push((a, b) => priceSort === "asc" ? a.price - b.price : b.price - a.price);
    }
    if (nameSort !== "default") {
      sorters.push((a, b) => nameSort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }
    if (sizeSort !== "default") {
      sorters.push((a, b) => sizeSort === "asc"
        ? (a.scale || "").localeCompare(b.scale || "")
        : (b.scale || "").localeCompare(a.scale || ""));
    }

    if (sorters.length > 0) {
      list.sort((a, b) => {
        for (const s of sorters) {
          const r = s(a, b);
          if (r !== 0) return r;
        }
        return 0;
      });
    }

    return list;
  }, [rawProducts, priceSort, nameSort, sizeSort, showInStock, scaleFilter]);

  const totalFiltered = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const products = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageReset = () => setPage(1);

  if (!category) {
    return (
      <div className="mx-auto max-w-screen-2xl px-5 py-20 text-center">
        <SeoHead title="Collection Not Found | The Archivist" />
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Collection not found</p>
        <Link href="/categories" className="btn-primary mt-6 inline-block hover:bg-transparent hover:text-crimson transition-colors">
          View All Collections
        </Link>
      </div>
    );
  }

  const categoryTitle = `${category.name} | The Archivist`;
  const categoryDesc = category.description || `Browse our ${category.name} collection of premium figurines and collectibles.`;

  return (
    <div>
      <SeoHead
        title={categoryTitle}
        description={categoryDesc}
        canonical={`https://thearchivist.com/categories/${slug}`}
        jsonLd={{
          "@type": "CollectionPage",
          name: category.name,
          description: categoryDesc,
          url: `https://thearchivist.com/categories/${slug}`,
          numberOfItems: rawProducts.length,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://thearchivist.com" },
              { "@type": "ListItem", position: 2, name: "Collections", item: "https://thearchivist.com/categories" },
              { "@type": "ListItem", position: 3, name: category.name },
            ],
          },
        }}
      />

      <section className="relative -mx-5 lg:-mx-16 overflow-hidden" style={{ minHeight: "40vh" }}>
        {category.image && (
          <div className="absolute inset-0">
            <Image src={category.image} alt={`${category.name} collection background`} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-dark-bg/40 to-transparent dark:from-dark-bg/70 dark:via-dark-bg/40 dark:to-transparent" />
          </div>
        )}
        {!category.image && (
          <div className="absolute inset-0 bg-dark-bg dark:bg-dark-bg bg-gray-100" />
        )}
        <div className="relative mx-auto max-w-screen-2xl flex items-end h-full pl-5 lg:pl-16" style={{ minHeight: "40vh" }}>
          <div className="bg-crimson px-5 sm:px-8 lg:px-10 py-4 sm:py-6 -mb-px">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-white/80">
                {category.description}
              </p>
            )}
            <Link
              href="/categories"
              className="mt-3 inline-block border border-white text-white text-[11px] sm:text-xs font-medium px-3 py-1.5 hover:bg-white hover:text-crimson transition-colors"
            >
              &larr; All Collections
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-wrap items-center gap-1.5 mb-3 pt-3 pb-2 border-b border-dark-border/50 dark:border-dark-border/50 border-light-border/50">
          <SortBar
            priceSort={priceSort}
            nameSort={nameSort}
            sizeSort={sizeSort}
            onPriceSort={(v) => { setPriceSort(v); handlePageReset(); }}
            onNameSort={(v) => { setNameSort(v); handlePageReset(); }}
            onSizeSort={(v) => { setSizeSort(v); handlePageReset(); }}
            scaleFilter={scaleFilter}
            onScaleChange={(v) => { setScaleFilter(v); handlePageReset(); }}
            availableScales={availableScales}
            showInStock={showInStock}
            onStockToggle={() => { setShowInStock(!showInStock); handlePageReset(); }}
            totalFiltered={totalFiltered}
            totalRaw={rawProducts.length}
          />
        </div>

        <div className="mb-3 -mx-5 overflow-x-auto px-5">
          <div className="flex gap-1.5 pb-1 min-w-max">
            {categories.map((cat) => {
              const active = cat.slug === slug;
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={`shrink-0 px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap
                    ${active
                      ? "border-crimson bg-crimson text-white"
                      : "border-dark-border dark:border-dark-border border-light-border text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:border-crimson hover:text-crimson"
                    }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {totalFiltered === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="font-heading text-lg font-bold text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                  No items match your filters
                </p>
                <button
                  onClick={() => { setPriceSort("default"); setNameSort("default"); setSizeSort("default"); setScaleFilter("all"); setShowInStock(false); setPage(1); }}
                  className="btn-primary mt-6 hover:bg-transparent hover:text-crimson transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={products} desktopCols={5} />
                <div className="mt-8">
                  <Pagination page={page} totalPages={totalPages} total={totalFiltered} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
