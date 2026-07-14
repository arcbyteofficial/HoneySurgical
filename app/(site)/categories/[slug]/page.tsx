import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/product-card";
import { getAllCategories, searchProducts } from "@/lib/repositories/catalog-repository";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.replace(/_/g, "-");
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === normalizedSlug);
  return {
    title: category?.name || "Category",
    description: category?.description
  };
}

export default async function CategoryDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.replace(/_/g, "-");
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === normalizedSlug);

  if (!category) {
    notFound();
  }

  const products = await searchProducts({ category: category.slug, sort: "popular" });
  const children = categories.filter((item) => item.parentId === category.id);

  return (
    <section className="bg-white">
      <div className="container grid gap-8 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        </div>

        {children.length ? (
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <a
                key={child.id}
                href={`/categories/${child.slug}`}
                className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium hover:bg-medical-pale focus-ring"
              >
                {child.name}
              </a>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
