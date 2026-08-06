"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface ClaimedCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expires_at: string | null;
  status: "active" | "reserved" | "used";
}

function cacheKey(userId: string) {
  return `voucher_${userId}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function VoucherPopup() {
  const { user } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [stage, setStage] = useState<"idle" | "offer" | "loading" | "claimed" | "unavailable" | "closed">("idle");
  const [code, setCode] = useState<ClaimedCode | null>(null);
  const [copied, setCopied] = useState(false);
  const [claimError, setClaimError] = useState("");

  const isHome = pathname === "/";
  const isProductPage = /^\/categories\/[^/]+\/[^/]+$/.test(pathname);
  const isPopupPage = isHome || isProductPage;
  const guestSeenKey = isHome ? "voucher_popup_seen_home" : isProductPage ? "voucher_popup_seen_product" : "";
  const isUsableCode =
    !!code &&
    (code.status === "reserved" || code.status === "active") &&
    (!code.expires_at || new Date(code.expires_at) > new Date());

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setStage("idle");
    }
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    const key = cacheKey(user.id);
    const cachedRaw = sessionStorage.getItem(key);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached.id) setCode(cached);
      } catch {}
      return;
    }
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      try {
        const res = await fetch("/api/vouchers/claim", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.code) {
          const c = data.code;
          if (c.status === "used" || (c.expires_at && new Date(c.expires_at) < new Date())) {
            sessionStorage.setItem(key, JSON.stringify({ status: "used" }));
          } else {
            sessionStorage.setItem(key, JSON.stringify(c));
            setCode(c);
          }
        } else if (res.status === 404) {
          sessionStorage.setItem(key, JSON.stringify({ status: "none" }));
        }
      } catch {}
    })();
  }, [user]);

  useEffect(() => {
    if (stage !== "idle") return;
    if (!isPopupPage || !guestSeenKey) return;
    if (user) return;
    if (sessionStorage.getItem(guestSeenKey)) return;

    const t = setTimeout(() => {
      sessionStorage.setItem(guestSeenKey, "1");
      setStage("offer");
    }, 2500);
    return () => clearTimeout(t);
  }, [stage, pathname, user, isPopupPage, guestSeenKey]);

  useEffect(() => {
    if (stage !== "idle") return;
    if (!isPopupPage) return;
    if (!user || !isUsableCode) return;
    if (localStorage.getItem("voucher_popup_seen_once")) return;

    const t = setTimeout(() => {
      localStorage.setItem("voucher_popup_seen_once", "1");
      setStage("claimed");
    }, 2500);
    return () => clearTimeout(t);
  }, [stage, pathname, user, isUsableCode, isPopupPage]);

  const showLabel = !!user && isUsableCode && pathname !== "/checkout";

  const dismissOffer = () => {
    sessionStorage.setItem("voucher_offer_dismissed", "1");
    setStage("closed");
  };

  const closeAll = () => setStage("closed");

  if (stage === "idle" || stage === "closed") {
    if (!showLabel) return null;
    return (
      <button
        onClick={() => setStage("claimed")}
        className="fixed right-3 top-16 z-[70] flex items-center gap-1.5 border border-crimson/40 bg-white px-2.5 py-1 text-[11px] font-semibold text-crimson shadow-md transition-colors hover:border-crimson md:right-5 md:top-20 dark:bg-dark-bg"
        aria-label="View your voucher code"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        Voucher: {code?.code}
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={stage === "loading" ? undefined : closeAll} />
      <div className="fixed left-1/2 top-1/2 z-[81] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 border border-crimson/40 bg-white p-6 dark:bg-dark-bg sm:p-8">
        <button
          onClick={closeAll}
          disabled={stage === "loading"}
          className="absolute right-4 top-4 text-dark-text-secondary transition-colors hover:text-crimson disabled:opacity-40"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {stage === "offer" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-crimson/10">
              <svg className="h-7 w-7 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <p className="mb-1 font-heading text-[10px] font-bold uppercase tracking-widest text-crimson">Limited Time Offer</p>
            <h2 className="mb-2 font-heading text-2xl font-extrabold tracking-tight text-gray-900 dark:text-dark-text">
              Get a <span className="text-crimson">Voucher</span> Code
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-dark-text-secondary">
              Create a free account and we&apos;ll reserve an exclusive discount code just for you.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/signup?next=/?voucher=1")}
                className="btn-primary w-full text-sm"
              >
                Create Account &amp; Get Code
              </button>
              <button onClick={dismissOffer} className="w-full py-2 text-xs font-medium text-dark-text-secondary transition-colors hover:text-crimson">
                No thanks, continue browsing
              </button>
            </div>
          </div>
        )}

        {stage === "loading" && (
          <div className="py-10 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
            <p className="text-sm text-dark-text-secondary">Reserving your voucher code...</p>
          </div>
        )}

        {stage === "claimed" && code && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-green-500/10">
              <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mb-1 font-heading text-[10px] font-bold uppercase tracking-widest text-green-500">Voucher Reserved</p>
            <h2 className="mb-1 font-heading text-2xl font-extrabold tracking-tight text-gray-900 dark:text-dark-text">
              Your Voucher Code
            </h2>
            <p className="mb-5 text-sm text-gray-500 dark:text-dark-text-secondary">
              Use this code at checkout for{" "}
              {code.type === "percentage" ? `${code.value}% off` : `$${Number(code.value).toFixed(2)} off`}{" "}
              your order.
            </p>
            <div className="mx-auto mb-5 flex max-w-xs items-center justify-between gap-3 border border-dashed border-crimson bg-crimson/5 px-4 py-3">
              <span className="font-heading text-xl font-extrabold tracking-widest text-crimson">{code.code}</span>
              <button
                onClick={async () => {
                  if (await copyToClipboard(code.code)) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }
                }}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-crimson transition-colors hover:bg-crimson/10"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            {code.expires_at && (
              <p className="mb-5 text-xs text-dark-text-secondary">
                Expires {new Date(code.expires_at).toLocaleDateString()}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Link href="/categories" onClick={closeAll} className="btn-primary w-full text-center text-sm">
                Start Shopping
              </Link>
              <button onClick={closeAll} className="w-full py-2 text-xs font-medium text-dark-text-secondary transition-colors hover:text-crimson">
                Close
              </button>
            </div>
          </div>
        )}

        {stage === "unavailable" && (
          <div className="text-center">
            <h2 className="mb-2 font-heading text-2xl font-extrabold tracking-tight text-gray-900 dark:text-dark-text">
              {claimError || "No vouchers available"}
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-dark-text-secondary">
              All current vouchers have been claimed. Check back soon.
            </p>
            <button onClick={closeAll} className="btn-primary w-full text-sm">
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}
