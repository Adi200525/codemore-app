"use client";
import { useState } from "react";
import { useI18n } from "./I18n";
import { supabaseBrowser } from "@/lib/supabase/client";

function safeNext(n: string) {
  return n.startsWith("/") && !n.startsWith("//") ? n : "/account";
}

export default function LoginForm({ next, enabled }: { next: string; enabled: boolean }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!enabled) return <div className="msg err">{t("auth.off")}</div>;

  const dest = safeNext(next);

  async function oauth(provider: "google" | "apple") {
    setBusy(true);
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(dest)}` },
    });
    if (error) {
      setMsg({ text: t("auth.err"), err: true });
      setBusy(false);
    }
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabaseBrowser().auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) return setMsg({ text: t("auth.err"), err: true });
    setStage("code");
    setMsg({ text: t("auth.sent") });
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabaseBrowser().auth.verifyOtp({ email, token: code.trim(), type: "email" });
    if (error) {
      setBusy(false);
      return setMsg({ text: t("auth.bad"), err: true });
    }
    window.location.href = dest;
  }

  return (
    <>
      <button className="btn block" disabled={busy} onClick={() => oauth("google")}>{t("auth.google")}</button>
      <button className="btn block" disabled={busy} onClick={() => oauth("apple")}>{t("auth.apple")}</button>
      <div className="sep">{t("auth.or")}</div>
      {stage === "email" ? (
        <form onSubmit={sendCode} style={{ display: "grid", gap: 10 }}>
          <input className="field" type="email" required placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <button className="btn primary block" disabled={busy}>{t("auth.send")}</button>
        </form>
      ) : (
        <form onSubmit={verify} style={{ display: "grid", gap: 10 }}>
          <input className="field" inputMode="numeric" required placeholder={t("auth.code")} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" />
          <button className="btn primary block" disabled={busy}>{t("auth.verify")}</button>
        </form>
      )}
      {msg && <div className={`msg${msg.err ? " err" : ""}`}>{msg.text}</div>}
    </>
  );
}
