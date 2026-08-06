"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import SeoHead from "@/components/SeoHead";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const err = await signup(email, password);
    if (err && err.startsWith("Account created")) {
      setSuccess(err);
      setLoading(false);
    } else if (err) {
      setError(err);
      setLoading(false);
    } else {
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next || "/account");
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
      <SeoHead title="Create Account | The Archivist" description="Create your The Archivist account to save favorites, track orders, and shop premium figurines." />
      <div className="w-full">
        <Image src="/favicon.ico" alt="The Archivist" width={48} height={48} className="mx-auto mb-6 h-12 w-12" />
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">
          Create <span className="text-crimson">Account</span>
        </h1>
        <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Join The Archivist to track orders, save your address, and more.
        </p>

        {success ? (
          <div className="border border-green-500 bg-green-500/10 p-4">
            <p className="text-sm font-medium text-green-500">{success}</p>
            <Link href="/login" className="mt-3 inline-block text-sm font-medium text-crimson hover:underline">
              Go to Sign In
            </Link>
          </div>
        ) : (
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
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-crimson hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
