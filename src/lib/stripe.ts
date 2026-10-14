import Stripe from "stripe";

let _s: Stripe | null = null;
export function stripe(): Stripe | null {
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) return null;
  if (!_s) _s = new Stripe(k);
  return _s;
}

export const autoTax = () => process.env.STRIPE_AUTOMATIC_TAX === "true";
