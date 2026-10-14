import { stripe } from "./stripe";
import { supabaseAdmin } from "./supabase/admin";

// Foydalanuvchiga Stripe mijozini topadi yoki yaratadi va profiles jadvaliga yozadi.
export async function customerFor(userId: string, email?: string): Promise<string | null> {
  const s = stripe();
  const admin = supabaseAdmin();
  if (!s || !admin) return null;
  const { data } = await admin.from("profiles").select("stripe_customer_id").eq("id", userId).maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id;
  const c = await s.customers.create({ email, metadata: { user_id: userId } });
  await admin.from("profiles").upsert({ id: userId, stripe_customer_id: c.id });
  return c.id;
}
