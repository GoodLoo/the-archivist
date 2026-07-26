"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  initialized: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin-auth");
      }
    }
    setInitialized(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const adminUser: AdminUser = { id: data.id, email: data.email, role: data.role };
      setUser(adminUser);
      localStorage.setItem("admin-auth", JSON.stringify(adminUser));
      localStorage.setItem("admin-token", data.token);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-token");
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated: !!user, initialized, user, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
