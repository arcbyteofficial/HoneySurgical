import type { MetadataRoute } from "next";
import { getAllCategories, searchProducts } from "@/lib/repositories/catalog-repository";
import { siteConfig } from "@/lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getAllCategories(), searchProducts()]);
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteConfig.url}/compare`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    ...categories.map((category) => ({
      url: `${siteConfig.url}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
