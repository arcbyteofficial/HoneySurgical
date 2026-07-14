import type { Metadata } from "next";
import "./globals.css";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "HONEY SURGICALS | Medical & Surgical Products Procurement Catalog",
    template: "%s | HONEY SURGICALS"
  },
  description: "Buy wholesale medical disposables, surgical instruments, hospital furniture, diagnostics, rehabilitation aids, and laboratory equipment. Premium quality sourcing for healthcare institutions.",
  keywords: [
    "surgical products",
    "medical supplies",
    "hospital furniture",
    "medical disposables",
    "surgical instruments",
    "laboratory equipment",
    "healthcare procurement",
    "diagnostics equipment",
    "wholesale medical supplies",
    "HONEY SURGICALS India"
  ],
  authors: [{ name: "HONEY SURGICALS" }],
  openGraph: {
    title: "HONEY SURGICALS | Medical & Surgical Products Catalog",
    description: "Surgical products catalog for hospitals, clinics, laboratories, and healthcare procurement teams. Request bulk quotes online.",
    url: siteConfig.url,
    siteName: "HONEY SURGICALS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 600,
        alt: "HONEY SURGICALS Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HONEY SURGICALS | Medical & Surgical Products Catalog",
    description: "Surgical products catalog for hospitals, clinics, laboratories, and healthcare procurement teams.",
    images: ["/logo.jpeg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
      </body>
    </html>
  );
}
