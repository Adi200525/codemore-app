"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";

export default function PlanButton({ plan, loggedIn, signal }: { plan: "monthly" | "yearly"; loggedIn: boolean; signal?: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function go() {
    if (!loggedIn) return router.push("/login?next=/premium");
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error();
      window.location.href = j.url;
    } catch {
      setErr(t("cart.err"));
      setBusy(false);
    }
  }
  return (
    <>
      <button className={`btn block ${signal ? "signal" : "primary"}`} disabled={busy} onClick={go}>{t("prem.start")}</button>
      {err && <div className="msg err">{err}</div>}
    </>
  );
}
