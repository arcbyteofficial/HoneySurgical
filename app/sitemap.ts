import type { MetadataRoute } from "next";
import { getAllCategories, searchProducts } from "@/lib/repositories/catalog-repository";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 86400; // Cache sitemap statically for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (siteConfig.url || "https://honeysurgical.com").replace(/\/$/, "");
  const now = new Date();

  try {
    const [categories, products] = await Promise.all([
      getAllCategories().catch(() => []),
      searchProducts().catch(() => [])
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0
      },
      {
        url: `${baseUrl}/products`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7
      },
      {
        url: `${baseUrl}/compare`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5
      }
    ];

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((cat) => Boolean(cat?.slug))
      .map((category) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7
      }));

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((prod) => Boolean(prod?.slug))
      .map((product) => {
        let lastMod = now;
        if (product.updatedAt) {
          const parsed = new Date(product.updatedAt);
          if (!isNaN(parsed.getTime())) {
            lastMod = parsed;
          }
        }

        return {
          url: `${baseUrl}/products/${product.slug}`,
          lastModified: lastMod,
          changeFrequency: "weekly" as const,
          priority: 0.8
        };
      });

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0
      },
      {
        url: `${baseUrl}/products`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8
      }
    ];
  }
}

