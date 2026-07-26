"use client";

import Image from "next/image";
import { Product } from "@/types";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden border border-dark-border dark:border-dark-border border-light-border transition-colors duration-300 group-hover:border-crimson">
        <Link href={`/categories/${product.category}/${product.id}`}>
          <div className="aspect-[4/5] overflow-hidden bg-dark-surface dark:bg-dark-surface bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {!product.inStock && (
          <div className="absolute left-1.5 top-1.5 bg-dark-bg/90 dark:bg-dark-bg/90 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-crimson border border-crimson">
            Sold Out
          </div>
        )}

        {hasDiscount && product.inStock && (
          <div className="absolute left-1.5 top-1.5 bg-crimson px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Sale
          </div>
        )}

        <button
          onClick={() => toggleItem({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            inStock: product.inStock,
            category: product.category,
          })}
          className={`absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center border transition-colors
            ${wishlisted
              ? "border-crimson bg-crimson text-white"
              : "border-dark-border dark:border-dark-border border-light-border bg-dark-bg/80 dark:bg-dark-bg/80 bg-white/80 text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:border-crimson hover:text-crimson"
            }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-1.5">
        <Link href={`/categories/${product.category}/${product.id}`}>
          <h3 className="font-heading text-sm font-bold text-dark-text dark:text-dark-text text-light-text transition-colors hover:text-crimson leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="flex items-center gap-2">
            <span className="font-body text-sm font-bold text-crimson">
              ${product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary line-through">
                ${product.originalPrice!.toLocaleString()}
              </span>
            )}
          </div>
          {product.scale && (
            <span className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary text-right">
              {product.scale}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {product.inStock ? (
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
          )}
          <span className={`text-[11px] font-medium uppercase tracking-wider ${product.inStock ? "text-green-500" : "text-crimson"}`}>
            {product.inStock ? "In Stock" : "Sold Out"}
          </span>
        </div>

        <button
          onClick={() => {
            if (!product.inStock) return;
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            });
          }}
          className={`mt-1 w-full border py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            product.inStock
              ? "border-crimson text-crimson hover:bg-crimson hover:text-white"
              : "border-dark-border dark:border-dark-border border-gray-300 text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 cursor-default"
          }`}
        >
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
