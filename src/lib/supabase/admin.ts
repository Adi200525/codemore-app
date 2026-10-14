import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Faqat serverda ishlatiladi. SUPABASE_SERVICE_ROLE_KEY brauzerga hech qachon chiqmaydi.
export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Ommaviy (anon) kalit bilan: faqat RLS ruxsat bergan ma'lumotlarni (e'lon qilingan mahsulotlar) o'qiydi.
export function supabasePublic(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
