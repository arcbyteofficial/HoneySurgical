import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { UserRole } from "@/lib/types/catalog";

export type AdminSession = {
  demo: boolean;
  userId: string;
  email: string;
  role: UserRole;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  // Check simple cookie-based auth (set by admin/admin login form)
  const cookieStore = await cookies();
  const adminSessionCookie = cookieStore.get("admin_session");

  if (adminSessionCookie?.value === "authenticated") {
    return {
      demo: false,
      userId: "admin",
      email: "admin@honeysurgicals.local",
      role: "super_admin"
    };
  }

  // Fallback: development demo mode (no cookie, no Supabase)
  if (!hasSupabaseEnv()) {
    return {
      demo: true,
      userId: "demo-admin",
      email: "demo@honeysurgicals.local",
      role: "super_admin"
    };
  }

  // Fallback: Supabase auth
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const { data } = await admin
    .from("users")
    .select("role,email")
    .eq("auth_user_id", user.id)
    .in("role", ["super_admin", "product_manager"])
    .single();

  if (!data) {
    return null;
  }

  return {
    demo: false,
    userId: user.id,
    email: data.email || user.email || "",
    role: data.role as UserRole
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
