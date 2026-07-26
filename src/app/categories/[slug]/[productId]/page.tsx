"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types";
import SeoHead from "@/components/SeoHead";
import ContactModal from "@/components/ContactModal";

export default function ProductDetailPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const params = useParams();
  const slug = params.slug as string;
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [related, setRelated] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      const { data: prodData } = await supabase
        .from("products")
        .select("*, product_images(url, is_primary, sort_order), categories(slug)")
        .eq("id", productId)
        .single();

      if (!prodData) {
        setNotFound(true);
        return;
      }

      const allImages = (prodData as any).product_images || [];
      const sorted = allImages.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.url);
      setProductImages(sorted);
      setSelectedImage(sorted[0] || "");

      const mapped: Product = {
        id: prodData.id,
        name: prodData.name,
        price: prodData.price,
        originalPrice: prodData.original_price ?? undefined,
        image: allImages.find((img: any) => img.is_primary)?.url || allImages[0]?.url || "",
        images: allImages.map((img: any) => img.url),
        category: (prodData as any).categories?.slug || prodData.category_id,
        description: prodData.description || "",
        inStock: prodData.in_stock,
        material: prodData.material,
        scale: prodData.scale,
        edition: prodData.edition,
        weight: prodData.weight,
        height: prodData.height,
        features: prodData.features || [],
      };
      setProduct(mapped);

      const { data: catData } = await supabase
        .from("categories")
        .select("name")
        .eq("slug", slug)
        .single();

      if (catData) {
        setCategoryName(catData.name);
      }

      const { data: relData } = await supabase
        .from("products")
        .select("*, product_images(url, is_primary), categories(slug)")
        .eq("category_id", prodData.category_id)
        .neq("id", productId)
        .limit(4);

      if (relData) {
        setRelated(
          relData.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.original_price ?? undefined,
            image: p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url || "",
            images: p.product_images?.map((img: any) => img.url) || [],
            category: p.categories?.slug || p.category_id,
            description: p.description || "",
            inStock: p.in_stock,
            material: p.material,
            scale: p.scale,
            edition: p.edition,
            weight: p.weight,
            height: p.height,
            features: p.features || [],
          }))
        );
      }
    };

    fetchData();
  }, [productId, slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-screen-2xl px-5 py-20 text-center">
        <SeoHead title="Product Not Found | The Archivist" />
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Product not found</p>
        <Link href={`/categories/${slug}`} className="btn-primary mt-6 inline-block hover:bg-transparent hover:text-crimson transition-colors">
          Back to Collection
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-screen-2xl py-8 animate-pulse">
        <SeoHead title="Loading... | The Archivist" />
        <div className="mb-6 h-4 w-48 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          <div className="space-y-6">
            <div className="h-4 w-24 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="h-8 w-3/4 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="h-8 w-1/3 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-5/6 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
              <div className="h-4 w-2/3 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
            </div>
            <div className="h-12 w-40 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const displayImage = selectedImage || productImages[0] || product.image;
  const wishlisted = isWishlisted(product.id);
  const productTitle = `${product.name} | The Archivist`;

  return (
    <div className="mx-auto max-w-screen-2xl py-8">
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <SeoHead
        title={productTitle}
        description={product.description?.slice(0, 160) || `${product.name} — ${categoryName} premium figurine.`}
        canonical={`https://thearchivist.com/categories/${slug}/${productId}`}
        jsonLd={{
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: displayImage,
          sku: productId,
          brand: { "@type": "Brand", name: categoryName },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `https://thearchivist.com/categories/${slug}/${productId}`,
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://thearchivist.com" },
              { "@type": "ListItem", position: 2, name: categoryName, item: `https://thearchivist.com/categories/${slug}` },
              { "@type": "ListItem", position: 3, name: product.name },
            ],
          },
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
        >
          Home
        </Link>
        <span className="mx-2 text-xs text-dark-text-secondary">/</span>
        <Link
          href={`/categories/${slug}`}
          className="text-xs font-medium uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
        >
          {categoryName}
        </Link>
        <span className="mx-2 text-xs text-dark-text-secondary">/</span>
        <span className="text-xs text-dark-text-secondary">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-gray-100">
            <Image
              src={displayImage}
              alt={`${product.name} — ${categoryName} premium figurine`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {productImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(url)}
                  className={`shrink-0 relative w-16 h-16 border-2 overflow-hidden transition-colors ${
                    selectedImage === url
                      ? "border-crimson"
                      : "border-dark-border/50 dark:border-dark-border/50 border-light-border/50 hover:border-crimson/50"
                  }`}
                >
                  <Image src={url} alt={`${product?.name || "Product"} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-crimson">
                {categoryName}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <button
              onClick={() =>
                toggleItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  inStock: product.inStock,
                  category: product.category,
                })
              }
              className={`flex h-10 w-10 shrink-0 items-center justify-center border transition-colors
                ${wishlisted
                  ? "border-crimson bg-crimson text-white"
                  : "border-dark-border dark:border-dark-border border-light-border text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:border-crimson hover:text-crimson"
                }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-crimson">
              ${product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-lg text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary line-through">
                ${product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <p className="text-sm leading-relaxed text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            {product.description}
          </p>

          {product.inStock ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-500">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              In Stock
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-crimson">
              <span className="h-2 w-2 rounded-full bg-crimson" />
              Sold Out
            </div>
          )}

          {product.inStock && (
            <div className="flex items-center border border-dark-border dark:border-dark-border border-light-border">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center text-sm transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100">&minus;</button>
              <span className="flex h-10 w-12 items-center justify-center text-sm font-bold border-x border-dark-border dark:border-dark-border border-light-border">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center text-sm transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100">+</button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              disabled={!product.inStock}
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity,
                });
                setQuantity(1);
              }}
              className="btn-primary hover:bg-transparent hover:text-crimson transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </button>

            {product.inStock && (
              <button
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity,
                  });
                  setQuantity(1);
                  window.location.href = "/checkout";
                }}
                className="border border-crimson bg-crimson/10 text-crimson px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-crimson hover:text-white transition-colors"
              >
                Order Directly
              </button>
            )}
          </div>

          {product.material && (
            <div className="hidden md:block border-t border-dark-border/30 dark:border-dark-border/30 border-light-border/30 pt-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                Details
              </h4>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {product.material && (
                  <div>
                    <dt className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">Material</dt>
                    <dd className="font-medium text-dark-text dark:text-dark-text text-light-text">{product.material}</dd>
                  </div>
                )}
                {product.scale && (
                  <div>
                    <dt className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">Scale</dt>
                    <dd className="font-medium text-dark-text dark:text-dark-text text-light-text">{product.scale}</dd>
                  </div>
                )}
                {product.edition && (
                  <div>
                    <dt className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">Edition</dt>
                    <dd className="font-medium text-dark-text dark:text-dark-text text-light-text">{product.edition}</dd>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <dt className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">Weight</dt>
                    <dd className="font-medium text-dark-text dark:text-dark-text text-light-text">{product.weight}</dd>
                  </div>
                )}
                {product.height && (
                  <div>
                    <dt className="text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">Height</dt>
                    <dd className="font-medium text-dark-text dark:text-dark-text text-light-text">{product.height}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {product.material && (
            <div className="md:hidden -mx-5 lg:-mx-16 bg-crimson px-5 py-4 text-white">
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/80">Details</h4>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {product.material && (
                  <div className="flex justify-between">
                    <dt className="text-white/70 text-[10px] uppercase tracking-wider">Material</dt>
                    <dd className="font-medium text-right">{product.material}</dd>
                  </div>
                )}
                {product.scale && (
                  <div className="flex justify-between">
                    <dt className="text-white/70 text-[10px] uppercase tracking-wider">Scale</dt>
                    <dd className="font-medium text-right">{product.scale}</dd>
                  </div>
                )}
                {product.edition && (
                  <div className="flex justify-between">
                    <dt className="text-white/70 text-[10px] uppercase tracking-wider">Edition</dt>
                    <dd className="font-medium text-right">{product.edition}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <dt className="text-white/70 text-[10px] uppercase tracking-wider">Weight</dt>
                    <dd className="font-medium text-right">{product.weight}</dd>
                  </div>
                )}
                {product.height && (
                  <div className="flex justify-between">
                    <dt className="text-white/70 text-[10px] uppercase tracking-wider">Height</dt>
                    <dd className="font-medium text-right">{product.height}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="border-t border-dark-border/30 dark:border-dark-border/30 border-light-border/30 pt-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                Features
              </h4>
              <ul className="space-y-1">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark-text dark:text-dark-text text-light-text">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="md:hidden space-y-2 text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary leading-relaxed pt-4 border-t border-dark-border/30 dark:border-dark-border/30 border-light-border/30">
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>When you order, a download code and receipt are automatically generated.</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              <span>Track your order anytime in the <Link href="/track-order" className="text-crimson font-medium underline">Track Order</Link> section.</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span>Shipping arrives in less than 6 days.</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>For any inquiry, contact us through the <button onClick={() => setContactOpen(true)} className="text-crimson font-medium underline">Contact</button> link.</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-heading text-2xl font-bold">
            More from <span className="text-crimson">this collection</span>
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
