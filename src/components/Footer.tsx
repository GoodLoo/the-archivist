"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";
import ContactModal from "@/components/ContactModal";

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*, products!left(count)")
      .order("id")
      .then(({ data }) => {
        if (data) {
          setCategories(
            data.map((cat: any) => ({ ...cat, productCount: cat.products?.[0]?.count ?? 0 }))
          );
        }
      });
  }, []);

  return (
    <>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <footer className="border-t border-dark-border dark:border-dark-border border-light-border">
        <div className="mx-auto max-w-screen-2xl px-5 py-6 lg:px-16 lg:py-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4 lg:gap-6">
            <div className="col-span-2 lg:col-span-1">
              <h3 className="mb-2 flex items-center gap-2 font-heading text-lg font-bold">
                <Image src="/favicon.ico" alt="" width={24} height={24} className="h-6 w-6" />
                <span><span className="text-crimson">THE</span> ARCHIVIST</span>
              </h3>
              <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                Premium figurines from the worlds you love. Every piece is a curated artifact.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider lg:mb-3">Categories</h4>
              <ul className="space-y-1 lg:space-y-1.5">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider lg:mb-3">Quick Links</h4>
              <ul className="space-y-1 lg:space-y-1.5">
                <li>
                  <Link href="/track-order" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    FAQ
                  </Link>
                </li>
                <li>
                  <button onClick={() => setContactOpen(true)} className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h4 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider lg:mb-3">Connect</h4>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1 lg:block lg:space-y-1.5">
                <li>
                  <a href="https://twitter.com/thearchivist" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/thearchivist" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/@thearchivist" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/thearchivist" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 lg:mt-10 border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 pt-3 lg:pt-5 text-center text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>&copy; {new Date().getFullYear()} The Archivist. All rights reserved.</span>
              <Link href="/privacy-policy" className="transition-colors hover:text-crimson">Privacy Policy</Link>
              <Link href="/terms-of-service" className="transition-colors hover:text-crimson">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
