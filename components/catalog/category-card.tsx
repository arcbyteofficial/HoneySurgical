import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group grid overflow-hidden rounded-lg border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="grid gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-semibold">{category.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          View products
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
