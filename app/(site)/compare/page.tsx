import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparisonClient } from "@/components/catalog/comparison-client";
import { searchProducts } from "@/lib/repositories/catalog-repository";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare product specifications, features, and prices."
};

export default async function ComparePage() {
  const products = await searchProducts();

  return (
    <section className="bg-white">
      <div className="container py-10">
        <Suspense fallback={<div className="rounded-lg border border-border bg-white p-8">Loading comparison...</div>}>
          <ComparisonClient products={products} />
        </Suspense>
      </div>
    </section>
  );
}
