"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import type { ImageItem } from "@/components/ImageUploader";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order?: number;
}

const featuresList = [
  "LED lighting base",
  "Swapable parts",
  "Detailed sculpting",
  "Official license",
  "Limited edition",
  "Numbered certificate",
  "Magnetic floating base",
  "Interchangeable hands",
  "Removable cape/armor",
  "Display case included",
];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    inStock: true,
    stockQuantity: "",
    description: "",
    material: "",
    scale: "",
    edition: "",
    weight: "",
    height: "",
    sourceLink: "",
    features: [] as string[],
    isFeatured: false,
  });
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch("/api/admin/categories"),
        ]);
        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        if (categoriesData.categories) {
          setCategories(categoriesData.categories);
        }

        if (productData.product) {
          const p = productData.product;
          setForm({
            name: p.name || "",
            price: p.price?.toString() || "",
            originalPrice: p.original_price?.toString() || "",
            category: p.category_id || "",
            inStock: p.in_stock ?? true,
            stockQuantity: p.stock_quantity?.toString() || "",
            description: p.description || "",
            material: p.material || "",
            scale: p.scale || "",
            edition: p.edition || "",
            weight: p.weight || "",
            height: p.height || "",
            sourceLink: p.source_link || "",
            features: p.features || [],
            isFeatured: p.is_featured ?? false,
          });
          if (p.product_images) {
            setImages(p.product_images);
          }
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleFeature = (feature: string) => {
    setForm({
      ...form,
      features: form.features.includes(feature)
        ? form.features.filter((f) => f !== feature)
        : [...form.features, feature],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          original_price: form.originalPrice ? parseFloat(form.originalPrice) : null,
          category_id: form.category,
          in_stock: form.inStock,
          stock_quantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
          description: form.description,
          material: form.material || null,
          scale: form.scale || null,
          edition: form.edition || null,
          weight: form.weight || null,
          height: form.height || null,
          features: form.features,
          source_link: form.sourceLink || null,
          is_featured: form.isFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");
      router.push("/admin/products");
    } catch (err: any) {
      alert(`Error updating product: ${err.message}`);
    }
  };

  const uploadPendingFiles = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append("file", selectedFiles[i]);
      formData.append("productId", productId);
      formData.append("isPrimary", images.length === 0 && i === 0 ? "true" : "false");

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, { id: "", url: data.url, is_primary: images.length === 0 && i === 0 }]);
        }
      } catch {}
    }
    previews.forEach((p) => URL.revokeObjectURL(p));
    setSelectedFiles([]);
    setPreviews([]);
    setUploading(false);
  };

  const setAsPrimary = async (imageId: string, index: number) => {
    if (!imageId) return;
    try {
      const res = await fetch("/api/admin/product-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, imageId }),
      });
      if (res.ok) {
        setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === index })));
      }
    } catch {}
  };

  const deleteImage = async (imageId: string, index: number) => {
    if (!imageId) {
      setImages((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      const res = await fetch(`/api/admin/product-images/${imageId}`, { method: "DELETE" });
      if (res.ok) {
        setImages((prev) => prev.filter((_, i) => i !== index));
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!form.name && !loading) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Product not found</p>
        <Link href="/admin/products" className="text-sm text-crimson hover:underline mt-4 inline-block">&larr; Back to Products</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/products" className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:text-crimson transition-colors mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <h1 className="font-heading text-2xl font-bold tracking-tight mb-6">Edit Product</h1>
      <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-4">Editing: {form.name}</p>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field w-full" required />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field w-full">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Price ($)</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="input-field w-full" required />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Original Price ($)</label>
              <input name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Stock Quantity</label>
              <input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} className="input-field w-full" placeholder="0 = unlimited" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">In Stock</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input name="inStock" type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-crimson h-4 w-4" />
                <span className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">{form.inStock ? "In stock" : "Out of stock"}</span>
              </label>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Featured</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="appearance-auto accent-crimson h-4 w-4 shrink-0" />
                <span className={`text-xs font-medium ${form.isFeatured ? "text-crimson" : "text-dark-text-secondary dark:text-dark-text-secondary text-gray-600"}`}>{form.isFeatured ? "★ Featured on homepage" : "Not featured"}</span>
              </label>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Scale</label>
              <input name="scale" value={form.scale} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Edition</label>
              <input name="edition" value={form.edition} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Material</label>
              <input name="material" value={form.material} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Weight (kg)</label>
              <input name="weight" value={form.weight} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Height (cm)</label>
              <input name="height" value={form.height} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Source Link <span className="text-[9px] font-normal lowercase text-dark-text-secondary/60">(confidential — AliExpress, Pinduoduo, etc.)</span></label>
            <input name="sourceLink" value={form.sourceLink} onChange={handleChange} className="input-field w-full" placeholder="https://..." />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field w-full resize-none" />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-2 block">Features</label>
            <div className="flex flex-wrap gap-2">
              {featuresList.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    form.features.includes(feature)
                      ? "border-crimson bg-crimson text-white"
                      : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 hover:border-crimson"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary">Save Changes</button>
            <Link href="/admin/products" className="btn-outline">Cancel</Link>
          </div>
        </form>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-2 block">Product Images</label>

          {(() => {
            const allImages: ImageItem[] = [
              ...images.map((img) => ({ id: img.id, url: img.url, isPrimary: img.is_primary })),
              ...selectedFiles.map((_, i) => ({ url: previews[i], file: selectedFiles[i], isPrimary: false })),
            ];
            return (
              <>
                <ImageUploader
                  images={allImages}
                  multiple
                  uploading={uploading}
                  onAdd={(files) => {
                    const newFiles = [...selectedFiles, ...files];
                    setSelectedFiles(newFiles);
                    const newPreviews = files.map((f) => URL.createObjectURL(f));
                    setPreviews((prev) => [...prev, ...newPreviews]);
                  }}
                  onRemove={(index) => {
                    if (index < images.length) {
                      deleteImage(images[index].id, index);
                    } else {
                      const pendingIndex = index - images.length;
                      URL.revokeObjectURL(previews[pendingIndex]);
                      setSelectedFiles((prev) => prev.filter((_, i) => i !== pendingIndex));
                      setPreviews((prev) => prev.filter((_, i) => i !== pendingIndex));
                    }
                  }}
                  onSetPrimary={(index) => {
                    if (index < images.length && images[index].id) {
                      setAsPrimary(images[index].id, index);
                    }
                  }}
                />
                {selectedFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={uploadPendingFiles}
                    disabled={uploading}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-white bg-crimson px-4 py-2 hover:bg-crimson-dark transition-colors disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`}
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
