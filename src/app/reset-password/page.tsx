"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import SeoHead from "@/components/SeoHead";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setDone(true);
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
        <div className="w-full text-center">
          <h1 className="mb-4 font-heading text-3xl font-extrabold tracking-tight">Invalid <span className="text-crimson">Link</span></h1>
          <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/forgot-password" className="text-sm font-medium text-crimson hover:underline">
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
        <div className="w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">Password <span className="text-crimson">Updated</span></h1>
          <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Your password has been successfully reset.
          </p>
          <Link
            href="/login"
            className="btn-primary inline-block hover:bg-transparent hover:text-crimson transition-colors"
            onClick={() => supabase.auth.signOut()}
          >
            Sign In with New Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
      <div className="w-full">
        <Image src="/favicon.ico" alt="The Archivist" width={48} height={48} className="mx-auto mb-6 h-12 w-12" />
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">
          Set New <span className="text-crimson">Password</span>
        </h1>
        <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="input-field"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-crimson">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full hover:bg-transparent hover:text-crimson transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
