"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "@/lib/types/catalog";
import { formatCurrency } from "@/lib/utils";

const key = "honey-surgicals-compare";

export function ComparisonClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [localItems, setLocalItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      setLocalItems(JSON.parse(window.localStorage.getItem(key) || "[]"));
    } catch {
      setLocalItems([]);
    }
  }, []);

  const queryItems = searchParams.get("items")?.split(",").filter(Boolean) || [];
  const selectedSlugs = queryItems.length ? queryItems : localItems;
  const selected = useMemo(
    () => products.filter((product) => selectedSlugs.includes(product.slug)).slice(0, 4),
    [products, selectedSlugs]
  );

  const specLabels = Array.from(
    new Set(selected.flatMap((product) => product.specifications.map((spec) => spec.label)))
  );

  function clear() {
    window.localStorage.removeItem(key);
    setLocalItems([]);
  }

  if (!selected.length) {
    return (
      <div className="grid gap-4 rounded-lg border border-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Product Comparison</h1>
        <p className="text-muted-foreground">Select products from the catalog to compare specifications, features, and prices.</p>
        <Button asChild className="mx-auto">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Product Comparison</h1>
          <p className="mt-2 text-muted-foreground">Compare up to four catalog products side by side.</p>
        </div>
        <Button variant="outline" onClick={clear}>
          Clear saved comparison
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Product</TableHead>
              {selected.map((product) => (
                <TableHead key={product.id} className="min-w-56">
                  <div className="grid gap-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-secondary">
                      <Image src={product.images[0]?.url} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="text-base font-semibold text-foreground">{product.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Price</TableCell>
              {selected.map((product) => (
                <TableCell key={product.id}>
                  <div>
                    <span className="font-mono">{formatCurrency(product.price)}</span>
                    <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5 font-sans">
                      {product.extraChargesApply
                        ? "+ Transport & Tax"
                        : "Net Rate (Inclusive)"}
                    </span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Category</TableCell>
              {selected.map((product) => (
                <TableCell key={product.id}>{product.category.name}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Brand</TableCell>
              {selected.map((product) => (
                <TableCell key={product.id}>{product.brand.name}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Features</TableCell>
              {selected.map((product) => (
                <TableCell key={product.id}>{product.features.join(", ")}</TableCell>
              ))}
            </TableRow>
            {specLabels.map((label) => (
              <TableRow key={label}>
                <TableCell className="font-semibold">{label}</TableCell>
                {selected.map((product) => (
                  <TableCell key={product.id}>
                    {product.specifications.find((spec) => spec.label === label)?.value || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
