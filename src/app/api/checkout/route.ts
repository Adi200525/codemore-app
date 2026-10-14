import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getProductsByIds } from "@/lib/catalog";
import { stripe, autoTax } from "@/lib/stripe";
import { stripeLive, SITE } from "@/lib/config";
import { customerFor } from "@/lib/customer";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const s = stripe();
  if (!s) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body.ids) ? [...new Set<string>(body.ids.map(String))].slice(0, 20) : [];
  if (!ids.length) return NextResponse.json({ error: "empty" }, { status: 400 });

  // Narxlar har doim serverda katalogdan olinadi — mijozdan kelgan narxga ishonilmaydi.
  const products = await getProductsByIds(ids);
  if (!products.length) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (products.some((p) => p.demo) && stripeLive())
    return NextResponse.json({ error: "demo_not_purchasable_in_live_mode" }, { status: 400 });

  const customer = await customerFor(user.id, user.email ?? undefined);
  const session = await s.checkout.sessions.create({
    mode: "payment",
    customer: customer ?? undefined,
    customer_email: customer ? undefined : user.email ?? undefined,
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    line_items: products.map((p) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: p.priceCents,
        product_data: { name: p.name, metadata: { product_id: p.id } },
      },
    })),
    automatic_tax: { enabled: autoTax() },
    success_url: `${SITE.url}/success`,
    cancel_url: `${SITE.url}/cart`,
  });
  return NextResponse.json({ url: session.url });
}
