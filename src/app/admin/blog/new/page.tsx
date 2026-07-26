"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "news",
    featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          image: imageUrl || null,
          author: form.author,
          category: form.category,
          featured: form.featured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      router.push("/admin/blog");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Link href="/admin/blog" className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 hover:text-crimson transition-colors mb-4 inline-block">
        &larr; Back to Blog
      </Link>

      <h1 className="font-heading text-2xl font-bold tracking-tight mb-6">New Blog Post</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-field w-full" required />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="input-field w-full" required />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Author</label>
            <input name="author" value={form.author} onChange={handleChange} className="input-field w-full" required />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field w-full">
              <option value="news">News</option>
              <option value="releases">Releases</option>
              <option value="reviews">Reviews</option>
              <option value="behind-the-scenes">Behind the Scenes</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Featured</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-crimson h-4 w-4" />
              <span className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-600">Featured post</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Excerpt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="input-field w-full resize-none" />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Content (HTML)</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={12} className="input-field w-full resize-none font-mono text-sm" />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-2 block">Featured Image</label>
          <ImageUploader
            images={imageUrl ? [{ url: imageUrl }] : []}
            compact
            uploading={uploading}
            onAdd={async (files) => {
              const file = files[0];
              if (!file) return;
              setUploading(true);
              try {
                const ext = file.name.split(".").pop() || "png";
                const fileName = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                const { error } = await supabaseAdmin.storage
                  .from("product-images")
                  .upload(fileName, file, { contentType: file.type });
                if (error) throw new Error(error.message);
                const { data: publicUrlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(fileName);
                setImageUrl(publicUrlData.publicUrl);
              } catch (err: any) {
                alert(err?.message || "Upload failed");
              } finally {
                setUploading(false);
              }
            }}
            onRemove={() => setImageUrl("")}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary">Create Post</button>
          <Link href="/admin/blog" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
