export const SITE = {
  name: "Qolip",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  company: process.env.COMPANY_NAME || "Qolip",
  email: process.env.SUPPORT_EMAIL || "support@example.com",
};

export const supabaseConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const stripeConfigured = () => !!process.env.STRIPE_SECRET_KEY;

// Test kaliti (sk_test_) bo'lsa — haqiqiy pul yechilmaydi. Demo mahsulotlar faqat test rejimida sotib olinadi.
export const stripeLive = () => (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_live_");

export const premium = {
  monthlyCents: Number(process.env.PREMIUM_MONTHLY_CENTS || 1200),
  yearlyCents: Number(process.env.PREMIUM_YEARLY_CENTS || 9900),
};
