import { notFound } from "next/navigation";
import { getT } from "@/lib/lang";
import { SITE } from "@/lib/config";

const DOCS = {
  terms: {
    title: "legal.terms" as const,
    uz: ["Xizmatdan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.", "Sotib olingan raqamli mahsulotlar litsenziya shartlariga muvofiq ishlatiladi; qayta sotish taqiqlanadi.", "Premium obuna to'lov davri oxirigacha amal qiladi va avtomatik yangilanadi; uni istalgan vaqt bekor qilish mumkin."],
    en: ["By using the service you agree to these terms.", "Purchased digital products are used under their license; resale is not permitted.", "Premium renews automatically each billing period and can be cancelled at any time."],
  },
  privacy: {
    title: "legal.privacy" as const,
    uz: ["Biz faqat hisob yuritish uchun zarur ma'lumotlarni (elektron pochta, xaridlar) saqlaymiz.", "To'lovlarni Stripe qayta ishlaydi; karta ma'lumotlari bizning serverlarda saqlanmaydi.", "Ma'lumotlaringizni o'chirish uchun biz bilan bog'laning."],
    en: ["We store only what is needed to run your account (email, purchases).", "Payments are processed by Stripe; card details never reach our servers.", "Contact us to delete your data."],
  },
  refund: {
    title: "legal.refund" as const,
    uz: ["Raqamli mahsulotlar yuklab olingach, odatda qaytarilmaydi. Fayl buzuq bo'lsa yoki tavsifga mos kelmasa, 14 kun ichida murojaat qiling.", "Premium obunani istalgan vaqt bekor qilish mumkin; joriy davr uchun to'lov qaytarilmaydi."],
    en: ["Digital products are generally non-refundable once downloaded. If a file is defective or not as described, contact us within 14 days.", "Premium can be cancelled anytime; the current period is not refunded."],
  },
};

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc as keyof typeof DOCS];
  if (!d) notFound();
  const { lang, t } = await getT();
  return (
    <div className="wrap legal">
      <h1>{t(d.title)}</h1>
      <div className="note" style={{ marginBottom: 20 }}>{t("legal.updated")}</div>
      {d[lang].map((s, i) => <p key={i}>{s}</p>)}
      <p className="muted">{SITE.company} · {SITE.email}</p>
    </div>
  );
}
