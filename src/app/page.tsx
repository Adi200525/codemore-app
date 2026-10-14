import Link from "next/link";
import { getT } from "@/lib/lang";
import { CATEGORIES, categoryCounts, queryProducts, totalCount } from "@/lib/catalog";
import { num } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const { lang, t } = await getT();
  const [counts, total, popular, fresh] = await Promise.all([
    categoryCounts(),
    totalCount(),
    queryProducts({ sort: "popular", per: 8 }),
    queryProducts({ sort: "new", per: 4 }),
  ]);
  return (
    <>
      <section className="hero">
        <div className="wrap grid">
          <div className="rise">
            <span className="kicker">{t("hero.kicker")}</span>
            <h1>{t("hero.title")}</h1>
            <p className="lead">{t("hero.sub")}</p>
            <div className="cta">
              <Link className="btn primary" href="/catalog">{t("hero.cta")}</Link>
              <Link className="btn" href="/premium">{t("hero.cta2")}</Link>
            </div>
            <form className="searchbar" action="/catalog">
              <input name="q" placeholder={t("hero.search")} aria-label={t("cat.search")} />
              <button className="btn signal">{t("cat.search")}</button>
            </form>
            <p className="stat"><b>{num(total, lang)}</b> {t("hero.stat")}</p>
          </div>
          <div className="stack cropbox" aria-hidden="true">
            {popular.items.slice(0, 3).map((p) => (
              <div className="sheet" key={p.id}><img src={`/api/cover/${p.id}`} alt="" /></div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="section">
          <div className="head"><h2>{t("home.cats")}</h2></div>
          <div className="cats">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/catalog?category=${c.id}`} className="cat">
                <h3>{c[lang]}</h3>
                <span className="n">{num(counts[c.id] || 0, lang)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="head"><h2>{t("home.popular")}</h2><Link href="/catalog">{t("home.all")} →</Link></div>
          <div className="grid-p">{popular.items.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}</div>
        </section>

        <section className="section">
          <div className="head"><h2>{t("home.newest")}</h2><Link href="/catalog?sort=new">{t("home.all")} →</Link></div>
          <div className="grid-p">{fresh.items.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}</div>
        </section>

        <section className="section why">
          <div><h3>{t("home.why1t")}</h3><p className="muted">{t("home.why1d")}</p></div>
          <div><h3>{t("home.why2t")}</h3><p className="muted">{t("home.why2d")}</p></div>
          <div><h3>{t("home.why3t")}</h3><p className="muted">{t("home.why3d")}</p></div>
        </section>
      </div>
    </>
  );
}
