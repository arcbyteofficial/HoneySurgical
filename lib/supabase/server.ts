import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof cookieStore.set>[2];
  };

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Route handlers and actions can.
        }
      }
    }
  });
}
