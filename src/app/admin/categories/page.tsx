"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const loadData = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !newSlug.trim()) {
      alert("Name and slug are required");
      return;
    }
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, slug: newSlug, description: newDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      const cat = data.category;
      if (newImage && cat?.id) {
        const ext = newImage.name.split(".").pop() || "png";
        const fileName = `categories/${newSlug}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabaseAdmin.storage
          .from("product-images")
          .upload(fileName, newImage, { contentType: newImage.type, upsert: true });
        if (!uploadErr) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(fileName);
          await fetch(`/api/admin/categories/${newSlug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: publicUrlData.publicUrl }),
          });
        }
      }

      setShowAdd(false);
      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setNewImage(null);
      setNewImagePreview("");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleEditStart = (cat: Category) => {
    setEditSlug(cat.slug);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
  };

  const handleEditSave = async () => {
    if (!editSlug) return;
    try {
      const res = await fetch(`/api/admin/categories/${editSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setCategories((prev) =>
        prev.map((c) => (c.slug === editSlug ? { ...c, name: editName, description: editDescription } : c))
      );
      setEditSlug(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(slug);
    try {
      const ext = file.name.split(".").pop() || "png";
      const fileName = `categories/${slug}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabaseAdmin.storage
        .from("product-images")
        .upload(fileName, file, { contentType: file.type, upsert: true });
      if (uploadErr) throw new Error(uploadErr.message);

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(fileName);
      const url = publicUrlData.publicUrl;

      const res = await fetch(`/api/admin/categories/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
      if (!res.ok) throw new Error("Failed to update image");

      setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, image: url } : c)));
    } catch (err: any) {
      alert(err?.message || "Upload failed");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const handleDelete = async (slug: string, name: string) => {
    const cat = categories.find((c) => c.slug === slug);
    const count = cat?.product_count || 0;
    if (count > 0) {
      alert(`Cannot delete "${name}" — ${count} product(s) belong to this category. Remove or reassign them first.`);
      return;
    }
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/categories/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Categories</h1>
          <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{categories.length} total categories</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs">
          + Add Category
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">New Category</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input placeholder="Name *" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" />
            <input placeholder="Slug * (e.g. new-category)" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="input-field" />
            <input placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="input-field sm:col-span-2" />
          </div>
          <div className="mt-3">
            <ImageUploader
              images={newImage ? [{ url: newImagePreview, file: newImage }] : []}
              onAdd={(files) => {
                const file = files[0];
                if (file) {
                  setNewImage(file);
                  setNewImagePreview(URL.createObjectURL(file));
                }
              }}
              onRemove={() => {
                if (newImagePreview) URL.revokeObjectURL(newImagePreview);
                setNewImage(null);
                setNewImagePreview("");
              }}
              compact
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} disabled={creating} className="btn-primary text-xs disabled:opacity-50">{creating ? "Creating..." : "Create"}</button>
            <button onClick={() => { setShowAdd(false); setNewImage(null); setNewImagePreview(""); }} className="px-3 py-1.5 border border-dark-border dark:border-dark-border border-gray-200 text-xs font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const productCount = cat.product_count || 0;
          return (
            <div key={cat.slug} className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-0 overflow-hidden">
              <div className="relative h-36 bg-dark-bg dark:bg-dark-bg bg-gray-100 group overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 uppercase">
                    {cat.name}
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-crimson text-white text-[10px] font-bold px-2 py-0.5">
                  {productCount} {productCount === 1 ? "product" : "products"}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs text-white font-bold uppercase tracking-wider">
                    {uploading === cat.slug ? "Uploading..." : "Change Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(cat.slug, e)}
                    disabled={uploading === cat.slug}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="p-4">
                {editSlug === cat.slug ? (
                  <div className="space-y-2 mb-2">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field text-sm" autoFocus />
                    <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="input-field text-sm" placeholder="Description" />
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleEditSave} className="bg-crimson text-white px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-crimson/90 transition-colors">Save</button>
                      <button onClick={() => setEditSlug(null)} className="border border-dark-border dark:border-dark-border border-gray-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 hover:border-crimson transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <Link href={`/admin/products?category=${cat.slug}`} className="block mb-2 group">
                    <p className="font-heading text-sm font-bold text-dark-text dark:text-dark-text text-gray-900 group-hover:text-crimson transition-colors">{cat.name}</p>
                    {cat.description && <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mt-1 line-clamp-2">{cat.description}</p>}
                  </Link>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-dark-border/30 dark:border-dark-border/30 border-gray-200/30">
                  <button onClick={() => handleEditStart(cat)} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline">Edit</button>
                  <button
                    onClick={() => handleDelete(cat.slug, cat.name)}
                    disabled={deleting === cat.slug}
                    className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50"
                  >
                    {deleting === cat.slug ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
