import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import SiteLayout from "@/components/SiteLayout";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://thearchivist.com";
const siteName = "The Archivist";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Archivist — Premium Figurine Collection",
    template: "%s | The Archivist",
  },
  description:
    "Discover curated premium figurines from Marvel, DC, Star Wars, Anime, Gaming, and more. Official licensed collectibles with worldwide shipping.",
  keywords: ["premium figurines", "collectibles", "marvel statues", "dc statues", "anime figures", "star wars collectibles", "limited edition figurines"],
  authors: [{ name: "The Archivist" }],
  creator: "The Archivist",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "The Archivist — Premium Figurine Collection",
    description:
      "Discover curated premium figurines from Marvel, DC, Star Wars, Anime, Gaming, and more. Official licensed collectibles with worldwide shipping.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Archivist — Premium Figurine Vault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Archivist — Premium Figurine Collection",
    description:
      "Discover curated premium figurines from Marvel, DC, Star Wars, Anime, Gaming, and more.",
    images: ["/og-image.jpg"],
    creator: "@thearchivist",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-dark-bg text-dark-text dark:bg-dark-bg dark:text-dark-text bg-light-bg text-light-text`}
      >
        <JsonLd />
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <CustomerAuthProvider>
                <SiteLayout>
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </SiteLayout>
              </CustomerAuthProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
