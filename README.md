# Qolip — raqamli mahsulotlar do'koni + Premium obuna

Next.js 15 · Supabase (kirish + baza + fayllar) · Stripe (karta, Apple Pay, obuna) · Vercel.

## ⚠️ Muhim: nima sinalgan, nima sinalmagan
Kod yozilgan muhitda npm paketlarini o'rnatib bo'lmadi, shuning uchun **Next.js ilovasi hali bir marta ham ishga tushirilmagan**.
Sinalgan: 30 000 mahsulot generatori (`npm run check:catalog`), tarjimalar to'liqligi, barcha fayllar sintaksisi.
Sinalmagan: `next build`, Supabase kirishi (Google/Apple/email), Stripe to'lovlari va webhook. Birinchi ishga tushirishda kichik xatolar chiqishi mumkin:

```bash
npm install
npm run typecheck     # tur xatolarini ko'rsatadi
npm run dev           # http://localhost:3000
```
Xato chiqsa, matnini menga yuboring — tuzataman.

## 1. Supabase
1. supabase.com → New project.
2. SQL Editor → `supabase/schema.sql` ni to'liq nusxalab ishga tushiring.
3. Settings → API: `Project URL`, `anon key`, `service_role key` ni `.env.local` ga yozing (`.env.example` ga qarang). **service_role kalitini hech kimga ko'rsatmang.**
4. Authentication → Providers:
   - **Email**: yoqing. "Confirm email" shablonida `{{ .Token }}` (6 xonali kod) ko'rinishi uchun Authentication → Email Templates → *Magic Link* shablonida kodni qo'shing: `Kodingiz: {{ .Token }}`.
   - **Google**: Google Cloud Console → OAuth client (Web) yarating; redirect URI — Supabase ko'rsatgan `https://<loyiha>.supabase.co/auth/v1/callback`. Client ID/Secret ni Supabase'ga kiriting.
   - **Apple**: pullik **Apple Developer** hisobi (yiliga $99) kerak: Services ID, Key (.p8) yarating va Supabase'dagi Apple bo'limini to'ldiring.
5. Authentication → URL Configuration: Site URL = saytingiz manzili; Redirect URLs ga `https://sizning-sayt.com/auth/callback` va `http://localhost:3000/auth/callback` ni qo'shing.

## 2. Stripe
1. stripe.com da hisob oching. **Avval TEST rejimida** ishlang (`sk_test_...`).
2. `STRIPE_SECRET_KEY` ni `.env.local` ga yozing.
3. Settings → Payment methods: Cards va Apple Pay yoqilgan bo'lsin (Apple Pay uchun domenni Stripe'da tasdiqlash kerak bo'lishi mumkin).
4. Settings → Billing → Customer portal: yoqing (obunani bekor qilish uchun).
5. Webhook: Developers → Webhooks → endpoint `https://sizning-sayt.com/api/stripe/webhook`, hodisalar: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. Signing secret → `STRIPE_WEBHOOK_SECRET`.
   Mahalliy sinash: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
6. Test karta: `4242 4242 4242 4242`, istalgan kelajak sana va CVC.

## 3. Vercel
1. Loyihani GitHub'ga yuklang → vercel.com → Import.
2. `.env.example` dagi barcha o'zgaruvchilarni Vercel → Settings → Environment Variables ga kiriting (`NEXT_PUBLIC_SITE_URL` = haqiqiy domen).
3. Deploy. So'ng Supabase va Stripe'dagi manzillarni haqiqiy domenga yangilang.

## Namunaviy (demo) mahsulotlar haqida
- 30 000 ta mahsulot **qoida asosida yaratilgan namuna**: haqiqiy fayl yo'q, "NAMUNA" belgisi bor, qidiruv tizimlariga berilmaydi (noindex, sitemap'da yo'q).
- Ular **faqat Stripe test rejimida** sotib olinadi. `sk_live_` kalitida server demo mahsulotli to'lovni rad etadi.
- Haqiqiy mahsulot qo'shish: Supabase → Storage → `products` bucket'iga fayl yuklang; Table Editor → `products` ga qator qo'shing (`title`, `price_cents`, `category`, `file_path`, `published = true`). Taxminan 60 soniyada saytda ko'rinadi.

## Jonli rejimga o'tishdan oldin
- Yurist bilan `/legal/*` sahifalarini (andoza matn) va soliq majburiyatlarini (EU/AQSh QQS) tekshiring; Stripe Tax uchun `STRIPE_AUTOMATIC_TAX=true`.
- Stripe hisobini to'liq tasdiqlang (shaxs/kompaniya ma'lumotlari), so'ng `sk_live_` kalitlarga o'ting.
- Demo mahsulotlarni o'chirmoqchi bo'lsangiz `src/lib/catalog.ts` da `demoProducts()` ni bo'sh ro'yxatga almashtiring.

## Tuzilma
`src/lib/demo-data.ts` generator · `catalog.ts` qidiruv/saralash · `src/app/api/*` to'lov, webhook, yuklab olish · `supabase/schema.sql` baza.
