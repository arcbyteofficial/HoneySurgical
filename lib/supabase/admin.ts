import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl, hasSupabaseAdminEnv } from "@/lib/supabase/env";

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  return createClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
