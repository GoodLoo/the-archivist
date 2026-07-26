"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import CategoryDropdown from "./CategoryDropdown";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user } = useCustomerAuth();
  const isAdmin = pathname.startsWith("/admin");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const onToggleMobile = () => setMobileOpen((p) => !p);
  const onCloseMobile = () => setMobileOpen(false);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && (
        <>
          <Header mobileOpen={mobileOpen} onToggleMobile={onToggleMobile} onCloseMobile={onCloseMobile} />
          <div className="storefront pt-16 md:pt-20 px-5 lg:px-16" style={{ zoom: 0.9 }}>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </>
      )}
      {isAdmin && (
        <main className="flex-1">{children}</main>
      )}

      {!isAdmin && mobileOpen && (
        <div className="fixed inset-0 z-[55] bg-black/50 md:hidden" onClick={onCloseMobile} />
      )}
      {!isAdmin && mobileOpen && (
        <div className="fixed inset-y-0 right-0 z-[60] w-72 border-l border-dark-border/50 dark:border-dark-border/50 bg-dark-bg dark:bg-dark-bg bg-white shadow-xl transform transition-transform duration-300 md:hidden translate-x-0">
          <div className="flex h-16 items-center justify-between border-b border-dark-border/50 dark:border-dark-border/50 px-5">
            <div className="flex items-center gap-2">
              <Link href={user ? "/account" : "/login"} onClick={onCloseMobile} className="flex h-8 w-8 items-center justify-center border border-dark-border/40 dark:border-dark-border/40 transition-colors hover:text-crimson" aria-label="Account">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
              <span className="text-xs font-bold tracking-tight text-dark-text-secondary uppercase">Menu</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="flex h-9 w-9 items-center justify-center text-dark-text-secondary hover:text-crimson transition-colors"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 overflow-y-auto p-5">
            <Link
              href="/categories"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Shop All
            </Link>
            <CategoryDropdown mobile onNavClick={onCloseMobile} />
            <Link
              href="/wishlist"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Cart
            </Link>
            <Link
              href="/track-order"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Track Order
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Blog
            </Link>
            <Link
              href="/account"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Account
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson"
              onClick={onCloseMobile}
            >
              Sign In
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-medium text-dark-text-secondary transition-colors hover:text-crimson mt-3 pt-3 border-t border-dark-border/50 dark:border-dark-border/50"
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
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </nav>
        </div>
      )}

      {!isAdmin && itemCount > 0 && pathname !== "/checkout" && (
        <Link
          href="/checkout"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 btn-primary shadow-lg hover:bg-crimson hover:text-white transition-all md:hidden"
        >
          Proceed to Checkout ({itemCount})
        </Link>
      )}
    </>
  );
}
