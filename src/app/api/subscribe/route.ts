import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { stripe, autoTax } from "@/lib/stripe";
import { premium, SITE } from "@/lib/config";
import { customerFor } from "@/lib/customer";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const s = stripe();
  if (!s) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const yearly = body.plan === "yearly";
  const customer = await customerFor(user.id, user.email ?? undefined);

  const session = await s.checkout.sessions.create({
    mode: "subscription",
    customer: customer ?? undefined,
    customer_email: customer ? undefined : user.email ?? undefined,
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    subscription_data: { metadata: { user_id: user.id, plan: yearly ? "yearly" : "monthly" } },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: yearly ? premium.yearlyCents : premium.monthlyCents,
          recurring: { interval: yearly ? "year" : "month" },
          product_data: { name: yearly ? "Qolip Premium (yearly)" : "Qolip Premium (monthly)" },
        },
      },
    ],
    automatic_tax: { enabled: autoTax() },
    success_url: `${SITE.url}/success`,
    cancel_url: `${SITE.url}/premium`,
  });
  return NextResponse.json({ url: session.url });
}
