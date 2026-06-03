import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductFilterForm } from "@/components/catalog/product-filter-form";
import { CompareLink } from "@/components/catalog/compare-link";
import {
  getAllBrands,
  getAllCategories,
  searchProducts
} from "@/lib/repositories/catalog-repository";
import type { ProductFilters } from "@/lib/types/catalog";

export const metadata: Metadata = {
  title: "Products",
  description: "Search HONEY SURGICALS products by name, category, SKU, brand, keywords, and price."
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

  const [products, categories, brands] = await Promise.all([
    searchProducts(filters),
    getAllCategories(),
    getAllBrands()
  ]);

  return (
    <section className="bg-white">
      <div className="container grid gap-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Product Catalog</h1>
            <p className="mt-2 text-muted-foreground">
              Search by product name, category, SKU, brand, and keywords.
            </p>
          </div>
          <CompareLink />
        </div>
        <ProductFilterForm categories={categories} brands={brands} filters={filters} />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{products.length} products found</span>
          <span>Inquiry-first catalog, no cart or checkout</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {!products.length ? (
          <div className="rounded-lg border border-border bg-secondary p-8 text-center">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="mt-2 text-muted-foreground">Try a broader search or contact sales for sourcing help.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
