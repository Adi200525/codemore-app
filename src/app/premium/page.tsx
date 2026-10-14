import { getT } from "@/lib/lang";
import { getUser } from "@/lib/auth";
import { getSubscription, isPremium } from "@/lib/entitlement";
import { premium } from "@/lib/config";
import { dateFmt, money } from "@/lib/format";
import PlanButton from "@/components/PlanButton";
import Link from "next/link";

export const metadata = { title: "Premium" };

export default async function PremiumPage() {
  const { lang, t } = await getT();
  const user = await getUser();
  const sub = user ? await getSubscription(user.id) : null;
  const active = isPremium(sub);
  const saveP = Math.round((1 - premium.yearlyCents / (premium.monthlyCents * 12)) * 100);
  const feats = ["prem.f1", "prem.f2", "prem.f3", "prem.f4"] as const;

  return (
    <div className="wrap pt center">
      <span className="kicker">Premium</span>
      <h1>{t("prem.title")}</h1>
      <p className="muted">{t("prem.sub")}</p>
      {active ? (
        <div className="panel" style={{ maxWidth: 520, margin: "24px auto" }}>
          <h2>{t("prem.active")}</h2>
          {sub?.current_period_end && <p className="muted">{t("prem.until")}: {dateFmt(sub.current_period_end, lang)}</p>}
          <form action="/api/portal" method="post"><button className="btn primary">{t("prem.manage")}</button></form>
          <p style={{ marginTop: 14 }}><Link href="/catalog" className="linkbtn">{t("nav.catalog")} →</Link></p>
        </div>
      ) : (
        <div className="plans" style={{ textAlign: "left" }}>
          <div className="plan">
            <h3>{t("prem.monthly")}</h3>
            <div><span className="big-price">{money(premium.monthlyCents, lang)}</span><span className="muted">{t("prem.perMonth")}</span></div>
            <ul>{feats.map((f) => <li key={f}>{t(f)}</li>)}</ul>
            <PlanButton plan="monthly" loggedIn={!!user} />
          </div>
          <div className="plan best">
            <span className="tag">{t("prem.save")} {saveP}%</span>
            <h3>{t("prem.yearly")}</h3>
            <div><span className="big-price">{money(premium.yearlyCents, lang)}</span><span style={{ opacity: 0.7 }}>{t("prem.perYear")}</span></div>
            <ul>{feats.map((f) => <li key={f}>{t(f)}</li>)}</ul>
            <PlanButton plan="yearly" loggedIn={!!user} signal />
          </div>
        </div>
      )}
      <p className="small muted" style={{ marginTop: 20 }}>{t("prem.note")}</p>
    </div>
  );
}
