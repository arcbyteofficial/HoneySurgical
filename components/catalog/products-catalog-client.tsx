"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { normalizeSearch } from "@/lib/utils";
import type { Brand, Category, Product, ProductFilters } from "@/lib/types/catalog";

type CatalogClientProps = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  initialFilters: ProductFilters;
};

export function ProductsCatalogClient({
  products,
  categories,
  brands,
  initialFilters,
}: CatalogClientProps) {
  // Client filters state
  const [query, setQuery] = useState(initialFilters.query || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [brand, setBrand] = useState(initialFilters.brand || "");
  const [sort, setSort] = useState<ProductFilters["sort"]>(initialFilters.sort || "popular");

  const parentCategories = categories.filter((c) => !c.parentId);

  // Compute filtered & sorted products
  const processedProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query Filtering
    const normalized = normalizeSearch(query);
    if (normalized) {
      list = list.filter((product) => {
        const haystack = normalizeSearch(
          [
            product.name,
            product.sku,
            product.brand.name,
            product.category.name,
            ...(product.keywords || []),
          ].join(" ")
        );
        return normalized.split(" ").every((part) => haystack.includes(part));
      });
    }

    // 2. Category Filtering (matches current category or any of its subcategories)
    if (category) {
      const selectedCategory = categories.find((c) => c.slug === category);
      if (selectedCategory) {
        const childIds = categories
          .filter((c) => c.parentId === selectedCategory.id)
          .map((c) => c.id);
        const allowedCategoryIds = [selectedCategory.id, ...childIds];

        list = list.filter((product) => allowedCategoryIds.includes(product.category.id));
      }
    }

    // 3. Brand Filtering
    if (brand) {
      list = list.filter((product) => product.brand.slug === brand);
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sort === "price_asc") {
        return (a.price ?? 0) - (b.price ?? 0);
      }
      if (sort === "price_desc") {
        return (b.price ?? 0) - (a.price ?? 0);
      }
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "popular") {
        return b.viewCount - a.viewCount;
      }
      // relevance (default / fallback)
      return 0;
    });

    return list;
  }, [products, categories, query, category, brand, sort]);

  return (
    <div className="grid gap-6">
      {/* Dynamic Filters Form */}
      <div className="grid gap-3 rounded-lg border border-border bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Product, SKU, brand, keyword..."
            className="pl-9 focus-ring"
            aria-label="Search products"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {parentCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
        <Select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Filter by brand"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as ProductFilters["sort"])}
          aria-label="Sort products"
        >
          <option value="popular">Most viewed</option>
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
          <option value="newest">Newest</option>
        </Select>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{processedProducts.length} products found</span>
        <span>Inquiry-first catalog, no cart or checkout</span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {processedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {processedProducts.length === 0 ? (
        <div className="rounded-lg border border-border bg-secondary p-8 text-center">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a broader search or contact sales for sourcing help.
          </p>
        </div>
      ) : null}
    </div>
  );
}
