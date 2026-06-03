import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  parentId: z.string().nullable().optional(),
  description: z.string().min(5),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().min(0).default(1)
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = categorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const category = parsed.data;
  const { error } = await supabase.from("categories").insert({
    name: category.name,
    slug: slugify(category.name),
    parent_id: category.parentId || null,
    description: category.description,
    image_url: category.imageUrl || null,
    sort_order: category.sortOrder
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
