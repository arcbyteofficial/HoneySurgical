import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin";
import connectToDatabase from "@/lib/db/mongodb";
import { Brand as BrandModel } from "@/lib/models/Brand";
import { slugify } from "@/lib/utils";

const brandSchema = z.object({
  name: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = brandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid brand payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (session.demo) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  try {
    await connectToDatabase();
    
    const brand = parsed.data;
    await BrandModel.create({
      name: brand.name,
      slug: slugify(brand.name),
    });

    revalidatePath("/admin/brands");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
