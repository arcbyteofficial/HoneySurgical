import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { primaryNav, siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.3fr_0.8fr_1fr]">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="HONEY SURGICALS Logo"
              width={48}
              height={48}
              className="rounded-md object-contain"
            />
            <span>
              <span className="block font-bold" style={{ color: "#1A3A5C" }}>HONEY SURGICALS</span>
              <span className="text-sm text-muted-foreground">Surgical Products Catalog</span>
            </span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Surgical disposables, equipment, diagnostics, hospital furniture, infection control,
            and rehabilitation supplies for hospitals, clinics, and healthcare teams.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>

        {/* Browse Column */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-normal text-muted-foreground">Browse</h2>
          <nav className="mt-4 grid gap-2" aria-label="Footer navigation">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm hover:text-primary focus-ring">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Column */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-normal text-muted-foreground">Contact</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <a className="flex items-start gap-3 hover:text-primary" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <a className="flex items-start gap-3 hover:text-primary" href={`mailto:${siteConfig.email}`}>
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {siteConfig.email}
            </a>
            <a className="flex items-start gap-3 hover:text-primary" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {siteConfig.address}
            </a>
          </div>
        </div>
      </div>

      <Separator />

      {/* Admin Portal strip */}
      <div className="container flex items-center justify-between py-3">
        <span className="text-xs text-muted-foreground/70">Internal Access</span>
        <Link
          href="/admin/login"
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors focus-ring"
          aria-label="Admin portal login"
        >
          <Lock className="size-3" aria-hidden="true" />
          Admin Portal
        </Link>
      </div>

      <Separator />

      <div className="container flex flex-col gap-2 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} HONEY SURGICALS. All rights reserved.</span>
        <span>Catalog and inquiry platform. No cart, checkout, or order tracking.</span>
      </div>
    </footer>
  );
}
