import { createBrowserClient } from "@supabase/ssr";
import { ENV } from "./env";

export function getSupabase() {
  return createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);
}
