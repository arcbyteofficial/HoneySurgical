import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompareToggle } from "@/components/catalog/compare-toggle";
import type { Product } from "@/lib/types/catalog";
import { siteConfig } from "@/lib/config/site";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const whatsappText = encodeURIComponent(
    `Hello HONEY SURGICALS, I would like information regarding ${product.name}`
  );

  return (
    <article className="grid overflow-hidden rounded-lg border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-secondary focus-ring">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </Link>
      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge variant="beige" className="mb-2">
              {product.category.name}
            </Badge>
            <Link href={`/products/${product.slug}`} className="focus-ring">
              <h3 className="line-clamp-2 min-h-12 font-semibold leading-6">{product.name}</h3>
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">{product.sku}</p>
          </div>
          <CompareToggle productSlug={product.slug} productName={product.name}>
            <Scale aria-hidden="true" />
          </CompareToggle>
        </div>
        <p className="line-clamp-2 min-h-11 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-base font-bold text-medical-deep">{formatCurrency(product.price)}</span>
          <span className="text-xs text-muted-foreground">{product.brand.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappText}`} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" />
              WhatsApp
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href={`/products/${product.slug}#inquiry`}>
              Quote
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
