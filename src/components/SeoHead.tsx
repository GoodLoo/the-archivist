"use client";

import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SeoHead({ title, description, canonical, jsonLd }: SeoHeadProps) {
  useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.id = "seo-jsonld";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        ...jsonLd,
      });
      const existing = document.getElementById("seo-jsonld");
      if (existing) existing.remove();
      document.head.appendChild(script);
    }

    return () => {
      const existing = document.getElementById("seo-jsonld");
      if (existing) existing.remove();
    };
  }, [title, description, canonical, jsonLd]);

  return null;
}
