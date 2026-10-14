import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getT } from "@/lib/lang";
import { CATEGORY_MAP, getProductBySlug, topInCategory } from "@/lib/catalog";
import { getUser } from "@/lib/auth";
import { getSubscription, isPremium, ownsProduct } from "@/lib/entitlement";
import { dateFmt, money, num } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import BuyBox from "@/components/BuyBox";
import { SITE } from "@/lib/config";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.desc.en.slice(0, 160),
    robots: p.demo ? { index: false, follow: false } : undefined,
    alternates: { canonical: `${SITE.url}/p/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const { lang, t } = await getT();
  const user = await getUser();
  const [owned, sub, related] = await Promise.all([
    user ? ownsProduct(user.id, p.id) : false,
    user ? getSubscription(user.id) : null,
    topInCategory(p.category, 4, p.id),
  ]);
  const cat = CATEGORY_MAP[p.category];
  const [intro, rest] = p.desc[lang].split(/\s(?:Ichida|Inside): /);
  const incl = rest ? rest.replace(/\.$/, "").split("; ").filter(Boolean) : [];

  return (
    <div className="wrap">
      <div className="crumbs">
        <Link href="/catalog">{t("cat.title")}</Link> / <Link href={`/catalog?category=${p.category}`}>{cat[lang]}</Link>
      </div>
      <div className="pd">
        <div>
          <div className="big cropbox"><img src={p.coverUrl || `/api/cover/${p.id}`} alt={p.name} width={800} height={600} style={{ width: "100%", height: "auto" }} /></div>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", marginTop: 24 }}>{p.name}</h1>
          <p className="muted">{intro}</p>
          {incl.length > 0 && (
            <>
              <h3>{t("p.includes")}</h3>
              <ul className="incl">{incl.map((l, i) => <li key={i}>{l.replace(/^[-•]\s*/, "")}</li>)}</ul>
            </>
          )}
          {p.demo && <div className="note">{t("p.demoNote")}</div>}
        </div>
        <aside className="buy">
          {p.demo && <span className="tag" style={{ alignSelf: "flex-start" }}>{t("p.demo")}</span>}
          <span className="price">{money(p.priceCents, lang)}</span>
          <BuyBox id={p.id} slug={p.slug} name={p.name} priceCents={p.priceCents} loggedIn={!!user} owned={owned} premium={isPremium(sub)} />
          <ul className="facts">
            <li><span>{t("p.format")}</span><b>{p.formats}</b></li>
            <li><span>{t("p.files")}</span><b>{num(p.files, lang)}</b></li>
            {p.sizeMb > 0 && <li><span>{t("p.size")}</span><b>{p.sizeMb} MB</b></li>}
            <li><span>{t("p.license")}</span><b>{p.license === "commercial" ? t("p.commercial") : t("p.personal")}</b></li>
            <li><span>{t("p.updated")}</span><b>{dateFmt(p.updatedAt, lang)}</b></li>
            {p.reviews > 0 && <li><span>★ {p.rating.toFixed(1)}</span><b>{num(p.reviews, lang)} {t("p.reviews")}</b></li>}
          </ul>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section">
          <div className="head"><h2>{t("p.related")}</h2></div>
          <div className="grid-p">{related.map((r) => <ProductCard key={r.id} p={r} lang={lang} />)}</div>
        </section>
      )}
    </div>
  );
}
