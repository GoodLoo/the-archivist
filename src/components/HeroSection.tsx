"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface HeroSlide {
  imageUrl: string;
  linkUrl: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSlides(data);
      });
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const hasCarousel = slides.length > 0;

  return (
    <section className="relative mx-auto max-w-screen-2xl">
      {hasCarousel && (
        <div className="absolute inset-0 -mx-5 lg:-mx-16">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              {slide.linkUrl ? (
                <Link href={slide.linkUrl} className="relative block w-full h-full">
                  <Image src={slide.imageUrl} alt="" fill className="object-cover" sizes="100vw" priority={i === 0} />
                </Link>
              ) : (
                <div className="relative w-full h-full">
                  <Image src={slide.imageUrl} alt="" fill className="object-cover" sizes="100vw" priority={i === 0} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/70 via-dark-bg/40 via-dark-bg/10 to-transparent dark:from-dark-bg/70 dark:via-dark-bg/40 dark:via-dark-bg/10 dark:to-transparent from-white/40 via-white/20 to-transparent" />
            </div>
          ))}
        </div>
      )}

      <div className="relative grid min-h-[70vh] items-end lg:items-center gap-8 lg:grid-cols-2 px-5 lg:px-16 pb-6 lg:pb-0">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 pt-2 sm:pt-3 lg:pt-5 pb-2 sm:pb-3 lg:pb-5 lg:my-12 px-3 sm:px-5 -mx-3 sm:-mx-5 bg-white/50 backdrop-blur-[2px] dark:bg-dark-bg/70 dark:backdrop-blur-[2px]">
          <h1 className="font-heading text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
            Enter The
            <br />
            <span className="text-crimson">Vault</span>
          </h1>
          <p className="max-w-md text-xs sm:text-sm lg:text-base leading-relaxed text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Discover a curated archive of premium figurines from the greatest
            universes ever created. Every piece tells a story. Every collectible
            is a treasure.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <Link href="/categories" className="btn-primary text-center text-xs sm:text-sm lg:text-base px-2 sm:px-3 py-3 sm:py-4 hover:bg-transparent hover:text-crimson transition-colors">
              Shop All
            </Link>
            <Link href="/categories/marvel-multiverse" className="btn-outline text-center text-xs sm:text-sm lg:text-base px-2 sm:px-3 py-3 sm:py-4 hover:bg-dark-text hover:text-dark-bg dark:hover:bg-dark-text dark:hover:text-dark-bg hover:bg-gray-900 hover:text-white transition-colors">
              Explore Collection
            </Link>
          </div>
        </div>

        {!hasCarousel && (
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden border border-dark-border dark:border-dark-border border-light-border">
              <div className="absolute inset-0 bg-gradient-to-tr from-dark-bg via-transparent to-transparent dark:from-dark-bg via-transparent to-transparent from-white via-transparent to-transparent z-10" />
              <Image
                src="https://placehold.co/600x800/DC143C/ffffff?text=Featured+Figurine"
                alt="Featured premium figurine"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 bg-dark-bg/80 dark:bg-dark-bg/80 bg-white/80 p-4 backdrop-blur-sm">
                <p className="font-heading text-sm font-bold uppercase tracking-wider">
                  Featured: <span className="text-crimson">Iron Man Mark III</span>
                </p>
                <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
                  Marvel Multiverse — Limited Edition
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasCarousel && slides.length > 1 && (
        <div className="relative flex justify-center gap-2 pb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all ${i === current ? "w-6 bg-crimson" : "w-1.5 bg-dark-text-secondary/50 dark:bg-dark-text-secondary/50 bg-gray-400/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
