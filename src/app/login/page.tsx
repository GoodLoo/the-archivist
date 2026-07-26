"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import SeoHead from "@/components/SeoHead";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await login(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
      <div className="w-full">
        <SeoHead title="Sign In | The Archivist" description="Sign in to your The Archivist account to manage orders and your wishlist." />
        <Image src="/favicon.ico" alt="The Archivist" width={48} height={48} className="mx-auto mb-6 h-12 w-12" />
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">
          Welcome <span className="text-crimson">Back</span>
        </h1>
        <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Sign in to your account to view orders and manage your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="font-medium text-crimson hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-crimson hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
