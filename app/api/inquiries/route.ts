import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const inquirySchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  productId: z.string().nullable().optional(),
  productName: z.string().nullable().optional(),
  message: z.string().min(5)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inquiry payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      message: "Inquiry accepted locally. Configure Supabase env vars to persist inquiries."
    });
  }

  const { error } = await supabase.from("inquiries").insert({
    customer_name: parsed.data.customerName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    product_id: parsed.data.productId,
    product_name: parsed.data.productName,
    message: parsed.data.message,
    status: "new"
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
