"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { BlogPost } from "@/types";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        if (data) {
          setPost({
            id: data.slug,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            image: data.image,
            author: data.author,
            date: data.date,
            category: data.category,
            featured: data.featured,
          });
        }
      });
  }, [slug]);

  if (!post) {
    return (
      <div className="mx-auto max-w-screen-2xl py-8 animate-pulse">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-4 w-24 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="h-10 w-3/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="h-4 w-48 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="aspect-[2/1] bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="h-4 w-5/6 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="h-4 w-4/5 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const postTitle = `${post.title} | The Archivist Blog`;

  return (
    <article className="mx-auto max-w-screen-2xl py-8">
      <SeoHead
        title={postTitle}
        description={post.excerpt || `Read about ${post.title} on the Archivist blog`}
        canonical={`https://thearchivist.com/blog/${slug}`}
        jsonLd={{
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          author: { "@type": "Person", name: post.author },
          datePublished: post.date,
          publisher: { "@type": "Organization", name: "The Archivist" },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://thearchivist.com/blog/${slug}` },
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/" className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">Home</Link>
        <span className="mx-2 text-xs text-dark-text-secondary">/</span>
        <Link href="/blog" className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">Blog</Link>
        <span className="mx-2 text-xs text-dark-text-secondary">/</span>
        <span className="text-xs text-dark-text-secondary">{post.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex items-center gap-3">
          <span className="border border-dark-border dark:border-dark-border border-light-border px-2 py-1 text-xs font-bold uppercase tracking-wider text-crimson">
            {post.category}
          </span>
          <time className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary" dateTime={post.date}>
            {post.date}
          </time>
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          By <span className="font-medium">{post.author}</span>
        </p>

        <div className="relative mt-8 aspect-[2/1] overflow-hidden border border-dark-border dark:border-dark-border border-light-border">
          <Image
            src={post.image}
            alt={`${post.title} — The Archivist Blog`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-8 leading-relaxed text-dark-text dark:text-dark-text text-light-text [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_strong]:text-crimson">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <h2 key={i} className="font-heading text-xl font-bold">
                  {line.replace(/\*\*/g, "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3 key={i} className="font-heading text-lg font-bold">
                  {line.replace("### ", "")}
                </h3>
              );
            }
            if (line.match(/^\d+\.\s/)) {
              return (
                <p key={i} className="mb-2 font-bold">
                  {line}
                </p>
              );
            }
            if (line.trim() === "") return <br key={i} />;
            return (
              <p key={i}>
                {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                  part.startsWith("**") ? (
                    <strong key={j} className="text-crimson">
                      {part.replace(/\*\*/g, "")}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            );
          })}
        </div>

        <div className="mt-12 border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 pt-6">
          <Link
            href="/blog"
            className="text-sm font-medium text-crimson transition-colors hover:underline"
          >
            &larr; Back to all articles
          </Link>
        </div>
      </div>
    </article>
  );
}
