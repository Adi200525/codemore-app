import Link from "next/link";
import type { Product, Lang } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { makeT } from "@/lib/i18n";

export default function ProductCard({ p, lang }: { p: Product; lang: Lang }) {
  const t = makeT(lang);
  const stars = p.rating > 0 ? "★".repeat(Math.round(p.rating)) : "";
  return (
    <Link href={`/p/${p.slug}`} className="pcard">
      <div className="cv">
        <img src={p.coverUrl || `/api/cover/${p.id}`} alt="" loading="lazy" width={400} height={300} />
        {p.demo && <span className="tag">{t("p.demo")}</span>}
      </div>
      <div className="body">
        <h3>{p.name}</h3>
        <div className="meta">
          <span className="stars">{stars}</span>
          <span className="price">{money(p.priceCents, lang)}</span>
        </div>
      </div>
    </Link>
  );
}
