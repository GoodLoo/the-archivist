"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import SeoHead from "@/components/SeoHead";

export default function WishlistPage() {
  const { items, removeItem, loaded } = useWishlist();
  const { addItem } = useCart();

  if (!loaded) {
    return (
      <div className="mx-auto max-w-screen-2xl py-8 animate-pulse">
        <div className="mb-6 h-6 w-32 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
        <div className="mb-8 h-8 w-64 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
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
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-screen-2xl py-20">
        <SeoHead title="Your Wishlist | The Archivist" description="Your wishlist is empty. Save your favorite premium figurines and come back anytime." />
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-dark-border dark:border-dark-border border-light-border">
            <svg className="h-10 w-10 text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold">Your wishlist is empty</h1>
          <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Save your favorite figurines and come back to them anytime.
          </p>
          <Link
            href="/categories"
            className="btn-primary mt-8 inline-flex hover:bg-transparent hover:text-crimson transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <SeoHead title="Your Wishlist | The Archivist" description={`${items.length} saved premium figurine${items.length !== 1 ? "s" : ""} on your wishlist.`} />
      <Link
        href="/categories"
        className="mb-6 inline-block text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
      >
        &larr; Continue Shopping
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your <span className="text-crimson">Wishlist</span>
        </h1>
        <p className="mt-1 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          {items.length} saved item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col group">
            <div className="relative overflow-hidden border border-dark-border dark:border-dark-border border-light-border transition-colors duration-300 group-hover:border-crimson">
              <Link href={`/categories/${item.category}/${item.id}`}>
                <div className="aspect-square overflow-hidden bg-dark-surface dark:bg-dark-surface bg-gray-100">
                  <Image
                    src={item.image}
                    alt={`${item.name} — wishlist item`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {!item.inStock && (
                <div className="absolute left-2 top-2 bg-dark-bg/90 dark:bg-dark-bg/90 bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-crimson border border-crimson">
                  Sold Out
                </div>
              )}

              <button
                onClick={() => removeItem(item.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center border border-crimson bg-crimson text-white transition-colors hover:bg-crimson/90"
                aria-label="Remove from wishlist"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-3 flex flex-1 flex-col gap-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-crimson">
                {item.category === "marvel-multiverse" ? "Marvel" :
                 item.category === "dc-multiverse" ? "DC" :
                 item.category === "wizarding-world" ? "Wizarding World" :
                 item.category === "star-wars-galaxy" ? "Star Wars" :
                 item.category === "anime-manga" ? "Anime" :
                 item.category === "gaming-esports" ? "Gaming" :
                 item.category === "cinema-television" ? "Cinema" :
                 item.category === "premium-originals" ? "Originals" : item.category}
              </p>
              <Link href={`/categories/${item.category}/${item.id}`}>
                <h3 className="font-heading text-sm font-bold text-dark-text dark:text-dark-text text-light-text transition-colors hover:text-crimson leading-tight">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-bold text-crimson">
                  ${item.price.toLocaleString()}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary line-through">
                    ${item.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-auto pt-1">
                <span className={`h-1.5 w-1.5 rounded-full ${item.inStock ? "bg-green-500" : "bg-crimson"}`} />
                <span className={`text-[10px] font-medium uppercase tracking-wider ${item.inStock ? "text-green-500" : "text-crimson"}`}>
                  {item.inStock ? "In Stock" : "Sold Out"}
                </span>
              </div>
              {item.inStock && (
                <button
                  onClick={() => {
                    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
                    removeItem(item.id);
                  }}
                  className="mt-2 w-full border border-crimson py-2 text-xs font-bold uppercase tracking-wider text-crimson transition-colors hover:bg-crimson hover:text-white"
                >
                  Move to Cart
                </button>
              )}
              {!item.inStock && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="mt-2 w-full border border-dark-border dark:border-dark-border border-light-border py-2 text-xs font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:border-crimson hover:text-crimson"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
