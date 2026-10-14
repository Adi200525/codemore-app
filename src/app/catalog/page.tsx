import Link from "next/link";
import type { Metadata } from "next";
import { getT } from "@/lib/lang";
import { CATEGORIES, SORTS, queryProducts, categoryCounts, type SortKey } from "@/lib/catalog";
import { num } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { makeT } from "@/lib/i18n";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export const metadata: Metadata = { title: "Catalog" };

export default async function Catalog({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { lang, t } = await getT();
  const q = one(sp.q).slice(0, 80);
  const category = one(sp.category);
  const sort = (SORTS as string[]).includes(one(sp.sort)) ? (one(sp.sort) as SortKey) : "popular";
  const min = one(sp.min) ? Number(one(sp.min)) : undefined;
  const max = one(sp.max) ? Number(one(sp.max)) : undefined;
  const page = Number(one(sp.page)) || 1;

  const [res, counts] = await Promise.all([queryProducts({ q, category, sort, min, max, page, per: 24 }), categoryCounts()]);

  const href = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const base: Record<string, string | number | undefined> = { q, category, sort: sort === "popular" ? "" : sort, min: one(sp.min), max: one(sp.max), ...over };
    for (const [k, v] of Object.entries(base)) if (v !== undefined && v !== "" && v !== 1) p.set(k, String(v));
    const s = p.toString();
    return `/catalog${s ? `?${s}` : ""}`;
  };
  const tt = makeT(lang);

  return (
    <div className="wrap cat-layout">
      <aside className="filters">
        <form className="box" action="/catalog">
          <input name="q" defaultValue={q} placeholder={t("hero.search")} aria-label={t("cat.search")} />
          {category && <input type="hidden" name="category" value={category} />}
          <select name="sort" defaultValue={sort} aria-label={t("cat.sort")}>
            {SORTS.map((s) => <option key={s} value={s}>{tt(`sort.${s}` as any)}</option>)}
          </select>
          <div className="row">
            <input name="min" type="number" min="0" defaultValue={one(sp.min)} placeholder={t("cat.min")} />
            <input name="max" type="number" min="0" defaultValue={one(sp.max)} placeholder={t("cat.max")} />
          </div>
          <button className="btn primary sm">{t("cat.apply")}</button>
          <Link className="small muted" href="/catalog">{t("cat.reset")}</Link>
        </form>
        <div className="box catlist">
          <Link href={href({ category: "", page: 1 })} className={!category ? "on" : ""}>{t("cat.all")}</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={href({ category: c.id, page: 1 })} className={category === c.id ? "on" : ""}>
              <span>{c[lang]}</span><span>{num(counts[c.id] || 0, lang)}</span>
            </Link>
          ))}
        </div>
      </aside>

      <section>
        <div className="head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 style={{ fontSize: "2rem" }}>{t("cat.title")}</h1>
          <span className="muted">{num(res.total, lang)} {t("cat.results")}</span>
        </div>
        {res.items.length === 0 ? (
          <p className="panel">{t("cat.none")}</p>
        ) : (
          <div className="grid-p">{res.items.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}</div>
        )}
        {res.pages > 1 && (
          <div className="pager">
            {res.page > 1 ? <Link className="btn sm" href={href({ page: res.page - 1 })}>← {t("cat.prev")}</Link> : <span />}
            <span className="muted">{t("cat.page")} {res.page} / {num(res.pages, lang)}</span>
            {res.page < res.pages ? <Link className="btn sm" href={href({ page: res.page + 1 })}>{t("cat.next")} →</Link> : <span />}
          </div>
        )}
      </section>
    </div>
  );
}
