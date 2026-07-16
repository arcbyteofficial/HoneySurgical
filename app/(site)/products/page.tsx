import type { Metadata } from "next";
import { ProductsCatalogClient } from "@/components/catalog/products-catalog-client";
import {
  getAllBrands,
  getAllCategories,
  searchProducts
} from "@/lib/repositories/catalog-repository";
import type { ProductFilters } from "@/lib/types/catalog";
import { BreadcrumbsJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Surgical Products Catalog & Medical Supplies",
  description: "Browse and search our wholesale catalog of medical disposables, surgical instruments, diagnostic equipment, and hospital furniture. Sourcing made simple for healthcare institutions.",
  alternates: {
    canonical: "/products"
  }
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters: ProductFilters = {
    query: value(params.q),
    category: value(params.category),
    brand: value(params.brand),
    sort: (value(params.sort) as ProductFilters["sort"]) || "popular"
  };

  // Fetch all active products initially to enable fast client-side on-type filtering
  const [products, categories, brands] = await Promise.all([
    searchProducts({ status: "active" }),
    getAllCategories(),
    getAllBrands()
  ]);

  const breadcrumbItems = [
    { name: "Home", item: siteConfig.url },
    { name: "Products", item: `${siteConfig.url}/products` }
  ];

  return (
    <section className="bg-white">
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <div className="container grid gap-6 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Product Catalog</h1>
          <p className="mt-2 text-muted-foreground">
            Search by product name, category, SKU, brand, and keywords.
          </p>
        </div>
        <ProductsCatalogClient
          products={products}
          categories={categories}
          brands={brands}
          initialFilters={filters}
        />
      </div>
    </section>
  );
}
