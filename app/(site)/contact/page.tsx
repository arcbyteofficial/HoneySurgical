import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/catalog/inquiry-form";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact HONEY SURGICALS for surgical product quotes and procurement support."
};

export default function ContactPage() {
  return (
    <section className="bg-white">
      <div className="container grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid content-start gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Contact HONEY SURGICALS</h1>
            <p className="mt-2 text-muted-foreground">
              Share your product, brand, quantity, and delivery requirements with the sales team.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-border bg-medical-pale p-5">
            <a className="flex items-center gap-3 hover:text-primary" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
              <Phone className="size-5" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <a className="flex items-center gap-3 hover:text-primary" href={`mailto:${siteConfig.email}`}>
              <Mail className="size-5" aria-hidden="true" />
              {siteConfig.email}
            </a>
            <a className="flex items-center gap-3 hover:text-primary" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" aria-hidden="true" />
              WhatsApp Sales
            </a>
            <a className="flex items-start gap-3 hover:text-primary" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin className="mt-0.5 size-5" aria-hidden="true" />
              {siteConfig.address}
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-secondary">
            <iframe
              title="HONEY SURGICALS map"
              src="https://www.google.com/maps?q=HONEY%20SURGICALS%20medical%20supplier&output=embed"
              className="h-72 w-full"
              loading="lazy"
            />
          </div>
          <Button asChild className="w-fit">
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" />
              Start WhatsApp Chat
            </a>
          </Button>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
