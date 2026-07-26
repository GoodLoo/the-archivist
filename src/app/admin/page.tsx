"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then((r) => r.json())
      .then((d) => {
        setIsSetup(!d.hasAdmins);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    if (isSetup) {
      const res = await fetch("/api/admin/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Setup failed");
        return;
      }
    }

    const success = await login(email, password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg dark:bg-dark-bg bg-gray-50">
        <p className="text-sm text-dark-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg dark:bg-dark-bg bg-gray-50 px-5">
      <div className="w-full max-w-sm">
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-8">
          <div className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              <span className="text-crimson">ARCHIVIST</span>
            </h1>
            <p className="mt-1 text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 uppercase tracking-wider font-medium">
              Admin Panel
            </p>
            {isSetup && (
              <p className="mt-2 text-[10px] text-green-500 font-medium uppercase tracking-wider">
                First-time setup — you will be super admin
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {error && (
              <p className="text-xs text-crimson font-medium">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full hover:bg-transparent hover:text-crimson transition-colors">
              {isSetup ? "Create Super Admin" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
