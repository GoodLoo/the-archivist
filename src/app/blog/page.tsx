"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types";
import BlogCard from "@/components/BlogCard";
import SeoHead from "@/components/SeoHead";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setPosts(
            data.map((p) => ({
              id: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              content: p.content,
              image: p.image,
              author: p.author,
              date: p.date,
              category: p.category,
              featured: p.featured,
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  const featured = posts.filter((p) => p.featured);

  const blogTitle = "Collector's Vault Blog | The Archivist";

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead
        title={blogTitle}
        description="News, guides, and stories from the world of premium collectibles. Discover articles about Marvel, DC, Star Wars, Anime, and Gaming figurines."
        canonical="https://thearchivist.com/blog"
        jsonLd={{
          "@type": "Blog",
          name: "The Archivist Blog",
          description: "News, guides, and stories from the world of premium collectibles.",
          url: "https://thearchivist.com/blog",
        }}
      />
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Collector&apos;s <span className="text-crimson">Vault</span> Blog
        </h1>
        <p className="mt-2 max-w-xl text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          News, guides, and stories from the world of premium collectibles.
        </p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="aspect-[16/9] bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="space-y-5">
              <div className="aspect-[16/9] bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="aspect-[16/9] bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            </div>
          </div>
          <div>
            <div className="mb-6 h-6 w-48 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[16/9] bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                  <div className="h-4 w-3/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                  <div className="h-3 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="grid gap-5 lg:grid-cols-2">
            <BlogCard post={featured[0]} featured />
            {featured.slice(1, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-6 font-heading text-xl font-bold">
          Latest <span className="text-crimson">Articles</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
        </>
      )}
    </div>
  );
}
