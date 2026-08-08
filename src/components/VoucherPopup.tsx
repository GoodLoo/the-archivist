"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface VoucherCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expires_at: string | null;
  status: "active" | "reserved" | "used";
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

function uuidv4() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const bytes = (() => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      return crypto.getRandomValues(new Uint8Array(16));
    }
    const b = new Uint8Array(16);
    for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
    return b;
  })();
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getDeviceId() {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let id = sessionStorage.getItem("voucher_device_id");
  if (!id || !uuidRe.test(id)) {
    id = uuidv4();
    sessionStorage.setItem("voucher_device_id", id);
  }
  return id;
}

export default function VoucherPopup() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [stage, setStage] = useState<"idle" | "loading" | "revealed" | "unavailable" | "closed">("idle");
  const [code, setCode] = useState<VoucherCode | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isHome = pathname === "/";
  const isProductPage = /^\/categories\/[^/]+\/[^/]+$/.test(pathname);
  const isPopupPage = isHome || isProductPage;
  const seenKey = isHome ? "voucher_popup_seen_home" : isProductPage ? "voucher_popup_seen_product" : "";

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setStage("idle");
    }
  }, [pathname]);

  useEffect(() => {
    const cached = sessionStorage.getItem("voucher_revealed");
    if (cached) {
      try {
        setCode(JSON.parse(cached));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (stage !== "idle") return;
    if (!isPopupPage || !seenKey) return;
    if (sessionStorage.getItem(seenKey)) return;

    const t = setTimeout(async () => {
      sessionStorage.setItem(seenKey, "1");
      setStage("loading");
      const cachedRaw = sessionStorage.getItem("voucher_revealed");
      if (cachedRaw) {
        try {
          setCode(JSON.parse(cachedRaw));
          setStage("revealed");
          return;
        } catch {}
      }
      try {
        const res = await fetch("/api/vouchers/reveal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId: getDeviceId() }),
        });
        const data = await res.json();
        if (res.ok && data.code) {
          sessionStorage.setItem("voucher_revealed", JSON.stringify(data.code));
          setCode(data.code);
          setStage("revealed");
        } else {
          setErrorMsg(data.error || "No vouchers available right now. Check back soon!");
          setStage("unavailable");
        }
      } catch {
        setErrorMsg("Failed to load your voucher code. Please try again.");
        setStage("unavailable");
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [stage, pathname, isPopupPage, seenKey]);

  const showLabel = !!code && pathname !== "/checkout";
  const closeAll = () => setStage("closed");

  if (stage === "idle" || stage === "closed") {
    if (!showLabel) return null;
    return (
      <button
        onClick={() => setStage("revealed")}
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
      <div className="fixed left-1/2 top-1/2 z-[81] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-crimson/40 bg-white p-5 dark:bg-dark-bg sm:max-w-md sm:p-8">
        <button
          onClick={closeAll}
          disabled={stage === "loading"}
          className="absolute right-3 top-3 text-dark-text-secondary transition-colors hover:text-crimson disabled:opacity-40 sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {stage === "loading" && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
            <p className="text-sm text-dark-text-secondary">Reserving your voucher code...</p>
          </div>
        )}

        {stage === "revealed" && code && (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center bg-crimson/10 sm:h-14 sm:w-14">
              <svg className="h-6 w-6 text-crimson sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <p className="mb-2 font-heading text-[9px] font-bold uppercase tracking-widest text-crimson sm:text-[10px]">Limited Time Offer</p>

            <div className="mx-auto mb-3 w-fit rounded-lg border-2 border-crimson bg-crimson/10 px-6 py-2 sm:mb-4 sm:px-8 sm:py-3">
              <p className="font-heading text-3xl font-black tracking-tight text-crimson sm:text-4xl">
                {code.type === "percentage" ? `${code.value}% OFF` : `$${Number(code.value).toFixed(2)} OFF`}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-text-secondary sm:text-xs">
                Any purchase
              </p>
            </div>

            <p className="mb-3 text-xs leading-snug text-gray-500 dark:text-dark-text-secondary sm:mb-4 sm:text-sm">
              No sign up needed. Copy your code and use it at checkout to save on your order.
            </p>
            <div className="mx-auto mb-3 flex max-w-xs items-center justify-between gap-3 border border-dashed border-crimson bg-crimson/5 px-3 py-2.5 sm:mb-4 sm:px-4 sm:py-3">
              <span className="font-heading text-lg font-extrabold tracking-widest text-crimson sm:text-xl">{code.code}</span>
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
              <p className="mb-3 text-[11px] text-dark-text-secondary sm:mb-4 sm:text-xs">
                Expires {new Date(code.expires_at).toLocaleDateString()}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Link href="/categories" onClick={closeAll} className="btn-primary w-full py-2.5 text-center text-sm">
                Start Shopping
              </Link>
              <button onClick={closeAll} className="w-full py-1.5 text-xs font-medium text-dark-text-secondary transition-colors hover:text-crimson">
                Close
              </button>
            </div>
          </div>
        )}

        {stage === "unavailable" && (
          <div className="text-center">
            <h2 className="mb-2 font-heading text-2xl font-extrabold tracking-tight text-gray-900 dark:text-dark-text">
              {errorMsg || "No vouchers available"}
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
