import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://honeysurgical.com").replace(/\/$/, "");
const now = new Date().toISOString();

const categorySlugs = [
  "disposable-products", "surgical-gloves", "latex-gloves", "nitrile-gloves", "masks", "syringes", "iv-sets", "catheters", "cannulas", "surgical-drapes",
  "hospital-furniture", "hospital-beds", "icu-beds", "fowler-beds", "wheelchairs", "stretchers", "examination-tables", "bedside-lockers",
  "surgical-instruments", "forceps", "scissors", "retractors", "needle-holders", "clamps", "surgical-sets",
  "diagnostics", "stethoscopes", "bp-monitors", "thermometers", "pulse-oximeters", "glucometers",
  "orthopedic-products", "knee-braces", "cervical-collars", "lumbar-supports", "walkers", "crutches",
  "medical-equipment", "ecg-machines", "defibrillators", "nebulizers", "suction-machines", "oxygen-concentrators",
  "laboratory-equipment", "microscopes", "centrifuges", "test-tubes", "lab-consumables",
  "infection-control", "ppe-kits", "sanitizers", "sterilizers", "disinfectants",
  "emergency-care", "first-aid-kits", "emergency-stretchers", "ambu-bags",
  "dental-products", "dental-instruments", "dental-chairs", "dental-consumables",
  "rehabilitation-products", "walking-sticks", "mobility-aids", "support-devices"
];

const productSlugs = [
  "sterile-nitrile-examination-gloves",
  "3-ply-surgical-face-mask",
  "romsons-iv-infusion-set",
  "five-function-icu-bed",
  "stainless-steel-surgical-instrument-set",
  "bpl-digital-blood-pressure-monitor",
  "portable-pulse-oximeter",
  "adjustable-knee-brace",
  "philips-oxygen-concentrator-5-lpm",
  "portable-suction-machine",
  "laboratory-binocular-microscope",
  "ppe-kit-with-face-shield"
];

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
