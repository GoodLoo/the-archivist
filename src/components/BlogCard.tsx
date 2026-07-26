import Image from "next/image";
import { BlogPost } from "@/types";
import Link from "next/link";

export default function BlogCard({
  post,
  featured,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className={`group block border border-dark-border dark:border-dark-border border-light-border transition-colors hover:border-crimson ${featured ? "lg:col-span-2" : ""}`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[2/1] lg:aspect-[3/1]" : "aspect-[16/9]"}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 border border-dark-border dark:border-dark-border border-light-border bg-dark-bg/90 dark:bg-dark-bg/90 bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-crimson">
          {post.category}
        </div>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          {post.date} &middot; {post.author}
        </p>
        <h3 className={`font-heading font-bold text-dark-text dark:text-dark-text text-light-text transition-colors group-hover:text-crimson ${featured ? "text-xl lg:text-2xl" : "text-base"}`}>
          {post.title}
        </h3>
        {featured && (
          <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
