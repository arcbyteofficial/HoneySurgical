import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { categories as seedCategories, brands as seedBrands, products as seedProducts } from "../lib/data/catalog";
import { Category as CategoryModel } from "../lib/models/Category";
import { Brand as BrandModel } from "../lib/models/Brand";
import { Product as ProductModel } from "../lib/models/Product";

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || "").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/honey-surgical";

async function main() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // 1. Clear existing brands, categories, products
  console.log("Clearing existing collections...");
  await Promise.all([
    BrandModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);
  console.log("Collections cleared.");

  // 2. Map and Seed Brands
  console.log(`Mapping ${seedBrands.length} brands...`);
  const brandIdMap = new Map<string, mongoose.Types.ObjectId>();
  const brandsToInsert = seedBrands.map((brand) => {
    const newId = new mongoose.Types.ObjectId();
    brandIdMap.set(brand.id, newId);
    return {
      _id: newId,
      name: brand.name,
      slug: brand.slug,
    };
  });

  console.log("Inserting brands...");
  await BrandModel.insertMany(brandsToInsert);
  console.log("Brands seeded.");

  // 3. Map and Seed Categories
  console.log(`Mapping ${seedCategories.length} categories...`);
  const categoryIdMap = new Map<string, mongoose.Types.ObjectId>();
  seedCategories.forEach((cat) => {
    categoryIdMap.set(cat.id, new mongoose.Types.ObjectId());
  });

  const categoriesToInsert = seedCategories.map((cat) => {
    const newId = categoryIdMap.get(cat.id)!;
    const parentId = cat.parentId ? categoryIdMap.get(cat.parentId) || null : null;
    return {
      _id: newId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      parentId: parentId,
      sortOrder: cat.sortOrder,
    };
  });

  console.log("Inserting categories...");
  await CategoryModel.insertMany(categoriesToInsert);
  console.log("Categories seeded.");

  // 4. Map and Seed Products
  console.log(`Mapping ${seedProducts.length} products...`);
  const productsToInsert = seedProducts.map((prod) => {
    const catId = categoryIdMap.get(prod.category.id);
    const brandId = brandIdMap.get(prod.brand.id);
    
    if (!catId) {
      console.warn(`Warning: Category with ID ${prod.category.id} not found for product ${prod.name}`);
    }
    if (!brandId) {
      console.warn(`Warning: Brand with ID ${prod.brand.id} not found for product ${prod.name}`);
    }

    return {
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      brand: brandId || null,
      category: catId || null,
      price: prod.price,
      extraChargesApply: prod.extraChargesApply,
      shortDescription: prod.shortDescription,
      description: prod.description,
      specifications: prod.specifications,
      features: prod.features,
      keywords: prod.keywords,
      status: prod.status,
      images: prod.images,
      viewCount: prod.viewCount,
    };
  });

  console.log("Inserting products...");
  await ProductModel.insertMany(productsToInsert);
  console.log("Products seeded successfully.");

  console.log("Database seeding completed successfully!");
}

main()
  .catch((err) => {
    console.error("Error during seeding:", err);
    process.exit(1);
  })
  .finally(() => {
    mongoose.disconnect();
  });
