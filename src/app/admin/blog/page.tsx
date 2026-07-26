"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import Pagination from "@/components/Pagination";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string | null;
  date: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadPosts = (p: number) => {
    setLoading(true);
    fetch(`/api/admin/blog?page=${p}&per_page=20`)
      .then((r) => r.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this blog post?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadPosts(page);
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Blog</h1>
          <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">{total} total posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn-outline text-xs px-4 py-2">New Post</Link>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 text-left text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Excerpt</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-dark-border/30 dark:border-dark-border/30 border-gray-200/30 hover:bg-dark-bg/30 dark:hover:bg-dark-bg/30 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-dark-text dark:text-dark-text text-gray-900 max-w-[200px] truncate">{post.title}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 max-w-[300px] truncate">{post.excerpt}</td>
                  <td className="p-3 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 whitespace-nowrap">{post.date}</td>
                  <td className="p-3">
                    {post.image ? (
                      <img src={post.image} alt="" className="w-12 h-12 object-cover border border-dark-border/30 dark:border-dark-border/30 border-gray-200/30" />
                    ) : (
                      <span className="text-dark-text-secondary dark:text-dark-text-secondary text-gray-400 text-xs">\u2014</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Link href={`/admin/blog/${post.id}/edit`} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline mr-3">Edit</Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline disabled:opacity-50"
                    >
                      {deleting === post.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">No blog posts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}
