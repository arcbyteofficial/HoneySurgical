import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Brand, Category, ProductFilters } from "@/lib/types/catalog";

export function ProductFilterForm({
  categories,
  brands,
  filters
}: {
  categories: Category[];
  brands: Brand[];
  filters: ProductFilters;
}) {
  const parentCategories = categories.filter((category) => !category.parentId);

  return (
    <form className="grid gap-3 rounded-lg border border-border bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={filters.query} placeholder="Product, SKU, brand, keyword" className="pl-9" />
      </div>
      <Select name="category" defaultValue={filters.category || ""} aria-label="Filter by category">
        <option value="">All categories</option>
        {parentCategories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select name="brand" defaultValue={filters.brand || ""} aria-label="Filter by brand">
        <option value="">All brands</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.slug}>
            {brand.name}
          </option>
        ))}
      </Select>
      <Select name="sort" defaultValue={filters.sort || "popular"} aria-label="Sort products">
        <option value="popular">Most viewed</option>
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price low to high</option>
        <option value="price_desc">Price high to low</option>
        <option value="newest">Newest</option>
      </Select>
      <Button type="submit">Apply</Button>
    </form>
  );
}
