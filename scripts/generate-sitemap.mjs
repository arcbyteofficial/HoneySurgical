import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://honeysurgical.com").replace(/\/$/, "");
const now = new Date().toISOString();

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Read catalog.ts content dynamically
const catalogPath = path.join(__dirname, "..", "lib", "data", "catalog.ts");
const catalogContent = fs.readFileSync(catalogPath, "utf8");

// Extract category hierarchy from catalog.ts
const hierarchyMatch = catalogContent.match(/const hierarchy = (\{[\s\S]*?\n\};)/);
let categorySlugs = [];

if (hierarchyMatch) {
  try {
    const hierarchyText = hierarchyMatch[1].replace(/;\s*$/, "");
    const hierarchyFn = new Function(`return ${hierarchyText}`);
    const hierarchy = hierarchyFn();

    const slugSet = new Set();
    Object.entries(hierarchy).forEach(([parent, children]) => {
      slugSet.add(slugify(parent));
      children.forEach((child) => slugSet.add(slugify(child)));
    });
    categorySlugs = Array.from(slugSet);
  } catch (err) {
    console.error("Failed to parse hierarchy from catalog.ts:", err);
  }
}

// Extract product names from productSeeds / templates in catalog.ts
const productSeedsMatch = catalogContent.match(/const productSeeds = (\[[\s\S]*?\n\]) as const;/);
let productSlugs = [];

if (productSeedsMatch) {
  try {
    const seedsText = productSeedsMatch[1];
    const seedsFn = new Function(`return ${seedsText}`);
    const seeds = seedsFn();
    productSlugs = seeds.map((s) => slugify(s.name));
  } catch (err) {
    console.error("Failed to parse productSeeds from catalog.ts:", err);
  }
}

// Extract template slugs as well
const templatesMatch = catalogContent.match(/export const templates: ProductTemplate\[\] = (\[[\s\S]*?\n\];)/);
if (templatesMatch) {
  try {
    const tmplText = templatesMatch[1].replace(/;\s*$/, "");
    const tmplFn = new Function(`return ${tmplText}`);
    const templates = tmplFn();
    templates.forEach((t) => {
      if (t.slug && !productSlugs.includes(t.slug)) {
        productSlugs.push(t.slug);
      }
    });
  } catch (err) {
    // ignore
  }
}

const staticUrls = [
  { url: baseUrl, priority: "1.0", changefreq: "weekly" },
  { url: `${baseUrl}/products`, priority: "0.9", changefreq: "daily" },
  { url: `${baseUrl}/categories`, priority: "0.8", changefreq: "weekly" },
  { url: `${baseUrl}/contact`, priority: "0.7", changefreq: "monthly" },
  { url: `${baseUrl}/compare`, priority: "0.5", changefreq: "monthly" }
];

const categoryUrls = categorySlugs.map((slug) => ({
  url: `${baseUrl}/categories/${slug}`,
  priority: "0.7",
  changefreq: "weekly"
}));

const productUrls = productSlugs.map((slug) => ({
  url: `${baseUrl}/products/${slug}`,
  priority: "0.8",
  changefreq: "weekly"
}));

const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf8");
console.log(`✅ Physical sitemap.xml generated with ${allUrls.length} URLs in public/sitemap.xml`);
