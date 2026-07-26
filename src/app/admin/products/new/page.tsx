"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import type { ImageItem } from "@/components/ImageUploader";

interface Category {
  id: string;
  name: string;
  slug: string;
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

export default function NewProductPage() {
  const router = useRouter();
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setForm((prev) => ({ ...prev, category: data.categories[0].id }));
          }
        }
      });
  }, []);

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

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (primaryIndex >= index && primaryIndex > 0) {
      setPrimaryIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
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
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      const productId = data.product.id;

      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append("file", selectedFiles[i]);
        formData.append("productId", productId);
        formData.append("isPrimary", i === primaryIndex ? "true" : "false");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          console.error(`Failed to upload image ${i + 1}:`, uploadData.error);
        }
      }

      previews.forEach((p) => URL.revokeObjectURL(p));

      router.push("/admin/products");
    } catch (err: any) {
      alert(`Error creating product: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Link href="/admin/products" className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:text-crimson transition-colors mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <h1 className="font-heading text-2xl font-bold tracking-tight mb-6">New Product</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
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
                <input name="scale" value={form.scale} onChange={handleChange} className="input-field w-full" placeholder="e.g. 1/6" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Edition</label>
                <input name="edition" value={form.edition} onChange={handleChange} className="input-field w-full" placeholder="e.g. Limited" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Material</label>
              <input name="material" value={form.material} onChange={handleChange} className="input-field w-full" />
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
              <button type="submit" disabled={creating} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {creating ? "Creating Product..." : "Create Product"}
              </button>
              <Link href="/admin/products" className="btn-outline">Cancel</Link>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-2 block">Product Images</label>
            <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-3">Select images before creating the product. They will be uploaded automatically on creation.</p>

            <ImageUploader
              images={selectedFiles.map((_, i) => ({ url: previews[i], file: selectedFiles[i], isPrimary: i === primaryIndex }))}
              multiple
              compact
              onAdd={(files) => {
                const newFiles = [...selectedFiles, ...files];
                setSelectedFiles(newFiles);
                const newPreviews = files.map((f) => URL.createObjectURL(f));
                setPreviews((prev) => [...prev, ...newPreviews]);
              }}
              onRemove={(index) => {
                removeFile(index);
              }}
              onSetPrimary={(index) => {
                setPrimaryIndex(index);
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
