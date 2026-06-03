import { siteConfig } from "@/lib/config/site";

export function OrganizationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: siteConfig.address,
    sameAs: [`https://wa.me/${siteConfig.whatsapp}`]
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
