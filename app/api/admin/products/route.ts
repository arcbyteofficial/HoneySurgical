import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  price: z.coerce.number().min(0).nullable().optional(),
  shortDescription: z.string().min(5),
  description: z.string().min(5),
  specifications: z.string().optional(),
  features: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  images: z.array(z.string()).default([])
});

function parseSpecifications(value?: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return [];
  }

  return [];
}

function splitLines(value?: string) {
  return (value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const product = parsed.data;
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      slug: slugify(product.name),
      sku: product.sku,
      category_id: product.categoryId,
      brand_id: product.brandId,
      price: product.price || null,
      short_description: product.shortDescription,
      description: product.description,
      specifications: parseSpecifications(product.specifications),
      features: splitLines(product.features),
      keywords: splitLines(product.keywords),
      status: product.status
    })
    .select("id,name")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Could not create product" }, { status: 500 });
  }

  if (product.images.length) {
    await supabase.from("product_images").insert(
      product.images.map((url, index) => ({
        product_id: data.id,
        url,
        alt: product.name,
        sort_order: index + 1
      }))
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
