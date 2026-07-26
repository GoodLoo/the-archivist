"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import ProductGrid from "@/components/ProductGrid";
import SortBar from "@/components/SortBar";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [priceSort, setPriceSort] = useState<"default" | "asc" | "desc">("default");
  const [nameSort, setNameSort] = useState<"default" | "asc" | "desc">("default");
  const [sizeSort, setSizeSort] = useState<"default" | "asc" | "desc">("default");
  const [scaleFilter, setScaleFilter] = useState("all");
  const [showInStock, setShowInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (q) {
      setSearching(true);
      supabase
        .from("products")
        .select("*, product_images(url, is_primary), categories(slug)")
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(50)
        .then(({ data }) => {
          if (data) {
            setResults(
              data.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                originalPrice: p.original_price,
                image: p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url || "",
                images: p.product_images?.map((img: any) => img.url) || [],
                category: p.categories?.slug || p.category_id,
                description: p.description || "",
                inStock: p.in_stock,
                scale: p.scale,
                material: p.material,
                edition: p.edition,
                weight: p.weight,
                height: p.height,
                features: p.features || [],
              }))
            );
          }
          setSearching(false);
        });
    } else {
      setResults([]);
      setSearching(false);
    }
  }, [q]);

  const availableScales = useMemo(() => {
    const scales = new Set<string>();
    results.forEach((p) => { if (p.scale) scales.add(p.scale); });
    return Array.from(scales).sort();
  }, [results]);

  const sorted = useMemo(() => {
    let list = [...results];
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
  }, [results, priceSort, nameSort, sizeSort, showInStock, scaleFilter]);

  const totalFiltered = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const products = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageReset = () => setPage(1);

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead
        title={q ? `Search results for "${q}" | The Archivist` : "Search | The Archivist"}
        description={q ? `Find premium figurines matching "${q}" — Marvel, DC, Star Wars, Anime and more.` : "Search our vault of premium figurines and collectibles."}
        canonical={q ? `https://thearchivist.com/search?q=${encodeURIComponent(q)}` : "https://thearchivist.com/search"}
      />
      <Link
        href="/"
        className="mb-6 inline-block text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
      >
        &larr; Back to Home
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Search <span className="text-crimson">Results</span>
        </h1>
        <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          {q ? `Showing results for "${q}"` : "Enter a search term to find figurines."}
        </p>
      </div>

      {!q ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Type something in the search bar to get started.
          </p>
        </div>
      ) : searching ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-1/2 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                <div className="h-4 w-3/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                <div className="h-4 w-1/3 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-heading text-lg font-bold text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            No results found
          </p>
          <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Try a different search term or browse our categories.
          </p>
          <Link
            href="/categories"
            className="btn-primary mt-6 hover:bg-transparent hover:text-crimson transition-colors"
          >
            Browse All Categories
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-2 border-b border-dark-border/50 dark:border-dark-border/50 border-light-border/50">
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
              totalRaw={results.length}
            />
          </div>
          {products.length === 0 ? (
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
              <ProductGrid products={products} />
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} total={totalFiltered} onPageChange={setPage} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-screen-2xl py-8">
          <p className="text-dark-text-secondary">Loading...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
