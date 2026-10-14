"use client";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "./I18n";
import { useCart } from "./Cart";
import { money } from "@/lib/format";

export default function CartView({ loggedIn }: { loggedIn: boolean }) {
  const { t, lang } = useI18n();
  const { items, remove, ready } = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const total = items.reduce((s, i) => s + i.priceCents, 0);

  async function checkout() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: items.map((i) => i.id) }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.error || "x");
      window.location.href = j.url;
    } catch {
      setErr(t("cart.err"));
      setBusy(false);
    }
  }

  if (!ready) return null;
  if (items.length === 0)
    return (
      <div className="panel center">
        <p>{t("cart.empty")}</p>
        <Link className="btn primary" href="/catalog">{t("nav.catalog")}</Link>
      </div>
    );

  return (
    <div className="cart-wrap" style={{ padding: 0 }}>
      <div className="panel">
        {items.map((i) => (
          <div className="cart-row" key={i.id}>
            <img src={`/api/cover/${i.id}`} alt="" />
            <div>
              <Link href={`/p/${i.slug}`}><b>{i.name}</b></Link>
              <div><button className="linkbtn small" onClick={() => remove(i.id)}>{t("cart.remove")}</button></div>
            </div>
            <span className="price">{money(i.priceCents, lang)}</span>
          </div>
        ))}
      </div>
      <aside className="panel" style={{ alignSelf: "start", display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <b>{t("cart.total")}</b>
          <span className="price">{money(total, lang)}</span>
        </div>
        {loggedIn ? (
          <button className="btn primary block" disabled={busy} onClick={checkout}>{t("cart.checkout")}</button>
        ) : (
          <Link className="btn primary block" href="/login?next=/cart">{t("cart.loginFirst")}</Link>
        )}
        {err && <div className="msg err">{err}</div>}
        <p className="small muted" style={{ margin: 0 }}>{t("cart.secure")}</p>
      </aside>
    </div>
  );
}
