import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE } from "@/lib/config";

export async function POST() {
  const user = await getUser();
  const s = stripe();
  const admin = supabaseAdmin();
  if (!user || !s || !admin) return NextResponse.redirect(new URL("/premium", SITE.url), { status: 303 });
  const { data } = await admin.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  if (!data?.stripe_customer_id) return NextResponse.redirect(new URL("/premium", SITE.url), { status: 303 });
  const portal = await s.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${SITE.url}/account` });
  return NextResponse.redirect(portal.url, { status: 303 });
}
