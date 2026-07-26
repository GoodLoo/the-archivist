"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import SeoHead from "@/components/SeoHead";

export default function ForgotPasswordPage() {
  const { resetPassword } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await resetPassword(email);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
        <div className="w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">Check Your <span className="text-crimson">Email</span></h1>
          <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            We&apos;ve sent a password reset link to <strong className="text-dark-text dark:text-dark-text text-gray-900">{email}</strong>. Please check your inbox and follow the instructions.
          </p>
          <Link href="/login" className="text-sm font-medium text-crimson hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
      <SeoHead title="Reset Password | The Archivist" description="Reset your The Archivist account password." />
      <div className="w-full">
        <Image src="/favicon.ico" alt="The Archivist" width={48} height={48} className="mx-auto mb-6 h-12 w-12" />
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">
          Reset Your <span className="text-crimson">Password</span>
        </h1>
        <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Enter your email address and we&apos;ll send you a link to reset your password.
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

          {error && (
            <p className="text-sm font-medium text-crimson">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full hover:bg-transparent hover:text-crimson transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-crimson hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
