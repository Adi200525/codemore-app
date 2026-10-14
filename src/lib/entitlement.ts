import { supabaseServer } from "./supabase/server";

export type Sub = { status: string; plan: string | null; current_period_end: string | null; cancel_at_period_end: boolean } | null;

export async function getSubscription(userId: string): Promise<Sub> {
  const sb = await supabaseServer();
  if (!sb) return null;
  const { data } = await sb
    .from("subscriptions")
    .select("status, plan, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Sub) ?? null;
}

export const isPremium = (s: Sub) => !!s && (s.status === "active" || s.status === "trialing");

export async function ownsProduct(userId: string, productId: string) {
  const sb = await supabaseServer();
  if (!sb) return false;
  const { data } = await sb.from("purchases").select("id").eq("user_id", userId).eq("product_id", productId).limit(1);
  return !!data && data.length > 0;
}

export async function canDownload(userId: string, productId: string) {
  if (await ownsProduct(userId, productId)) return true;
  return isPremium(await getSubscription(userId));
}
