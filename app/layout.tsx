import type { Metadata } from "next";
import "./globals.css";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "HONEY SURGICALS – Surgical Products Catalog",
    template: "%s | HONEY SURGICALS"
  },
  description: siteConfig.description,
  openGraph: {
    title: "HONEY SURGICALS",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "HONEY SURGICALS",
    locale: "en_IN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
