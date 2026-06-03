import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"])
});

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const { id } = await context.params;
  const { error } = await supabase.from("inquiries").update({ status: parsed.data.status }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
