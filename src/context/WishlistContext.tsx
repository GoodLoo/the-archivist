"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  count: number;
  loaded: boolean;
}

const STORAGE_KEY = "archivist_wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isWishlisted = (id: string) => items.some((i) => i.id === id);

  const toggleItem = (item: WishlistItem) => {
    if (isWishlisted(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, toggleItem, count, loaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
