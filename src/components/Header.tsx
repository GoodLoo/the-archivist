"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useTheme } from "@/context/ThemeContext";
import CategoryDropdown from "./CategoryDropdown";

export default function Header({ mobileOpen, onToggleMobile, onCloseMobile }: { mobileOpen: boolean; onToggleMobile: () => void; onCloseMobile: () => void }) {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useCustomerAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-dark-border dark:border-dark-border border-light-border bg-dark-bg/95 dark:bg-dark-bg/95 bg-light-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 md:h-20 max-w-screen-2xl items-center justify-between pl-5 pr-3 md:px-5 lg:px-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/favicon.ico" alt="The Archivist" width={28} height={28} className="h-7 w-7 md:h-7 md:w-7" />
          <span className="font-heading text-sm sm:text-lg md:text-xl font-bold tracking-tight truncate">
            <span className="text-crimson">THE</span> ARCHIVIST
          </span>
        </Link>

        <div ref={searchContainerRef} className="hidden md:block mx-4 flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search figurines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="w-full border-b border-dark-border dark:border-dark-border border-light-border bg-transparent py-2 pr-8 text-sm text-dark-text dark:text-dark-text text-light-text placeholder:text-dark-text-secondary dark:placeholder:text-dark-text-secondary placeholder:text-light-text-secondary outline-none focus:border-crimson transition-colors"
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:text-crimson transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </form>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <CategoryDropdown />
          <Link
            href="/categories"
            className="text-sm font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
          >
            Shop All
          </Link>
          <Link
            href="/track-order"
            className="text-sm font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
          >
            Track Order
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
          >
            Blog
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            className="text-sm font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary transition-colors hover:text-crimson"
          >
            {user ? "Account" : "Sign In"}
          </Link>
        </nav>

        <div className="flex items-center gap-[2px]">
          <button
            onClick={() => { setSearchOpen(!searchOpen); if (!searchOpen) setTimeout(() => searchRef.current?.focus(), 100); }}
            className="flex h-9 w-9 md:h-8 md:w-8 items-center justify-center md:hidden border border-dark-border/40 dark:border-dark-border/40 border-light-border/40 active:bg-dark-border/20 dark:active:bg-dark-border/20 active:bg-light-border/20 transition-colors hover:text-crimson"
            aria-label="Search"
          >
            <svg className="h-4 w-4 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <Link href="/wishlist" className="relative flex h-9 w-9 md:h-8 md:w-8 items-center justify-center border border-dark-border/40 dark:border-dark-border/40 border-light-border/40 active:bg-dark-border/20 dark:active:bg-dark-border/20 active:bg-light-border/20 transition-colors hover:text-crimson" aria-label="Wishlist">
            <svg className="h-4 w-4 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative flex h-9 w-9 md:h-8 md:w-8 items-center justify-center border border-dark-border/40 dark:border-dark-border/40 border-light-border/40 active:bg-dark-border/20 dark:active:bg-dark-border/20 active:bg-light-border/20 transition-colors hover:text-crimson" aria-label="Cart">
            <svg className="h-4 w-4 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleTheme}
            className="hidden md:flex h-9 w-9 md:h-8 md:w-8 items-center justify-center border border-dark-border/40 dark:border-dark-border/40 border-light-border/40 active:bg-dark-border/20 dark:active:bg-dark-border/20 active:bg-light-border/20 transition-colors hover:text-crimson"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          <button
            onClick={onToggleMobile}
            className="ml-2 flex h-9 w-9 md:h-8 md:w-8 items-center justify-center md:hidden"
            aria-label="Menu"
          >
            <svg className="h-4 w-4 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 px-5 pb-3 pt-2 md:hidden">
          <form onSubmit={handleSearch}>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search figurines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-dark-border dark:border-dark-border border-light-border bg-transparent py-2 text-sm text-dark-text dark:text-dark-text text-light-text placeholder:text-dark-text-secondary dark:placeholder:text-dark-text-secondary placeholder:text-light-text-secondary outline-none focus:border-crimson transition-colors"
            />
          </form>
        </div>
      )}

    </header>
  );
}
