import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import connectToDatabase from "@/lib/db/mongodb";
import { Category as CategoryModel } from "@/lib/models/Category";
import { Brand as BrandModel } from "@/lib/models/Brand";
import { Product as ProductModel } from "@/lib/models/Product";
import { categories as seedCategories, brands as seedBrands, products as seedProducts } from "@/lib/data/catalog";
import mongoose from "mongoose";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.demo) {
    return NextResponse.json({ error: "Cannot seed in demo mode." }, { status: 403 });
  }

  try {
    await connectToDatabase();

    // 1. Clear existing brands, categories, products
    await Promise.all([
      BrandModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      ProductModel.deleteMany({}),
    ]);

    // 2. Map and Seed Brands
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
    await BrandModel.insertMany(brandsToInsert);

    // 3. Map and Seed Categories
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
    await CategoryModel.insertMany(categoriesToInsert);

    // 4. Map and Seed Products
    const productsToInsert = seedProducts.map((prod) => {
      const catId = categoryIdMap.get(prod.category.id);
      const brandId = brandIdMap.get(prod.brand.id);

      return {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        brand: brandId || null,
        category: catId || null,
        price: prod.price,
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
    await ProductModel.insertMany(productsToInsert);

    return NextResponse.json({ ok: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
