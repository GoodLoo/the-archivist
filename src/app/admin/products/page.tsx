"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

interface ProductImage {
  url: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images: string[];
  product_images?: ProductImage[];
  category_id: string;
  description: string;
  in_stock: boolean;
  stock_quantity: number;
  material: string;
  scale: string;
  edition: string;
  weight: string;
  height: string;
  features: string[];
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

const PER_PAGE = 10;

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const categoryFilter = searchParams.get("category") || "";

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const loadProducts = () => {
    fetch("/api/admin/products?per_page=1000")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      });
  };

  useEffect(() => {
    loadProducts();
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  const setCategoryFilter = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/admin/products?${params.toString()}`);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_id || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PER_PAGE));
  const startIndex = (page - 1) * PER_PAGE;
  const paginatedFiltered = filtered.slice(startIndex, startIndex + PER_PAGE);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete product "${name}"? This also deletes all associated images and cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const getPrimaryImage = (product: Product): string | null => {
    if (product.product_images && product.product_images.length > 0) {
      const primary = product.product_images.find((img) => img.is_primary);
      return primary?.url || product.product_images[0]?.url || null;
    }
    return null;
  };

  const grouped = categoryFilter
    ? { [categoryFilter]: paginatedFiltered }
    : paginatedFiltered.reduce<Record<string, Product[]>>((acc, p) => {
        const cat = p.category_id || "uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
      }, {});

  const categoryLabel = (catId: string) => categoryMap[catId]?.name || catId;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Products</h1>
          <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{products.length} total products &middot; showing {Math.min(PER_PAGE, totalFiltered)} per page</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-xs">
          + New Product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field flex-1 min-w-[200px] max-w-md"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {categoryFilter && (
          <button onClick={() => setCategoryFilter("")} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline">
            Clear filter
          </button>
        )}
      </div>

      <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 text-left text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Qty</th>
                <th className="p-3 font-medium">Scale</th>
                <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows: React.ReactNode[] = [];
              for (const [catSlug, catProducts] of Object.entries(grouped)) {
                if (!categoryFilter) {
                  rows.push(
                    <tr key={`header-${catSlug}`} className="bg-dark-bg/50 dark:bg-dark-bg/50 bg-gray-50/50">
                      <td colSpan={6} className="p-2 px-3 text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
                        {categoryLabel(catSlug)}
                        <span className="ml-2 font-normal">({catProducts.length})</span>
                      </td>
                    </tr>
                  );
                }
                for (const product of catProducts) {
                  const imgUrl = getPrimaryImage(product);
                  rows.push(
                    <tr key={product.id} className="border-b border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 hover:bg-dark-bg/30 dark:hover:bg-dark-bg/30 hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-dark-bg dark:bg-dark-bg bg-gray-100 flex items-center justify-center text-[9px] font-bold text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 uppercase overflow-hidden">
                            {imgUrl ? (
                              <img src={imgUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              "N/A"
                            )}
                          </div>
                          <span className="font-medium text-dark-text dark:text-dark-text text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 capitalize">{product.category_id}</td>
                      <td className="p-3">
                        <span className="font-bold text-crimson">${product.price.toFixed(2)}</span>
                        {product.original_price && (
                          <span className="ml-1.5 text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 line-through">${product.original_price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${product.in_stock ? "text-green-500" : "text-red-500"}`}>
                          <span className={`h-1.5 w-1.5 ${product.in_stock ? "bg-green-500" : "bg-red-500"}`} />
                          {product.in_stock ? "In stock" : "Out of stock"}
                        </span>
                      </td>
                      <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{product.stock_quantity > 0 ? product.stock_quantity : "∞"}</td>
                      <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{product.scale}</td>
                      <td className="p-3 whitespace-nowrap">
                        <Link href={`/admin/products/${product.id}/edit`} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline mr-3">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50"
                        >
                          {deleting === product.id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                }
              }
              return rows;
            })()}
            {paginatedFiltered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={totalFiltered} onPageChange={setPage} />
    </div>
  );
}
