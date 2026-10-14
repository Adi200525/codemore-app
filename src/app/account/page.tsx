import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/lib/lang";
import { getUser } from "@/lib/auth";
import { getSubscription, isPremium } from "@/lib/entitlement";
import { supabaseServer } from "@/lib/supabase/server";
import { getProductsByIds } from "@/lib/catalog";
import { dateFmt } from "@/lib/format";

export const metadata = { title: "Account", robots: { index: false } };

export default async function Account() {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  const { lang, t } = await getT();
  const sb = await supabaseServer();
  const sub = await getSubscription(user.id);
  const { data } = sb
    ? await sb.from("purchases").select("product_id, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200)
    : { data: [] as { product_id: string; created_at: string }[] };
  const rows = data ?? [];
  const prods = await getProductsByIds(rows.map((r) => r.product_id));
  const byId = new Map(prods.map((p) => [p.id, p]));

  return (
    <div className="wrap pt" style={{ maxWidth: 820 }}>
      <h1 style={{ fontSize: "2.2rem" }}>{t("acc.title")}</h1>
      <p className="muted">{user.email}</p>

      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>{t("acc.sub")}</h3>
        {isPremium(sub) ? (
          <>
            <p><span className="tag">PREMIUM</span> {sub?.current_period_end && <span className="muted">{t("prem.until")}: {dateFmt(sub.current_period_end, lang)}</span>}</p>
            <form action="/api/portal" method="post"><button className="btn primary sm">{t("prem.manage")}</button></form>
          </>
        ) : (
          <>
            <p className="muted">{t("acc.free")}</p>
            <Link className="btn primary sm" href="/premium">{t("prem.start")}</Link>
          </>
        )}
      </div>

      <div className="panel">
        <h3>{t("acc.purchases")}</h3>
        {rows.length === 0 ? (
          <p className="muted">{t("acc.none")}</p>
        ) : (
          rows.map((r) => {
            const p = byId.get(r.product_id);
            return (
              <div className="cart-row" key={r.product_id}>
                <img src={`/api/cover/${r.product_id}`} alt="" />
                <div>
                  {p ? <Link href={`/p/${p.slug}`}><b>{p.name}</b></Link> : <b>{r.product_id}</b>}
                  <div className="small muted">{dateFmt(r.created_at, lang)}</div>
                </div>
                <a className="btn sm" href={`/api/download/${r.product_id}`}>{t("p.download")}</a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
