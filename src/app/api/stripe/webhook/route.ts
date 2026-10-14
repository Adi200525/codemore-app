import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = stripe();
  const admin = supabaseAdmin();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !admin || !secret) return new NextResponse("not configured", { status: 503 });

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text(); // imzoni tekshirish uchun xom matn kerak
  let event: Stripe.Event;
  try {
    event = s.webhooks.constructEvent(raw, sig ?? "", secret);
  } catch {
    return new NextResponse("bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.user_id;
        if (session.mode === "payment" && userId && session.payment_status === "paid") {
          const items = await s.checkout.sessions.listLineItems(session.id, { expand: ["data.price.product"], limit: 100 });
          const rows = items.data
            .map((li) => (li.price?.product as Stripe.Product | undefined)?.metadata?.product_id)
            .filter((x): x is string => !!x)
            .map((product_id) => ({ user_id: userId, product_id, stripe_session_id: session.id }));
          if (rows.length) await admin.from("purchases").upsert(rows, { onConflict: "user_id,product_id" });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        const end = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end; // API versiyalariga qarab
        await admin.from("subscriptions").upsert(
          {
            id: sub.id,
            user_id: userId,
            status: sub.status,
            plan: sub.metadata?.plan ?? null,
            current_period_end: end ? new Date(end * 1000).toISOString() : null,
            cancel_at_period_end: !!sub.cancel_at_period_end,
          },
          { onConflict: "id" },
        );
        break;
      }
    }
  } catch (e) {
    return new NextResponse("handler error", { status: 500 }); // Stripe qayta urinadi
  }
  return NextResponse.json({ received: true });
}
