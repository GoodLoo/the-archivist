"use client";

import { useEffect, useState } from "react";

interface ContactInfo {
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  whatsappPhone: string;
}

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [info, setInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    if (open && !info) {
      fetch("/api/admin/settings")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.storeName) setInfo(data);
        })
        .catch(() => {});
    }
  }, [open, info]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[71] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-dark-border dark:border-dark-border border-gray-200 bg-dark-bg dark:bg-dark-bg bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-crimson">Contact Us</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-crimson transition-colors" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {info ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <div>
                <p className="font-medium text-dark-text dark:text-dark-text text-gray-900">{info.storePhone}</p>
                <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mt-0.5">{info.whatsappPhone ? `WhatsApp: ${info.whatsappPhone}` : ""}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <div>
                <p className="font-medium text-dark-text dark:text-dark-text text-gray-900">{info.storeEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <div>
                <p className="font-medium text-dark-text dark:text-dark-text text-gray-900">{info.storeAddress}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-3/4 bg-dark-border/30 rounded" />
            <div className="h-4 w-1/2 bg-dark-border/30 rounded" />
            <div className="h-4 w-2/3 bg-dark-border/30 rounded" />
          </div>
        )}
      </div>
    </>
  );
}
