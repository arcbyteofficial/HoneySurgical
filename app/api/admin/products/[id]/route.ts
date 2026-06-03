import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function splitLines(value?: string) {
  return (value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const product = parsed.data;
  const { error } = await supabase
    .from("products")
    .update({
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
      status: product.status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("product_images").delete().eq("product_id", id);
  if (product.images.length) {
    await supabase.from("product_images").insert(
      product.images.map((url, index) => ({
        product_id: id,
        url,
        alt: product.name,
        sort_order: index + 1
      }))
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
