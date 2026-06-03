"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary">
        {active ? <Image src={active.url} alt={active.alt || productName} fill priority className="object-cover" /> : null}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(image)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border bg-secondary focus-ring",
              active?.id === image.id ? "border-primary" : "border-border"
            )}
            aria-label={`Show ${image.alt || productName}`}
          >
            <Image src={image.url} alt={image.alt || productName} fill sizes="100px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
