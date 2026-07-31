"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface CustomerAuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message || null;
    } catch (err: any) {
      return err?.message || "Unable to sign in. Please try again.";
    }
  };

  const signup = async (email: string, password: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return error.message || "Unable to create account. Please try again.";
      if (!data.user && !data.session) {
        return "Account created but we couldn't send the confirmation email. Please contact support.";
      }
      return null;
    } catch (err: any) {
      return err?.message || "Unable to create account. Please try again.";
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return error?.message || null;
    } catch (err: any) {
      return err?.message || "Unable to send reset link. Please try again.";
    }
  };

  const updatePassword = async (password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return error?.message || null;
    } catch (err: any) {
      return err?.message || "Unable to update password. Please try again.";
    }
  };

  return (
    <CustomerAuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, updatePassword }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
