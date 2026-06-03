import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const bulkSchema = z.object({
  rows: z.array(z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])))
});

function cell(row: Record<string, unknown>, keys: string[]) {
  const entry = Object.entries(row).find(([key]) => keys.includes(key.toLowerCase().trim()));
  return entry ? String(entry[1] ?? "").trim() : "";
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bulkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid bulk payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "demo", count: parsed.data.rows.length });
  }

  const products = parsed.data.rows
    .map((row) => {
      const name = cell(row, ["name", "product name"]);
      const sku = cell(row, ["sku"]);
      const categoryId = cell(row, ["category_id", "category id"]);
      const brandId = cell(row, ["brand_id", "brand id"]);
      return {
        name,
        slug: slugify(name),
        sku,
        category_id: categoryId,
        brand_id: brandId,
        price: Number(cell(row, ["price"])) || null,
        short_description: cell(row, ["short_description", "short description"]) || name,
        description: cell(row, ["description"]) || name,
        specifications: [],
        features: cell(row, ["features"])
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean),
        keywords: cell(row, ["keywords"])
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        status: cell(row, ["status"]) || "active"
      };
    })
    .filter((row) => row.name && row.sku && row.category_id && row.brand_id);

  const { error } = await supabase.from("products").upsert(products, { onConflict: "sku" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: products.length });
}
