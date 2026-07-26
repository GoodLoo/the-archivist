"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

export default function CategoryDropdown({ mobile, onNavClick }: { mobile?: boolean; onNavClick?: () => void }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (mobile) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobile]);

  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <button className="flex w-full items-center justify-between py-1 text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson">
          Categories
          <svg className={`h-4 w-4 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        <div className="flex flex-col gap-1 pl-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="py-1 text-sm text-dark-text-secondary hover:text-crimson"
                onClick={onNavClick}
              >
                {cat.id}. {cat.name}
              </Link>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
      >
        Categories
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 border border-dark-border dark:border-dark-border border-light-border bg-dark-bg dark:bg-dark-bg bg-light-bg shadow-xl">
          <div className="grid grid-cols-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-3 border-b border-dark-border/50 dark:border-dark-border/50 border-light-border/50 px-4 py-3 text-sm transition-colors hover:bg-dark-surface dark:hover:bg-dark-surface hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center border border-dark-border dark:border-dark-border border-light-border text-xs font-bold text-crimson">
                  {cat.id}
                </span>
                <div>
                  <div className="font-medium text-dark-text dark:text-dark-text text-light-text">{cat.name}</div>
                  <div className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">{cat.productCount} items</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
